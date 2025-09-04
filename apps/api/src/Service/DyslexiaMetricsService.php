<?php

namespace App\Service;

use App\Repository\GameSessionRepository;
use Doctrine\ORM\EntityManagerInterface;

class DyslexiaMetricsService
{
    public function __construct(
        private GameSessionRepository $gameSessionRepository,
        private EntityManagerInterface $entityManager
    ) {}

    public function calculateAggregatedMetrics(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $skillsData = $this->gameSessionRepository->getSkillsData($startDate, $endDate, $game);
        
        return [
            'visualDiscrimination' => [
                'average' => $skillsData['visualDiscrimination'],
                'trend' => $this->calculateSkillTrend($startDate, $endDate, 'visualDiscrimination', $game),
                'rating' => $this->getSkillRating($skillsData['visualDiscrimination'])
            ],
            'attentionSpan' => [
                'average' => $skillsData['attentionSpan'],
                'trend' => $this->calculateSkillTrend($startDate, $endDate, 'attentionSpan', $game),
                'rating' => $this->getSkillRating($skillsData['attentionSpan'])
            ],
            'processingSpeed' => [
                'average' => $skillsData['processingSpeed'],
                'trend' => $this->calculateSkillTrend($startDate, $endDate, 'processingSpeed', $game),
                'rating' => $this->getSkillRating($skillsData['processingSpeed'])
            ],
            'phonologicalAwareness' => [
                'average' => $skillsData['phonologicalAwareness'],
                'trend' => $this->calculateSkillTrend($startDate, $endDate, 'phonologicalAwareness', $game),
                'rating' => $this->getSkillRating($skillsData['phonologicalAwareness'])
            ]
        ];
    }

    public function getSkillsProgression(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $sql = "SELECT DATE(session_date) as date, 
                    AVG(visual_discrimination) as avgVisualDiscrimination,
                    AVG(attention_span) as avgAttentionSpan,
                    AVG(processing_speed) as avgProcessingSpeed,
                    AVG(phonological_awareness) as avgPhonologicalAwareness
                FROM game_sessions 
                WHERE session_date BETWEEN :startDate AND :endDate";
        
        $params = [
            'startDate' => $startDate->format('Y-m-d H:i:s'), 
            'endDate' => $endDate->format('Y-m-d H:i:s')
        ];
        
        if ($game) {
            $sql .= " AND game = :game";
            $params['game'] = $game;
        }
        
        $sql .= " GROUP BY DATE(session_date) ORDER BY date ASC";
        
        $stmt = $this->entityManager->getConnection()->prepare($sql);
        $result = $stmt->executeQuery($params);
        
        $progression = [];
        foreach ($result->fetchAllAssociative() as $row) {
            $progression[] = [
                'date' => $row['date'],
                'visualDiscrimination' => round((float) $row['avgVisualDiscrimination'], 2),
                'attentionSpan' => round((float) $row['avgAttentionSpan'], 2),
                'processingSpeed' => round((float) $row['avgProcessingSpeed'], 2),
                'phonologicalAwareness' => round((float) $row['avgPhonologicalAwareness'], 2)
            ];
        }

        return $progression;
    }

    public function getConsistencyMetrics(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $qb = $this->entityManager->createQueryBuilder()
            ->select('gs.accuracy, gs.score, gs.timeSpent')
            ->from('App\Entity\GameSession', 'gs')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        if ($game) {
            $qb->andWhere('gs.game = :game')
               ->setParameter('game', $game);
        }

        $results = $qb->getQuery()->getArrayResult();
        
        if (empty($results)) {
            return [
                'accuracyConsistency' => 0,
                'scoreConsistency' => 0,
                'timeConsistency' => 0,
                'overallConsistency' => 0
            ];
        }

        $accuracies = array_column($results, 'accuracy');
        $scores = array_column($results, 'score');
        $times = array_column($results, 'timeSpent');

        return [
            'accuracyConsistency' => $this->calculateConsistencyScore($accuracies),
            'scoreConsistency' => $this->calculateConsistencyScore($scores),
            'timeConsistency' => $this->calculateConsistencyScore($times),
            'overallConsistency' => $this->calculateOverallConsistency($accuracies, $scores, $times)
        ];
    }

    public function generateInsights(\DateTime $startDate, \DateTime $endDate): array
    {
        $insights = [];
        
        // Análisis de progreso general
        $progressInsight = $this->analyzeProgress($startDate, $endDate);
        if ($progressInsight) {
            $insights[] = $progressInsight;
        }

        // Análisis de patrones de uso
        $usageInsight = $this->analyzeUsagePatterns($startDate, $endDate);
        if ($usageInsight) {
            $insights[] = $usageInsight;
        }

        // Análisis de dificultades específicas
        $difficultiesInsight = $this->analyzeDifficulties($startDate, $endDate);
        if ($difficultiesInsight) {
            $insights[] = $difficultiesInsight;
        }

        // Recomendaciones personalizadas
        $recommendations = $this->generateRecommendations($startDate, $endDate);
        if (!empty($recommendations)) {
            $insights[] = [
                'type' => 'recommendations',
                'title' => 'Recomendaciones Personalizadas',
                'content' => $recommendations,
                'priority' => 'high'
            ];
        }

        return $insights;
    }

    private function calculateSkillTrend(\DateTime $startDate, \DateTime $endDate, string $skill, ?string $game = null): string
    {
        // Mapear nombres de propiedades a nombres de columnas
        $columnMap = [
            'visualDiscrimination' => 'visual_discrimination',
            'attentionSpan' => 'attention_span', 
            'processingSpeed' => 'processing_speed',
            'phonologicalAwareness' => 'phonological_awareness'
        ];
        
        $columnName = $columnMap[$skill] ?? $skill;
        
        $midPoint = clone $startDate;
        $midPoint->modify('+' . floor(($endDate->getTimestamp() - $startDate->getTimestamp()) / 2) . ' seconds');

        $sql1 = "SELECT AVG({$columnName}) as avgSkill
                FROM game_sessions 
                WHERE session_date BETWEEN :startDate AND :midPoint";
        
        $params1 = [
            'startDate' => $startDate->format('Y-m-d H:i:s'),
            'midPoint' => $midPoint->format('Y-m-d H:i:s')
        ];

        $sql2 = "SELECT AVG({$columnName}) as avgSkill
                FROM game_sessions 
                WHERE session_date BETWEEN :midPoint AND :endDate";
        
        $params2 = [
            'midPoint' => $midPoint->format('Y-m-d H:i:s'),
            'endDate' => $endDate->format('Y-m-d H:i:s')
        ];

        if ($game) {
            $sql1 .= " AND game = :game";
            $sql2 .= " AND game = :game";
            $params1['game'] = $game;
            $params2['game'] = $game;
        }

        $stmt1 = $this->entityManager->getConnection()->prepare($sql1);
        $result1 = $stmt1->executeQuery($params1);
        $firstHalf = (float) ($result1->fetchAssociative()['avgSkill'] ?? 0);

        $stmt2 = $this->entityManager->getConnection()->prepare($sql2);
        $result2 = $stmt2->executeQuery($params2);
        $secondHalf = (float) ($result2->fetchAssociative()['avgSkill'] ?? 0);

        $difference = $secondHalf - $firstHalf;

        if ($difference > 5) return 'improving';
        if ($difference < -5) return 'declining';
        return 'stable';
    }

    private function getSkillRating(float $score): string
    {
        if ($score >= 85) return 'excellent';
        if ($score >= 70) return 'good';
        if ($score >= 55) return 'average';
        if ($score >= 40) return 'below_average';
        return 'needs_improvement';
    }

    private function calculateConsistencyScore(array $values): float
    {
        if (count($values) < 2) return 100;

        $mean = array_sum($values) / count($values);
        $variance = array_sum(array_map(fn($x) => pow($x - $mean, 2), $values)) / count($values);
        $standardDeviation = sqrt($variance);
        
        $coefficientOfVariation = $mean > 0 ? ($standardDeviation / $mean) * 100 : 0;
        
        return max(0, 100 - $coefficientOfVariation);
    }

    private function calculateOverallConsistency(array $accuracies, array $scores, array $times): float
    {
        $accuracyConsistency = $this->calculateConsistencyScore($accuracies);
        $scoreConsistency = $this->calculateConsistencyScore($scores);
        $timeConsistency = $this->calculateConsistencyScore($times);

        return round(($accuracyConsistency + $scoreConsistency + $timeConsistency) / 3, 2);
    }

    private function analyzeProgress(\DateTime $startDate, \DateTime $endDate): ?array
    {
        $dailyProgress = $this->gameSessionRepository->getDailyProgress($startDate, $endDate);
        
        if (count($dailyProgress) < 3) {
            return null;
        }

        $firstWeek = array_slice($dailyProgress, 0, min(7, count($dailyProgress)));
        $lastWeek = array_slice($dailyProgress, -min(7, count($dailyProgress)));

        $firstWeekAvgScore = array_sum(array_column($firstWeek, 'averageScore')) / count($firstWeek);
        $lastWeekAvgScore = array_sum(array_column($lastWeek, 'averageScore')) / count($lastWeek);

        $improvement = $lastWeekAvgScore - $firstWeekAvgScore;
        $improvementPercent = $firstWeekAvgScore > 0 ? ($improvement / $firstWeekAvgScore) * 100 : 0;

        if ($improvementPercent > 10) {
            return [
                'type' => 'progress',
                'title' => 'Progreso Excelente',
                'content' => sprintf('Tu puntuación promedio ha mejorado un %.1f%% en el período analizado.', $improvementPercent),
                'priority' => 'high'
            ];
        } elseif ($improvementPercent > 5) {
            return [
                'type' => 'progress',
                'title' => 'Buen Progreso',
                'content' => sprintf('Muestras una mejora constante del %.1f%% en tu rendimiento.', $improvementPercent),
                'priority' => 'medium'
            ];
        }

        return null;
    }

    private function analyzeUsagePatterns(\DateTime $startDate, \DateTime $endDate): ?array
    {
        $gamePopularity = $this->gameSessionRepository->getGamePopularity($startDate, $endDate);
        
        if (empty($gamePopularity)) {
            return null;
        }

        $totalSessions = array_sum(array_column($gamePopularity, 'sessions'));
        $mostPlayedGame = $gamePopularity[0];

        if ($mostPlayedGame['sessions'] / $totalSessions > 0.8) {
            $otherGame = $mostPlayedGame['game'] === 'letter-detective' ? 'Word Builder' : 'Letter Detective';
            return [
                'type' => 'usage',
                'title' => 'Diversifica tu Entrenamiento',
                'content' => sprintf('Has jugado principalmente %s. Considera probar %s para un entrenamiento más completo.', 
                    ucfirst(str_replace('-', ' ', $mostPlayedGame['game'])), $otherGame),
                'priority' => 'medium'
            ];
        }

        return null;
    }

    private function analyzeDifficulties(\DateTime $startDate, \DateTime $endDate): ?array
    {
        $skillsData = $this->gameSessionRepository->getSkillsData($startDate, $endDate);
        
        $lowestSkill = null;
        $lowestScore = 100;

        foreach ($skillsData as $skill => $score) {
            if ($score < $lowestScore) {
                $lowestScore = $score;
                $lowestSkill = $skill;
            }
        }

        if ($lowestScore < 50) {
            $skillNames = [
                'visualDiscrimination' => 'discriminación visual',
                'attentionSpan' => 'capacidad de atención',
                'processingSpeed' => 'velocidad de procesamiento',
                'phonologicalAwareness' => 'conciencia fonológica'
            ];

            return [
                'type' => 'difficulty',
                'title' => 'Área de Mejora Identificada',
                'content' => sprintf('Tu %s tiene margen de mejora. Considera dedicar más tiempo a ejercicios específicos.', 
                    $skillNames[$lowestSkill] ?? $lowestSkill),
                'priority' => 'high'
            ];
        }

        return null;
    }

    private function generateRecommendations(\DateTime $startDate, \DateTime $endDate): array
    {
        $recommendations = [];
        
        $consistency = $this->getConsistencyMetrics($startDate, $endDate);
        
        if ($consistency['overallConsistency'] < 70) {
            $recommendations[] = 'Mantén sesiones de práctica regulares para mejorar la consistencia.';
        }

        $deviceBreakdown = $this->gameSessionRepository->getDeviceBreakdown($startDate, $endDate);
        
        if (isset($deviceBreakdown['mobile']) && $deviceBreakdown['mobile'] > 0) {
            $mobilePercent = ($deviceBreakdown['mobile'] / array_sum($deviceBreakdown)) * 100;
            if ($mobilePercent > 50) {
                $recommendations[] = 'Considera alternar entre dispositivo móvil y escritorio para una experiencia más variada.';
            }
        }

        $dailyProgress = $this->gameSessionRepository->getDailyProgress($startDate, $endDate);
        if (count($dailyProgress) < 10) {
            $recommendations[] = 'Aumenta la frecuencia de práctica para obtener mejores resultados.';
        }

        return $recommendations;
    }
}