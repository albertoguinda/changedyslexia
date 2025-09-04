<?php

namespace App\Repository;

use App\Entity\GameSession;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GameSession>
 */
class GameSessionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GameSession::class);
    }

    public function getSessionCountBetweenDates(\DateTime $startDate, \DateTime $endDate, ?string $game = null): int
    {
        $qb = $this->createQueryBuilder('gs')
            ->select('COUNT(gs.id)')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        if ($game) {
            $qb->andWhere('gs.game = :game')
               ->setParameter('game', $game);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function getTodaySessionCount(?string $game = null): int
    {
        $today = new \DateTime();
        $today->setTime(0, 0, 0);
        $tomorrow = clone $today;
        $tomorrow->modify('+1 day');

        return $this->getSessionCountBetweenDates($today, $tomorrow, $game);
    }

    public function getAverageScore(\DateTime $startDate, \DateTime $endDate, ?string $game = null): float
    {
        $qb = $this->createQueryBuilder('gs')
            ->select('AVG(gs.score)')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        if ($game) {
            $qb->andWhere('gs.game = :game')
               ->setParameter('game', $game);
        }

        return (float) ($qb->getQuery()->getSingleScalarResult() ?? 0);
    }

    public function getAverageAccuracy(\DateTime $startDate, \DateTime $endDate, ?string $game = null): float
    {
        $qb = $this->createQueryBuilder('gs')
            ->select('AVG(gs.accuracy)')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        if ($game) {
            $qb->andWhere('gs.game = :game')
               ->setParameter('game', $game);
        }

        return (float) ($qb->getQuery()->getSingleScalarResult() ?? 0);
    }

    public function getDeviceBreakdown(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $qb = $this->createQueryBuilder('gs')
            ->select('gs.deviceType, COUNT(gs.id) as sessionCount')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->groupBy('gs.deviceType')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        if ($game) {
            $qb->andWhere('gs.game = :game')
               ->setParameter('game', $game);
        }

        $results = $qb->getQuery()->getArrayResult();
        
        $breakdown = [];
        foreach ($results as $result) {
            $breakdown[$result['deviceType']] = (int) $result['sessionCount'];
        }

        return $breakdown;
    }

    public function getGamePopularity(\DateTime $startDate, \DateTime $endDate): array
    {
        $qb = $this->createQueryBuilder('gs')
            ->select('gs.game, COUNT(gs.id) as sessionCount, AVG(gs.score) as averageScore, AVG(gs.accuracy) as averageAccuracy')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->groupBy('gs.game')
            ->orderBy('sessionCount', 'DESC')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        $results = $qb->getQuery()->getArrayResult();
        
        $popularity = [];
        foreach ($results as $result) {
            $popularity[] = [
                'game' => $result['game'],
                'sessions' => (int) $result['sessionCount'],
                'averageScore' => round((float) $result['averageScore'], 2),
                'averageAccuracy' => round((float) $result['averageAccuracy'], 2)
            ];
        }

        return $popularity;
    }

    public function getDailyProgress(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $sql = "SELECT DATE(session_date) as date, COUNT(id) as sessions, AVG(score) as avgScore, AVG(accuracy) as avgAccuracy 
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
        
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $result = $stmt->executeQuery($params);
        
        $progress = [];
        foreach ($result->fetchAllAssociative() as $row) {
            $progress[] = [
                'date' => $row['date'],
                'sessions' => (int) $row['sessions'],
                'averageScore' => round((float) $row['avgScore'], 2),
                'averageAccuracy' => round((float) $row['avgAccuracy'], 2)
            ];
        }
        
        return $progress;
    }

    public function getAccuracyTrend(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $sql = "SELECT DATE(session_date) as date, AVG(accuracy) as avgAccuracy 
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
        
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $result = $stmt->executeQuery($params);
        
        $trend = [];
        foreach ($result->fetchAllAssociative() as $row) {
            $trend[] = [
                'date' => $row['date'],
                'accuracy' => round((float) $row['avgAccuracy'], 2)
            ];
        }
        
        return $trend;
    }

    public function getSpeedTrend(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $sql = "SELECT DATE(session_date) as date, AVG(time_spent) as avgTime 
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
        
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $result = $stmt->executeQuery($params);
        
        $trend = [];
        foreach ($result->fetchAllAssociative() as $row) {
            $trend[] = [
                'date' => $row['date'],
                'averageTime' => round((float) $row['avgTime'], 2)
            ];
        }
        
        return $trend;
    }

    public function getDifficultyProgression(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $sql = "SELECT DATE(session_date) as date, AVG(level) as avgLevel, MAX(level) as maxLevel 
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
        
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $result = $stmt->executeQuery($params);
        
        $progression = [];
        foreach ($result->fetchAllAssociative() as $row) {
            $progression[] = [
                'date' => $row['date'],
                'averageLevel' => round((float) $row['avgLevel'], 2),
                'maxLevel' => (int) $row['maxLevel']
            ];
        }
        
        return $progression;
    }

    public function getSessionsForExport(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $qb = $this->createQueryBuilder('gs')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->orderBy('gs.sessionDate', 'DESC')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate);

        if ($game) {
            $qb->andWhere('gs.game = :game')
               ->setParameter('game', $game);
        }

        return $qb->getQuery()->getResult();
    }

    public function getActiveSessions(\DateTime $startTime, \DateTime $endTime): int
    {
        return $this->createQueryBuilder('gs')
            ->select('COUNT(gs.id)')
            ->where('gs.startTime BETWEEN :startTime AND :endTime')
            ->setParameter('startTime', $startTime)
            ->setParameter('endTime', $endTime)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getAverageSessionTime(\DateTime $startDate, \DateTime $endDate): float
    {
        return (float) $this->createQueryBuilder('gs')
            ->select('AVG(gs.totalPlayTime)')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->getQuery()
            ->getSingleScalarResult() ?? 0;
    }

    public function getTopPerformers(\DateTime $startDate, \DateTime $endDate, int $limit = 10): array
    {
        $results = $this->createQueryBuilder('gs')
            ->select('gs.score, gs.accuracy, gs.game, gs.sessionDate')
            ->where('gs.sessionDate BETWEEN :startDate AND :endDate')
            ->orderBy('gs.score', 'DESC')
            ->addOrderBy('gs.accuracy', 'DESC')
            ->setMaxResults($limit)
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->getQuery()
            ->getArrayResult();

        return $results;
    }

    public function getSkillsData(\DateTime $startDate, \DateTime $endDate, ?string $game = null): array
    {
        $sql = "SELECT AVG(visual_discrimination) as avgVisualDiscrimination, 
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
        
        $stmt = $this->getEntityManager()->getConnection()->prepare($sql);
        $result = $stmt->executeQuery($params);
        $row = $result->fetchAssociative();
        
        return [
            'visualDiscrimination' => round((float) ($row['avgVisualDiscrimination'] ?? 0), 2),
            'attentionSpan' => round((float) ($row['avgAttentionSpan'] ?? 0), 2),
            'processingSpeed' => round((float) ($row['avgProcessingSpeed'] ?? 0), 2),
            'phonologicalAwareness' => round((float) ($row['avgPhonologicalAwareness'] ?? 0), 2)
        ];
    }
}