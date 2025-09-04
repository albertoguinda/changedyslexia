<?php

namespace App\Controller;

use App\Repository\GameSessionRepository;
use App\Service\DyslexiaMetricsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/metrics', name: 'api_metrics_')]
class MetricsController extends AbstractController
{
    public function __construct(
        private GameSessionRepository $gameSessionRepository,
        private DyslexiaMetricsService $dyslexiaMetricsService
    ) {}

    #[Route('/dashboard', name: 'dashboard', methods: ['GET'])]
    public function getDashboardMetrics(Request $request): JsonResponse
    {
        $days = $request->query->getInt('days', 30);
        $game = $request->query->get('game');

        try {
            $endDate = new \DateTime();
            $startDate = (clone $endDate)->modify("-{$days} days");

            // Métricas básicas
            $totalSessions = $this->gameSessionRepository->getSessionCountBetweenDates($startDate, $endDate, $game);
            $todaySessions = $this->gameSessionRepository->getTodaySessionCount($game);
            $averageScore = $this->gameSessionRepository->getAverageScore($startDate, $endDate, $game);
            $averageAccuracy = $this->gameSessionRepository->getAverageAccuracy($startDate, $endDate, $game);

            // Métricas de dispositivos
            $deviceBreakdown = $this->gameSessionRepository->getDeviceBreakdown($startDate, $endDate, $game);
            
            // Popularidad de juegos
            $gamePopularity = $this->gameSessionRepository->getGamePopularity($startDate, $endDate);
            
            // Progresión temporal
            $dailyProgress = $this->gameSessionRepository->getDailyProgress($startDate, $endDate, $game);
            
            // Métricas específicas de dislexia
            $dyslexiaMetrics = $this->dyslexiaMetricsService->calculateAggregatedMetrics($startDate, $endDate, $game);

            return $this->json([
                'period' => [
                    'startDate' => $startDate->format('Y-m-d'),
                    'endDate' => $endDate->format('Y-m-d'),
                    'days' => $days
                ],
                'basic' => [
                    'totalSessions' => $totalSessions,
                    'todaySessions' => $todaySessions,
                    'averageScore' => round($averageScore, 2),
                    'averageAccuracy' => round($averageAccuracy, 2)
                ],
                'devices' => $deviceBreakdown,
                'games' => $gamePopularity,
                'progress' => $dailyProgress,
                'dyslexia' => $dyslexiaMetrics
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to retrieve metrics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/skills', name: 'skills', methods: ['GET'])]
    public function getSkillsMetrics(Request $request): JsonResponse
    {
        $days = $request->query->getInt('days', 30);
        $game = $request->query->get('game');

        try {
            $endDate = new \DateTime();
            $startDate = (clone $endDate)->modify("-{$days} days");

            $skillsData = $this->dyslexiaMetricsService->getSkillsProgression($startDate, $endDate, $game);

            return $this->json([
                'period' => [
                    'startDate' => $startDate->format('Y-m-d'),
                    'endDate' => $endDate->format('Y-m-d')
                ],
                'skills' => $skillsData
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to retrieve skills metrics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/performance', name: 'performance', methods: ['GET'])]
    public function getPerformanceMetrics(Request $request): JsonResponse
    {
        $days = $request->query->getInt('days', 7);
        $game = $request->query->get('game');

        try {
            $endDate = new \DateTime();
            $startDate = (clone $endDate)->modify("-{$days} days");

            $performance = [
                'accuracy' => $this->gameSessionRepository->getAccuracyTrend($startDate, $endDate, $game),
                'speed' => $this->gameSessionRepository->getSpeedTrend($startDate, $endDate, $game),
                'difficulty' => $this->gameSessionRepository->getDifficultyProgression($startDate, $endDate, $game),
                'consistency' => $this->dyslexiaMetricsService->getConsistencyMetrics($startDate, $endDate, $game)
            ];

            return $this->json([
                'period' => [
                    'startDate' => $startDate->format('Y-m-d'),
                    'endDate' => $endDate->format('Y-m-d')
                ],
                'performance' => $performance
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to retrieve performance metrics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/insights', name: 'insights', methods: ['GET'])]
    public function getInsights(Request $request): JsonResponse
    {
        $days = $request->query->getInt('days', 30);

        try {
            $endDate = new \DateTime();
            $startDate = (clone $endDate)->modify("-{$days} days");

            $insights = $this->dyslexiaMetricsService->generateInsights($startDate, $endDate);

            return $this->json([
                'period' => [
                    'startDate' => $startDate->format('Y-m-d'),
                    'endDate' => $endDate->format('Y-m-d')
                ],
                'insights' => $insights
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to generate insights',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/export', name: 'export', methods: ['GET'])]
    public function exportMetrics(Request $request): JsonResponse
    {
        $format = $request->query->get('format', 'json');
        $days = $request->query->getInt('days', 30);
        $game = $request->query->get('game');

        try {
            $endDate = new \DateTime();
            $startDate = (clone $endDate)->modify("-{$days} days");

            $sessions = $this->gameSessionRepository->getSessionsForExport($startDate, $endDate, $game);
            
            $exportData = array_map(function($session) {
                return [
                    'id' => $session->getId(),
                    'game' => $session->getGame(),
                    'score' => $session->getScore(),
                    'level' => $session->getLevel(),
                    'accuracy' => $session->getAccuracy(),
                    'timeSpent' => $session->getTimeSpent(),
                    'correctAnswers' => $session->getCorrectAnswers(),
                    'incorrectAnswers' => $session->getIncorrectAnswers(),
                    'deviceType' => $session->getDeviceType(),
                    'visualDiscrimination' => $session->getVisualDiscrimination(),
                    'attentionSpan' => $session->getAttentionSpan(),
                    'processingSpeed' => $session->getProcessingSpeed(),
                    'phonologicalAwareness' => $session->getPhonologicalAwareness(),
                    'sessionDate' => $session->getSessionDate()->format('Y-m-d H:i:s')
                ];
            }, $sessions);

            if ($format === 'csv') {
                return $this->generateCsvResponse($exportData);
            }

            return $this->json([
                'period' => [
                    'startDate' => $startDate->format('Y-m-d'),
                    'endDate' => $endDate->format('Y-m-d')
                ],
                'totalRecords' => count($exportData),
                'data' => $exportData
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Export failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/realtime', name: 'realtime', methods: ['GET'])]
    public function getRealtimeMetrics(): JsonResponse
    {
        try {
            $now = new \DateTime();
            $hourAgo = (clone $now)->modify('-1 hour');

            $realtimeData = [
                'activeNow' => $this->gameSessionRepository->getActiveSessions($hourAgo, $now),
                'sessionsLastHour' => $this->gameSessionRepository->getSessionCountBetweenDates($hourAgo, $now),
                'averageSessionTime' => $this->gameSessionRepository->getAverageSessionTime($hourAgo, $now),
                'currentAccuracy' => $this->gameSessionRepository->getAverageAccuracy($hourAgo, $now),
                'topPerformers' => $this->gameSessionRepository->getTopPerformers($hourAgo, $now, 5)
            ];

            return $this->json([
                'timestamp' => $now->format('Y-m-d H:i:s'),
                'realtime' => $realtimeData
            ]);

        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to retrieve realtime metrics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function generateCsvResponse(array $data): JsonResponse
    {
        if (empty($data)) {
            return $this->json(['error' => 'No data to export'], 400);
        }

        $headers = array_keys($data[0]);
        $csv = implode(',', $headers) . "\n";

        foreach ($data as $row) {
            $csv .= implode(',', array_map(function($value) {
                return '"' . str_replace('"', '""', $value) . '"';
            }, array_values($row))) . "\n";
        }

        return new JsonResponse([
            'format' => 'csv',
            'filename' => 'game_sessions_' . date('Y-m-d_H-i-s') . '.csv',
            'content' => base64_encode($csv),
            'mimeType' => 'text/csv'
        ]);
    }
}
