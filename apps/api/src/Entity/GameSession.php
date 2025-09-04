<?php

namespace App\Entity;

use App\Repository\GameSessionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: GameSessionRepository::class)]
#[ORM\Table(name: 'game_sessions')]
#[ORM\Index(columns: ['game', 'session_date'], name: 'idx_game_date')]
#[ORM\Index(columns: ['device_type'], name: 'idx_device')]
#[ORM\Index(columns: ['session_date'], name: 'idx_date')]
class GameSession
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['letter-detective', 'word-builder'])]
    private ?string $game = null;

    #[ORM\Column(length: 20)]
    private ?string $version = '1.0.0';

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $score = null;

    #[ORM\Column]
    #[Assert\Positive]
    private ?int $level = null;

    #[ORM\Column]
    #[Assert\Range(min: 0, max: 100)]
    private ?int $accuracy = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $timeSpent = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $totalPlayTime = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $correctAnswers = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $incorrectAnswers = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $totalAttempts = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $bestStreak = null;

    #[ORM\Column]
    #[Assert\PositiveOrZero]
    private ?int $hintsUsed = null;

    #[ORM\Column(type: Types::JSON)]
    private array $skillMetrics = [];

    #[ORM\Column(type: Types::JSON)]
    private array $detailedMetrics = [];

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $sessionDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $startTime = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: ['mobile', 'tablet', 'desktop'])]
    private ?string $deviceType = null;

    #[ORM\Column(length: 50)]
    private ?string $screenSize = null;

    #[ORM\Column(length: 100)]
    private ?string $performanceRating = null;

    #[ORM\Column]
    #[Assert\Range(min: 0, max: 100)]
    private ?int $visualDiscrimination = null;

    #[ORM\Column]
    #[Assert\Range(min: 0, max: 100)]
    private ?int $attentionSpan = null;

    #[ORM\Column]
    #[Assert\Range(min: 0, max: 100)]
    private ?int $processingSpeed = null;

    #[ORM\Column]
    #[Assert\Range(min: 0, max: 100)]
    private ?int $phonologicalAwareness = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'gameSessions')]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $user = null;

    #[ORM\OneToMany(targetEntity: GameMetric::class, mappedBy: 'gameSession', cascade: ['persist', 'remove'])]
    private Collection $gameMetrics;

    public function __construct()
    {
        $this->gameMetrics = new ArrayCollection();
        $this->sessionDate = new \DateTime();
        $this->startTime = new \DateTime();
        $this->skillMetrics = [];
        $this->detailedMetrics = [];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGame(): ?string
    {
        return $this->game;
    }

    public function setGame(string $game): static
    {
        $this->game = $game;
        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): static
    {
        $this->version = $version;
        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;
        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(int $level): static
    {
        $this->level = $level;
        return $this;
    }

    public function getAccuracy(): ?int
    {
        return $this->accuracy;
    }

    public function setAccuracy(int $accuracy): static
    {
        $this->accuracy = $accuracy;
        return $this;
    }

    public function getTimeSpent(): ?int
    {
        return $this->timeSpent;
    }

    public function setTimeSpent(int $timeSpent): static
    {
        $this->timeSpent = $timeSpent;
        return $this;
    }

    public function getTotalPlayTime(): ?int
    {
        return $this->totalPlayTime;
    }

    public function setTotalPlayTime(int $totalPlayTime): static
    {
        $this->totalPlayTime = $totalPlayTime;
        return $this;
    }

    public function getCorrectAnswers(): ?int
    {
        return $this->correctAnswers;
    }

    public function setCorrectAnswers(int $correctAnswers): static
    {
        $this->correctAnswers = $correctAnswers;
        return $this;
    }

    public function getIncorrectAnswers(): ?int
    {
        return $this->incorrectAnswers;
    }

    public function setIncorrectAnswers(int $incorrectAnswers): static
    {
        $this->incorrectAnswers = $incorrectAnswers;
        return $this;
    }

    public function getTotalAttempts(): ?int
    {
        return $this->totalAttempts;
    }

    public function setTotalAttempts(int $totalAttempts): static
    {
        $this->totalAttempts = $totalAttempts;
        return $this;
    }

    public function getBestStreak(): ?int
    {
        return $this->bestStreak;
    }

    public function setBestStreak(int $bestStreak): static
    {
        $this->bestStreak = $bestStreak;
        return $this;
    }

    public function getHintsUsed(): ?int
    {
        return $this->hintsUsed;
    }

    public function setHintsUsed(int $hintsUsed): static
    {
        $this->hintsUsed = $hintsUsed;
        return $this;
    }

    public function getSkillMetrics(): array
    {
        return $this->skillMetrics;
    }

    public function setSkillMetrics(array $skillMetrics): static
    {
        $this->skillMetrics = $skillMetrics;
        return $this;
    }

    public function getDetailedMetrics(): array
    {
        return $this->detailedMetrics;
    }

    public function setDetailedMetrics(array $detailedMetrics): static
    {
        $this->detailedMetrics = $detailedMetrics;
        return $this;
    }

    public function getSessionDate(): ?\DateTimeInterface
    {
        return $this->sessionDate;
    }

    public function setSessionDate(\DateTimeInterface $sessionDate): static
    {
        $this->sessionDate = $sessionDate;
        return $this;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeInterface $startTime): static
    {
        $this->startTime = $startTime;
        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(?\DateTimeInterface $endTime): static
    {
        $this->endTime = $endTime;
        return $this;
    }

    public function getDeviceType(): ?string
    {
        return $this->deviceType;
    }

    public function setDeviceType(string $deviceType): static
    {
        $this->deviceType = $deviceType;
        return $this;
    }

    public function getScreenSize(): ?string
    {
        return $this->screenSize;
    }

    public function setScreenSize(string $screenSize): static
    {
        $this->screenSize = $screenSize;
        return $this;
    }

    public function getPerformanceRating(): ?string
    {
        return $this->performanceRating;
    }

    public function setPerformanceRating(string $performanceRating): static
    {
        $this->performanceRating = $performanceRating;
        return $this;
    }

    public function getVisualDiscrimination(): ?int
    {
        return $this->visualDiscrimination;
    }

    public function setVisualDiscrimination(int $visualDiscrimination): static
    {
        $this->visualDiscrimination = $visualDiscrimination;
        return $this;
    }

    public function getAttentionSpan(): ?int
    {
        return $this->attentionSpan;
    }

    public function setAttentionSpan(int $attentionSpan): static
    {
        $this->attentionSpan = $attentionSpan;
        return $this;
    }

    public function getProcessingSpeed(): ?int
    {
        return $this->processingSpeed;
    }

    public function setProcessingSpeed(int $processingSpeed): static
    {
        $this->processingSpeed = $processingSpeed;
        return $this;
    }

    public function getPhonologicalAwareness(): ?int
    {
        return $this->phonologicalAwareness;
    }

    public function setPhonologicalAwareness(int $phonologicalAwareness): static
    {
        $this->phonologicalAwareness = $phonologicalAwareness;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getGameMetrics(): Collection
    {
        return $this->gameMetrics;
    }

    public function addGameMetric(GameMetric $gameMetric): static
    {
        if (!$this->gameMetrics->contains($gameMetric)) {
            $this->gameMetrics->add($gameMetric);
            $gameMetric->setGameSession($this);
        }
        return $this;
    }

    public function removeGameMetric(GameMetric $gameMetric): static
    {
        if ($this->gameMetrics->removeElement($gameMetric)) {
            if ($gameMetric->getGameSession() === $this) {
                $gameMetric->setGameSession(null);
            }
        }
        return $this;
    }
}