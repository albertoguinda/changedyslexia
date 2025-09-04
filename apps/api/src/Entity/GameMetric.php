<?php

namespace App\Entity;

use App\Repository\GameMetricRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: GameMetricRepository::class)]
#[ORM\Table(name: 'game_metrics')]
#[ORM\Index(columns: ['metric_type'], name: 'idx_metric_type')]
#[ORM\Index(columns: ['recorded_at'], name: 'idx_recorded_at')]
class GameMetric
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    private ?string $metricType = null;

    #[ORM\Column(length: 200)]
    #[Assert\NotBlank]
    private ?string $metricName = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 4)]
    #[Assert\NotNull]
    private ?string $value = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $unit = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $metadata = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $recordedAt = null;

    #[ORM\Column(length: 50)]
    #[Assert\Choice(choices: ['letter-detective', 'word-builder', 'session', 'user'])]
    private ?string $context = null;

    #[ORM\Column(nullable: true)]
    private ?int $contextId = null;

    #[ORM\ManyToOne(targetEntity: GameSession::class, inversedBy: 'gameMetrics')]
    #[ORM\JoinColumn(nullable: false)]
    private ?GameSession $gameSession = null;

    // Métricas específicas para dislexia
    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    private ?string $reactionTime = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    private ?string $errorRate = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $errorPattern = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $confusionMatrix = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 5, scale: 2, nullable: true)]
    private ?string $improvementRate = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $skillBreakdown = null;

    public function __construct()
    {
        $this->recordedAt = new \DateTime();
        $this->metadata = [];
        $this->errorPattern = [];
        $this->confusionMatrix = [];
        $this->skillBreakdown = [];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMetricType(): ?string
    {
        return $this->metricType;
    }

    public function setMetricType(string $metricType): static
    {
        $this->metricType = $metricType;
        return $this;
    }

    public function getMetricName(): ?string
    {
        return $this->metricName;
    }

    public function setMetricName(string $metricName): static
    {
        $this->metricName = $metricName;
        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): static
    {
        $this->value = $value;
        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(?string $unit): static
    {
        $this->unit = $unit;
        return $this;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): static
    {
        $this->metadata = $metadata;
        return $this;
    }

    public function getRecordedAt(): ?\DateTimeInterface
    {
        return $this->recordedAt;
    }

    public function setRecordedAt(\DateTimeInterface $recordedAt): static
    {
        $this->recordedAt = $recordedAt;
        return $this;
    }

    public function getContext(): ?string
    {
        return $this->context;
    }

    public function setContext(string $context): static
    {
        $this->context = $context;
        return $this;
    }

    public function getContextId(): ?int
    {
        return $this->contextId;
    }

    public function setContextId(?int $contextId): static
    {
        $this->contextId = $contextId;
        return $this;
    }

    public function getGameSession(): ?GameSession
    {
        return $this->gameSession;
    }

    public function setGameSession(?GameSession $gameSession): static
    {
        $this->gameSession = $gameSession;
        return $this;
    }

    public function getReactionTime(): ?string
    {
        return $this->reactionTime;
    }

    public function setReactionTime(?string $reactionTime): static
    {
        $this->reactionTime = $reactionTime;
        return $this;
    }

    public function getErrorRate(): ?string
    {
        return $this->errorRate;
    }

    public function setErrorRate(?string $errorRate): static
    {
        $this->errorRate = $errorRate;
        return $this;
    }

    public function getErrorPattern(): ?array
    {
        return $this->errorPattern;
    }

    public function setErrorPattern(?array $errorPattern): static
    {
        $this->errorPattern = $errorPattern;
        return $this;
    }

    public function getConfusionMatrix(): ?array
    {
        return $this->confusionMatrix;
    }

    public function setConfusionMatrix(?array $confusionMatrix): static
    {
        $this->confusionMatrix = $confusionMatrix;
        return $this;
    }

    public function getImprovementRate(): ?string
    {
        return $this->improvementRate;
    }

    public function setImprovementRate(?string $improvementRate): static
    {
        $this->improvementRate = $improvementRate;
        return $this;
    }

    public function getSkillBreakdown(): ?array
    {
        return $this->skillBreakdown;
    }

    public function setSkillBreakdown(?array $skillBreakdown): static
    {
        $this->skillBreakdown = $skillBreakdown;
        return $this;
    }

    // Helper methods for dyslexia-specific metrics

    public function addErrorToPattern(string $letterFrom, string $letterTo, float $frequency): static
    {
        $pattern = $this->errorPattern ?? [];
        $pattern[] = [
            'from' => $letterFrom,
            'to' => $letterTo,
            'frequency' => $frequency,
            'timestamp' => (new \DateTime())->format('Y-m-d H:i:s')
        ];
        $this->errorPattern = $pattern;
        return $this;
    }

    public function setConfusionPair(string $letter1, string $letter2, int $confusionCount): static
    {
        $matrix = $this->confusionMatrix ?? [];
        $key = $letter1 . '_' . $letter2;
        $matrix[$key] = $confusionCount;
        $this->confusionMatrix = $matrix;
        return $this;
    }

    public function addSkillMetric(string $skillName, float $score, string $category = 'general'): static
    {
        $breakdown = $this->skillBreakdown ?? [];
        $breakdown[$category][$skillName] = $score;
        $this->skillBreakdown = $breakdown;
        return $this;
    }

    public function getMetricValueAsFloat(): float
    {
        return (float) $this->value;
    }

    public function getMetricValueAsInt(): int
    {
        return (int) $this->value;
    }
}