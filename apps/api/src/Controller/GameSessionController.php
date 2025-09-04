<?php

namespace App\Controller;

use App\Entity\GameSession;
use App\Repository\GameSessionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/game-sessions', name: 'api_game_sessions_')]
class GameSessionController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!$data) {
                return $this->json(['error' => 'Invalid JSON data'], 400);
            }

            // Crear fechas automáticamente
            $now = new \DateTime();
            $startTime = $now;
            $endTime = clone $now;
            
            // Si tenemos totalPlayTime, calculamos endTime
            if (isset($data['totalPlayTime']) && $data['totalPlayTime'] > 0) {
                $endTime->modify('+' . $data['totalPlayTime'] . ' seconds');
            }

            $session = new GameSession();
            $session->setGame($data['game'] ?? 'unknown');
            $session->setVersion($data['version'] ?? '1.0.0');
            $session->setScore($data['score'] ?? 0);
            $session->setLevel($data['level'] ?? 1);
            $session->setAccuracy($data['accuracy'] ?? 0);
            $session->setTimeSpent($data['timeSpent'] ?? 0);
            $session->setTotalPlayTime($data['totalPlayTime'] ?? 0);
            $session->setCorrectAnswers($data['correctAnswers'] ?? 0);
            $session->setIncorrectAnswers($data['incorrectAnswers'] ?? 0);
            $session->setTotalAttempts($data['totalAttempts'] ?? 0);
            $session->setBestStreak($data['bestStreak'] ?? 0);
            $session->setHintsUsed($data['hintsUsed'] ?? 0);
            $session->setDeviceType($data['deviceType'] ?? 'desktop');
            $session->setScreenSize($data['screenSize'] ?? '1920x1080');
            $session->setPerformanceRating($data['performanceRating'] ?? 'Good');
            $session->setVisualDiscrimination($data['visualDiscrimination'] ?? 50);
            $session->setAttentionSpan($data['attentionSpan'] ?? 50);
            $session->setProcessingSpeed($data['processingSpeed'] ?? 50);
            $session->setPhonologicalAwareness($data['phonologicalAwareness'] ?? 50);
            
            // Establecer fechas automáticamente
            $session->setStartTime($startTime);
            $session->setEndTime($endTime);

            // Manejo de campos JSON
            if (isset($data['skillMetrics'])) {
                $session->setSkillMetrics(is_array($data['skillMetrics']) ? $data['skillMetrics'] : []);
            }
            if (isset($data['detailedMetrics'])) {
                $session->setDetailedMetrics(is_array($data['detailedMetrics']) ? $data['detailedMetrics'] : []);
            }

            $this->entityManager->persist($session);
            $this->entityManager->flush();

            return $this->json([
                'status' => 'success',
                'id' => $session->getId(),
                'message' => 'Game session created successfully'
            ], 201);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to create session',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request, GameSessionRepository $repository): JsonResponse
    {
        $limit = $request->query->getInt('limit', 50);
        $offset = $request->query->getInt('offset', 0);
        $game = $request->query->get('game');
        $deviceType = $request->query->get('deviceType');

        $criteria = [];
        if ($game) $criteria['game'] = $game;
        if ($deviceType) $criteria['deviceType'] = $deviceType;

        $sessions = $repository->findBy(
            $criteria,
            ['sessionDate' => 'DESC'],
            $limit,
            $offset
        );

        $data = array_map(function(GameSession $session) {
            return [
                'id' => $session->getId(),
                'game' => $session->getGame(),
                'score' => $session->getScore(),
                'level' => $session->getLevel(),
                'accuracy' => $session->getAccuracy(),
                'timeSpent' => $session->getTimeSpent(),
                'deviceType' => $session->getDeviceType(),
                'sessionDate' => $session->getSessionDate()->format('Y-m-d H:i:s'),
                'performanceRating' => $session->getPerformanceRating()
            ];
        }, $sessions);

        return $this->json([
            'sessions' => $data,
            'total' => count($data),
            'limit' => $limit,
            'offset' => $offset
        ]);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, GameSessionRepository $repository): JsonResponse
    {
        $session = $repository->find($id);
        
        if (!$session) {
            return $this->json(['error' => 'Session not found'], 404);
        }

        return $this->json([
            'id' => $session->getId(),
            'game' => $session->getGame(),
            'version' => $session->getVersion(),
            'score' => $session->getScore(),
            'level' => $session->getLevel(),
            'accuracy' => $session->getAccuracy(),
            'timeSpent' => $session->getTimeSpent(),
            'totalPlayTime' => $session->getTotalPlayTime(),
            'correctAnswers' => $session->getCorrectAnswers(),
            'incorrectAnswers' => $session->getIncorrectAnswers(),
            'totalAttempts' => $session->getTotalAttempts(),
            'bestStreak' => $session->getBestStreak(),
            'hintsUsed' => $session->getHintsUsed(),
            'skillMetrics' => $session->getSkillMetrics(),
            'detailedMetrics' => $session->getDetailedMetrics(),
            'sessionDate' => $session->getSessionDate()->format('Y-m-d H:i:s'),
            'startTime' => $session->getStartTime()?->format('Y-m-d H:i:s'),
            'endTime' => $session->getEndTime()?->format('Y-m-d H:i:s'),
            'deviceType' => $session->getDeviceType(),
            'screenSize' => $session->getScreenSize(),
            'performanceRating' => $session->getPerformanceRating(),
            'visualDiscrimination' => $session->getVisualDiscrimination(),
            'attentionSpan' => $session->getAttentionSpan(),
            'processingSpeed' => $session->getProcessingSpeed(),
            'phonologicalAwareness' => $session->getPhonologicalAwareness()
        ]);
    }

    #[Route('/bulk', name: 'bulk_create', methods: ['POST'])]
    public function bulkCreate(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            
            if (!isset($data['sessions']) || !is_array($data['sessions'])) {
                return $this->json(['error' => 'Sessions array required'], 400);
            }

            $createdSessions = [];
            $errors = [];

            foreach ($data['sessions'] as $index => $sessionData) {
                try {
                    $session = new GameSession();
                    $session->setGame($sessionData['game'] ?? '')
                            ->setScore($sessionData['score'] ?? 0)
                            ->setLevel($sessionData['level'] ?? 1)
                            ->setAccuracy($sessionData['accuracy'] ?? 0)
                            ->setTimeSpent($sessionData['timeSpent'] ?? 0)
                            ->setTotalPlayTime($sessionData['totalPlayTime'] ?? 0)
                            ->setCorrectAnswers($sessionData['correctAnswers'] ?? 0)
                            ->setIncorrectAnswers($sessionData['incorrectAnswers'] ?? 0)
                            ->setTotalAttempts($sessionData['totalAttempts'] ?? 0)
                            ->setBestStreak($sessionData['bestStreak'] ?? 0)
                            ->setHintsUsed($sessionData['hintsUsed'] ?? 0)
                            ->setDeviceType($sessionData['deviceType'] ?? 'desktop')
                            ->setPerformanceRating($sessionData['performanceRating'] ?? 'Good')
                            ->setVisualDiscrimination($sessionData['visualDiscrimination'] ?? 50)
                            ->setAttentionSpan($sessionData['attentionSpan'] ?? 50)
                            ->setProcessingSpeed($sessionData['processingSpeed'] ?? 50)
                            ->setPhonologicalAwareness($sessionData['phonologicalAwareness'] ?? 50);

                    $this->entityManager->persist($session);
                    $createdSessions[] = $session;
                    
                } catch (\Exception $e) {
                    $errors[] = "Session $index: " . $e->getMessage();
                }
            }

            $this->entityManager->flush();

            return $this->json([
                'status' => 'success',
                'created' => count($createdSessions),
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Bulk creation failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}