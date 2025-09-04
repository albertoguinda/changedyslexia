<?php

namespace App\DataFixtures;

use App\Entity\GameSession;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('es_ES');
        
        // Crear usuarios de prueba
        $users = [];
        for ($i = 0; $i < 5; $i++) {
            $user = new User();
            $user->setEmail($faker->unique()->email)
                 ->setName($faker->name)
                 ->setPassword('$2y$13$dummy.password.hash.for.demo.purposes.only'); // Hash dummy
            
            $manager->persist($user);
            $users[] = $user;
        }

        // Datos realistas para los juegos
        $games = ['letter-detective', 'word-builder'];
        $deviceTypes = ['mobile', 'tablet', 'desktop'];
        $deviceWeights = [0.4, 0.2, 0.4]; // 40% móvil, 20% tablet, 40% desktop

        $performanceRatings = [
            'Excelente conciencia fonológica',
            'Muy buena segmentación silábica', 
            'Construcción silábica excepcional',
            'Buen progreso en construcción',
            'Sigue practicando, vas bien',
            'Cada intento te hace mejorar'
        ];

        // Generar 150 sesiones de juego realistas
        for ($i = 0; $i < 150; $i++) {
            $session = new GameSession();
            
            // Datos básicos
            $game = $faker->randomElement($games);
            $device = $faker->randomElement($deviceTypes, $deviceWeights);
            $user = $faker->randomElement($users);
            
            // Fecha entre los últimos 60 días
            $sessionDate = $faker->dateTimeBetween('-60 days', 'now');
            
            // Métricas realistas basadas en el juego
            if ($game === 'letter-detective') {
                $level = $faker->numberBetween(1, 8);
                $baseScore = $level * 45 + $faker->numberBetween(-20, 100);
                $accuracy = $this->calculateRealisticAccuracy($level, $device);
                $timeSpent = $faker->numberBetween(15, 55); // 15-55 segundos por sesión
                $totalPlayTime = $faker->numberBetween(60, 300); // 1-5 minutos total
                
                // Métricas específicas Letter Detective
                $correctAnswers = (int)($accuracy * $faker->numberBetween(8, 25) / 100);
                $incorrectAnswers = $faker->numberBetween(0, 8);
                $totalAttempts = $correctAnswers + $incorrectAnswers;
                $bestStreak = min($correctAnswers, $faker->numberBetween(1, 12));
                $hintsUsed = $faker->numberBetween(0, 3);
                
                // Habilidades específicas para dislexia
                $visualDiscrimination = $this->calculateSkillScore($accuracy, 'visual', $level);
                $attentionSpan = $this->calculateSkillScore($accuracy, 'attention', $level);
                $processingSpeed = $this->calculateSkillScore($timeSpent, 'speed', $level);
                $phonologicalAwareness = $faker->numberBetween(40, 90);
                
            } else { // word-builder
                $level = $faker->numberBetween(1, 4);
                $baseScore = $level * 80 + $faker->numberBetween(-30, 150);
                $accuracy = $this->calculateRealisticAccuracy($level, $device);
                $timeSpent = $faker->numberBetween(20, 30); // 20-30 segundos por palabra
                $totalPlayTime = $faker->numberBetween(120, 600); // 2-10 minutos total
                
                // Métricas específicas Word Builder
                $correctAnswers = $faker->numberBetween(3, 15);
                $incorrectAnswers = $faker->numberBetween(0, 5);
                $totalAttempts = $correctAnswers + $incorrectAnswers;
                $bestStreak = min($correctAnswers, $faker->numberBetween(1, 8));
                $hintsUsed = $faker->numberBetween(0, 5);
                
                // Habilidades específicas para dislexia
                $phonologicalAwareness = $this->calculateSkillScore($accuracy, 'phonological', $level);
                $attentionSpan = $this->calculateSkillScore($accuracy, 'attention', $level);
                $processingSpeed = $this->calculateSkillScore($timeSpent, 'speed', $level);
                $visualDiscrimination = $faker->numberBetween(50, 95);
            }
            
            // Ajustar score final
            $score = max(0, $baseScore + ($accuracy * 2) - ($hintsUsed * 10));
            
            $session->setGame($game)
                   ->setVersion('1.0.0')
                   ->setScore($score)
                   ->setLevel($level)
                   ->setAccuracy($accuracy)
                   ->setTimeSpent($timeSpent)
                   ->setTotalPlayTime($totalPlayTime)
                   ->setCorrectAnswers($correctAnswers)
                   ->setIncorrectAnswers($incorrectAnswers)
                   ->setTotalAttempts($totalAttempts)
                   ->setBestStreak($bestStreak)
                   ->setHintsUsed($hintsUsed)
                   ->setSkillMetrics($this->generateSkillMetrics($game, $level, $accuracy))
                   ->setDetailedMetrics($this->generateDetailedMetrics($game, $accuracy, $timeSpent))
                   ->setSessionDate($sessionDate)
                   ->setStartTime($sessionDate)
                   ->setEndTime((clone $sessionDate)->modify('+' . $totalPlayTime . ' seconds'))
                   ->setDeviceType($device)
                   ->setScreenSize($this->getScreenSize($device))
                   ->setPerformanceRating($faker->randomElement($performanceRatings))
                   ->setVisualDiscrimination($visualDiscrimination)
                   ->setAttentionSpan($attentionSpan)
                   ->setProcessingSpeed($processingSpeed)
                   ->setPhonologicalAwareness($phonologicalAwareness)
                   ->setUser($faker->boolean(70) ? $user : null); // 70% asignados a usuario
                   
            $manager->persist($session);
        }

        $manager->flush();
    }

    private function calculateRealisticAccuracy(int $level, string $device): int
    {
        // Base accuracy por nivel
        $baseAccuracy = match($level) {
            1 => 85,
            2 => 80,
            3 => 75,
            4 => 70,
            default => max(65, 80 - ($level * 3))
        };
        
        // Ajuste por dispositivo
        $deviceModifier = match($device) {
            'mobile' => -5,    // Más difícil en móvil
            'tablet' => 0,     // Neutral
            'desktop' => 3     // Más fácil en desktop
        };
        
        $accuracy = $baseAccuracy + $deviceModifier + random_int(-15, 20);
        return max(30, min(100, $accuracy));
    }

    private function calculateSkillScore(int $baseMetric, string $skillType, int $level): int
    {
        $baseScore = match($skillType) {
            'visual' => max(40, 85 - ($level * 2) + random_int(-10, 15)),
            'attention' => max(35, 80 - ($level * 3) + random_int(-12, 18)),
            'speed' => max(45, 100 - $baseMetric + random_int(-8, 12)),
            'phonological' => max(40, 75 + ($level * 3) + random_int(-15, 20)),
            default => random_int(40, 90)
        };
        
        return max(25, min(100, $baseScore));
    }

    private function generateSkillMetrics(string $game, int $level, int $accuracy): array
    {
        if ($game === 'letter-detective') {
            return [
                'letterConfusion' => [
                    'b_d_errors' => random_int(0, 5),
                    'p_q_errors' => random_int(0, 3),
                    'total_confusion_errors' => random_int(0, 8)
                ],
                'reactionTimes' => [
                    'average_ms' => random_int(800, 2500),
                    'fastest_ms' => random_int(400, 1000),
                    'slowest_ms' => random_int(1500, 4000)
                ],
                'difficulty_adaptation' => [
                    'level_up_count' => random_int(0, 3),
                    'level_down_count' => random_int(0, 1)
                ]
            ];
        } else {
            return [
                'syllable_construction' => [
                    'correct_first_attempt' => random_int(2, 8),
                    'required_hints' => random_int(0, 4),
                    'syllable_errors' => random_int(0, 6)
                ],
                'word_difficulty' => [
                    'two_syllable_accuracy' => random_int(70, 100),
                    'three_syllable_accuracy' => random_int(50, 90),
                    'four_syllable_accuracy' => random_int(30, 80)
                ],
                'construction_time' => [
                    'average_per_word_sec' => random_int(15, 45),
                    'fastest_word_sec' => random_int(8, 20),
                    'slowest_word_sec' => random_int(25, 80)
                ]
            ];
        }
    }

    private function generateDetailedMetrics(string $game, int $accuracy, int $timeSpent): array
    {
        return [
            'session_quality' => [
                'focus_score' => random_int(60, 100),
                'engagement_level' => random_int(70, 100),
                'frustration_indicators' => random_int(0, 3)
            ],
            'learning_indicators' => [
                'improvement_within_session' => random_int(-5, 15),
                'consistency_score' => random_int(50, 95),
                'adaptive_difficulty' => $accuracy > 80 ? 'increase' : ($accuracy < 60 ? 'decrease' : 'maintain')
            ],
            'technical_metrics' => [
                'session_stability' => random_int(95, 100),
                'input_lag_ms' => random_int(10, 50),
                'frame_drops' => random_int(0, 2)
            ]
        ];
    }

    private function getScreenSize(string $device): string
    {
        return match($device) {
            'mobile' => ['360x640', '375x667', '414x896'][array_rand(['360x640', '375x667', '414x896'])],
            'tablet' => ['768x1024', '810x1080', '834x1194'][array_rand(['768x1024', '810x1080', '834x1194'])],
            'desktop' => ['1920x1080', '1366x768', '1440x900', '2560x1440'][array_rand(['1920x1080', '1366x768', '1440x900', '2560x1440'])],
            default => '1920x1080'
        };
    }
}