<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250902160154 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE game_metrics (id INT AUTO_INCREMENT NOT NULL, game_session_id INT NOT NULL, metric_type VARCHAR(100) NOT NULL, metric_name VARCHAR(200) NOT NULL, value NUMERIC(10, 4) NOT NULL, unit VARCHAR(50) DEFAULT NULL, metadata JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', recorded_at DATETIME NOT NULL, context VARCHAR(50) NOT NULL, context_id INT DEFAULT NULL, reaction_time NUMERIC(5, 2) DEFAULT NULL, error_rate NUMERIC(5, 2) DEFAULT NULL, error_pattern JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', confusion_matrix JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', improvement_rate NUMERIC(5, 2) DEFAULT NULL, skill_breakdown JSON DEFAULT NULL COMMENT \'(DC2Type:json)\', INDEX IDX_B748D5C88FE32B32 (game_session_id), INDEX idx_metric_type (metric_type), INDEX idx_recorded_at (recorded_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE game_sessions (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, game VARCHAR(50) NOT NULL, version VARCHAR(20) NOT NULL, score INT NOT NULL, level INT NOT NULL, accuracy INT NOT NULL, time_spent INT NOT NULL, total_play_time INT NOT NULL, correct_answers INT NOT NULL, incorrect_answers INT NOT NULL, total_attempts INT NOT NULL, best_streak INT NOT NULL, hints_used INT NOT NULL, skill_metrics JSON NOT NULL COMMENT \'(DC2Type:json)\', detailed_metrics JSON NOT NULL COMMENT \'(DC2Type:json)\', session_date DATETIME NOT NULL, start_time DATETIME NOT NULL, end_time DATETIME NOT NULL, device_type VARCHAR(20) NOT NULL, screen_size VARCHAR(50) NOT NULL, performance_rating VARCHAR(100) NOT NULL, visual_discrimination INT NOT NULL, attention_span INT NOT NULL, processing_speed INT NOT NULL, phonological_awareness INT NOT NULL, INDEX IDX_31246235A76ED395 (user_id), INDEX idx_game_date (game, session_date), INDEX idx_device (device_type), INDEX idx_date (session_date), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, roles JSON NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, last_login_at DATETIME DEFAULT NULL, is_active TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE game_metrics ADD CONSTRAINT FK_B748D5C88FE32B32 FOREIGN KEY (game_session_id) REFERENCES game_sessions (id)');
        $this->addSql('ALTER TABLE game_sessions ADD CONSTRAINT FK_31246235A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game_metrics DROP FOREIGN KEY FK_B748D5C88FE32B32');
        $this->addSql('ALTER TABLE game_sessions DROP FOREIGN KEY FK_31246235A76ED395');
        $this->addSql('DROP TABLE game_metrics');
        $this->addSql('DROP TABLE game_sessions');
        $this->addSql('DROP TABLE users');
    }
}
