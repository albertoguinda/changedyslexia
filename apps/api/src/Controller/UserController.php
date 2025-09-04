<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/users', name: 'api_users_')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->json(['error' => 'Invalid JSON data'], 400);
            }

            if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
                return $this->json(['error' => 'Email, password and name are required'], 400);
            }

            $user = new User();
            $user->setEmail($data['email'])
                 ->setName($data['name'])
                 ->setRoles($data['roles'] ?? ['ROLE_USER']);

            // Hash password
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return $this->json(['errors' => $errorMessages], 400);
            }

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return $this->json([
                'status' => 'success',
                'id' => $user->getId(),
                'message' => 'User registered successfully'
            ], 201);

        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'Duplicate entry')) {
                return $this->json(['error' => 'Email already exists'], 409);
            }
            
            return $this->json([
                'error' => 'Registration failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, UserRepository $repository): JsonResponse
    {
        $limit = $request->query->getInt('limit', 50);
        $offset = $request->query->getInt('offset', 0);

        $users = $repository->findBy(
            ['isActive' => true],
            ['createdAt' => 'DESC'],
            $limit,
            $offset
        );

        $data = array_map(function(User $user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'name' => $user->getName(),
                'roles' => $user->getRoles(),
                'isActive' => $user->isActive(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
                'lastLoginAt' => $user->getLastLoginAt()?->format('Y-m-d H:i:s'),
                'sessionsCount' => $user->getGameSessions()->count()
            ];
        }, $users);

        return $this->json([
            'users' => $data,
            'total' => count($data),
            'limit' => $limit,
            'offset' => $offset
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, UserRepository $repository): JsonResponse
    {
        $user = $repository->find($id);
        
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'roles' => $user->getRoles(),
            'isActive' => $user->isActive(),
            'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            'lastLoginAt' => $user->getLastLoginAt()?->format('Y-m-d H:i:s'),
            'gameSessions' => array_map(function($session) {
                return [
                    'id' => $session->getId(),
                    'game' => $session->getGame(),
                    'score' => $session->getScore(),
                    'level' => $session->getLevel(),
                    'accuracy' => $session->getAccuracy(),
                    'sessionDate' => $session->getSessionDate()->format('Y-m-d H:i:s')
                ];
            }, $user->getGameSessions()->toArray())
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, UserRepository $repository): JsonResponse
    {
        try {
            $user = $repository->find($id);
            
            if (!$user) {
                return $this->json(['error' => 'User not found'], 404);
            }

            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->json(['error' => 'Invalid JSON data'], 400);
            }

            if (isset($data['name'])) {
                $user->setName($data['name']);
            }
            
            if (isset($data['email'])) {
                $user->setEmail($data['email']);
            }
            
            if (isset($data['roles'])) {
                $user->setRoles($data['roles']);
            }
            
            if (isset($data['isActive'])) {
                $user->setIsActive($data['isActive']);
            }
            
            if (isset($data['password'])) {
                $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
                $user->setPassword($hashedPassword);
            }

            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return $this->json(['errors' => $errorMessages], 400);
            }

            $this->entityManager->flush();

            return $this->json([
                'status' => 'success',
                'message' => 'User updated successfully'
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Update failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, UserRepository $repository): JsonResponse
    {
        try {
            $user = $repository->find($id);
            
            if (!$user) {
                return $this->json(['error' => 'User not found'], 404);
            }

            // Soft delete - mark as inactive instead of removing
            $user->setIsActive(false);
            $this->entityManager->flush();

            return $this->json([
                'status' => 'success',
                'message' => 'User deactivated successfully'
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Deletion failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/{id}/stats', name: 'stats', methods: ['GET'])]
    public function getUserStats(int $id, UserRepository $repository): JsonResponse
    {
        try {
            $user = $repository->find($id);
            
            if (!$user) {
                return $this->json(['error' => 'User not found'], 404);
            }

            $sessions = $user->getGameSessions();
            
            if ($sessions->isEmpty()) {
                return $this->json([
                    'user' => [
                        'id' => $user->getId(),
                        'name' => $user->getName()
                    ],
                    'stats' => [
                        'totalSessions' => 0,
                        'message' => 'No game sessions found'
                    ]
                ]);
            }

            // Calculate user statistics
            $totalSessions = $sessions->count();
            $totalScore = array_sum(array_map(fn($s) => $s->getScore(), $sessions->toArray()));
            $averageScore = $totalScore / $totalSessions;
            $totalAccuracy = array_sum(array_map(fn($s) => $s->getAccuracy(), $sessions->toArray()));
            $averageAccuracy = $totalAccuracy / $totalSessions;
            $bestScore = max(array_map(fn($s) => $s->getScore(), $sessions->toArray()));
            $maxLevel = max(array_map(fn($s) => $s->getLevel(), $sessions->toArray()));

            // Game breakdown
            $gameStats = [];
            foreach ($sessions as $session) {
                $game = $session->getGame();
                if (!isset($gameStats[$game])) {
                    $gameStats[$game] = [
                        'sessions' => 0,
                        'totalScore' => 0,
                        'totalAccuracy' => 0,
                        'bestScore' => 0,
                        'maxLevel' => 0
                    ];
                }
                $gameStats[$game]['sessions']++;
                $gameStats[$game]['totalScore'] += $session->getScore();
                $gameStats[$game]['totalAccuracy'] += $session->getAccuracy();
                $gameStats[$game]['bestScore'] = max($gameStats[$game]['bestScore'], $session->getScore());
                $gameStats[$game]['maxLevel'] = max($gameStats[$game]['maxLevel'], $session->getLevel());
            }

            // Calculate averages for each game
            foreach ($gameStats as $game => &$stats) {
                $stats['averageScore'] = round($stats['totalScore'] / $stats['sessions'], 2);
                $stats['averageAccuracy'] = round($stats['totalAccuracy'] / $stats['sessions'], 2);
            }

            return $this->json([
                'user' => [
                    'id' => $user->getId(),
                    'name' => $user->getName(),
                    'email' => $user->getEmail()
                ],
                'stats' => [
                    'totalSessions' => $totalSessions,
                    'averageScore' => round($averageScore, 2),
                    'averageAccuracy' => round($averageAccuracy, 2),
                    'bestScore' => $bestScore,
                    'maxLevel' => $maxLevel,
                    'gameBreakdown' => $gameStats
                ]
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to retrieve user stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}