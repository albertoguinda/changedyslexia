import { WordBuilderScene } from '../scenes/WordBuilderScene';
import confetti from 'canvas-confetti';

export class UIManager {
   private scene: WordBuilderScene;
   private scoreText!: Phaser.GameObjects.Text;
   private livesText!: Phaser.GameObjects.Text;
   private levelText!: Phaser.GameObjects.Text;
   private timerText!: Phaser.GameObjects.Text;
   private wordText!: Phaser.GameObjects.Text;
   private emojiText!: Phaser.GameObjects.Text;
   private feedbackText!: Phaser.GameObjects.Text;
   private progressBar!: Phaser.GameObjects.Graphics;
   private progressIndicator!: Phaser.GameObjects.Text;
   private progressBarMini!: Phaser.GameObjects.Graphics;
   private hintButton!: Phaser.GameObjects.Zone;
   private centerX: number = 0;
   private centerY: number = 0;
   private gameScale: number = 1;

   // UI Constants for consistency with Letter Detective
   private readonly UI_CONSTANTS = {
       PADDING: {
           SMALL: 8,
           MEDIUM: 12,
           LARGE: 16
       },
       SPACING: {
           ELEMENTS: 12,
           SECTIONS: 20
       },
       SIZES: {
           STATS_HEIGHT: 0.08,
           PROGRESS_HEIGHT: 6,
           WORD_AREA_HEIGHT: 0.15,
           MARGIN: 0.05,
           BORDER_RADIUS: 12,
           SMALL_RADIUS: 6,
           LARGE_RADIUS: 16
       },
       POSITIONS: {
           TITLE: 0.06,
           STATS: 0.11,
           STATS_TEXT: 0.15,
           PROGRESS: 0.21,
           WORD_AREA: 0.25,
           EMOJI: 0.3,
           WORD_TEXT: 0.36,
           FEEDBACK: 0.87
       }
   };

   constructor(scene: WordBuilderScene) {
       this.scene = scene;
       this.calculateLayout();
   }

   public createUI() {
       this.createBackground();
       this.createTitle();
       this.createStatsContainer();
       this.createProgressBar();
       this.createProgressIndicator();
       this.createWordArea();
       this.createHintButton();
       this.createFeedbackText();
   }

   private calculateLayout() {
       this.centerX = this.scene.cameras.main.width / 2;
       this.centerY = this.scene.cameras.main.height / 2;
       this.gameScale = Math.min(
           this.scene.cameras.main.width / 800, 
           this.scene.cameras.main.height / 600
       );
       this.gameScale = Math.max(0.7, Math.min(1.2, this.gameScale));
   }

   private createBackground() {
       const graphics = this.scene.add.graphics();
       graphics.fillStyle(0xffffff, 1);
       graphics.fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height);
       
       this.scene.add.circle(
           this.scene.cameras.main.width * 0.1, 
           this.scene.cameras.main.height * 0.15, 
           30 * this.gameScale, 
           0x10b981, 
           0.05
       );
       this.scene.add.circle(
           this.scene.cameras.main.width * 0.9, 
           this.scene.cameras.main.height * 0.85, 
           35 * this.gameScale, 
           0x34d399, 
           0.05
       );
   }

   private createTitle() {
       const height = this.scene.cameras.main.height;
       
       this.scene.add.text(this.centerX, height * this.UI_CONSTANTS.POSITIONS.TITLE, '🔤 Word Builder', {
           fontSize: Math.max(20, 24 * this.gameScale) + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#1f2937',
           fontStyle: 'bold'
       }).setOrigin(0.5);
   }

   private createStatsContainer() {
       const width = this.scene.cameras.main.width;
       const height = this.scene.cameras.main.height;
       
       const statsContainer = this.scene.add.graphics();
       statsContainer.fillStyle(0xf8fafc, 0.9);
       statsContainer.fillRoundedRect(
           width * this.UI_CONSTANTS.SIZES.MARGIN, 
           height * this.UI_CONSTANTS.POSITIONS.STATS, 
           width * (1 - this.UI_CONSTANTS.SIZES.MARGIN * 2), 
           height * this.UI_CONSTANTS.SIZES.STATS_HEIGHT, 
           this.UI_CONSTANTS.SIZES.BORDER_RADIUS
       );
       statsContainer.lineStyle(1, 0xe5e7eb, 1);
       statsContainer.strokeRoundedRect(
           width * this.UI_CONSTANTS.SIZES.MARGIN, 
           height * this.UI_CONSTANTS.POSITIONS.STATS, 
           width * (1 - this.UI_CONSTANTS.SIZES.MARGIN * 2), 
           height * this.UI_CONSTANTS.SIZES.STATS_HEIGHT, 
           this.UI_CONSTANTS.SIZES.BORDER_RADIUS
       );
       
       const statsY = height * this.UI_CONSTANTS.POSITIONS.STATS_TEXT;
       const fontSize = Math.max(14, 16 * this.gameScale);
       
       this.scoreText = this.scene.add.text(width * 0.175, statsY, '💎 0', {
           fontSize: fontSize + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#059669',
           fontStyle: 'bold'
       }).setOrigin(0.5);
       
       this.livesText = this.scene.add.text(width * 0.375, statsY, '❤️ 3', {
           fontSize: fontSize + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#dc2626',
           fontStyle: 'bold'
       }).setOrigin(0.5);
       
       this.levelText = this.scene.add.text(width * 0.625, statsY, '⭐ 1', {
           fontSize: fontSize + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#7c3aed',
           fontStyle: 'bold'
       }).setOrigin(0.5);
       
       this.timerText = this.scene.add.text(width * 0.825, statsY, '⏰ 30s', {
           fontSize: fontSize + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#ea580c',
           fontStyle: 'bold'
       }).setOrigin(0.5);
   }

   private createProgressBar() {
       const width = this.scene.cameras.main.width;
       const height = this.scene.cameras.main.height;
       
       const progressBg = this.scene.add.graphics();
       progressBg.fillStyle(0xe5e7eb, 1);
       progressBg.fillRoundedRect(
           width * this.UI_CONSTANTS.SIZES.MARGIN, 
           height * this.UI_CONSTANTS.POSITIONS.PROGRESS, 
           width * (1 - this.UI_CONSTANTS.SIZES.MARGIN * 2), 
           this.UI_CONSTANTS.SIZES.PROGRESS_HEIGHT, 
           3
       );
       
       this.progressBar = this.scene.add.graphics();
       this.updateProgressBar(30);
   }

   private createProgressIndicator() {
       const width = this.scene.cameras.main.width;
       const height = this.scene.cameras.main.height;
       
       this.progressIndicator = this.scene.add.text(width * 0.95, height * 0.05, 'Progreso: 0/5', {
           fontSize: Math.max(12, 14 * this.gameScale) + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#6b7280',
           fontStyle: 'bold'
       }).setOrigin(1, 0);
       
       this.progressBarMini = this.scene.add.graphics();
       this.updateProgressIndicator(0, 5);
   }

   private createWordArea() {
       const width = this.scene.cameras.main.width;
       const height = this.scene.cameras.main.height;
       
       const questionBg = this.scene.add.graphics();
       questionBg.fillStyle(0x10b981, 0.1);
       questionBg.fillRoundedRect(
           width * 0.1, 
           height * this.UI_CONSTANTS.POSITIONS.WORD_AREA, 
           width * 0.8, 
           height * this.UI_CONSTANTS.SIZES.WORD_AREA_HEIGHT, 
           this.UI_CONSTANTS.SIZES.BORDER_RADIUS
       );
       questionBg.lineStyle(2, 0x10b981, 0.4);
       questionBg.strokeRoundedRect(
           width * 0.1, 
           height * this.UI_CONSTANTS.POSITIONS.WORD_AREA, 
           width * 0.8, 
           height * this.UI_CONSTANTS.SIZES.WORD_AREA_HEIGHT, 
           this.UI_CONSTANTS.SIZES.BORDER_RADIUS
       );
       
       this.emojiText = this.scene.add.text(this.centerX, height * this.UI_CONSTANTS.POSITIONS.EMOJI, '', {
           fontSize: Math.max(50, 60 * this.gameScale) + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
       }).setOrigin(0.5);
       
       this.wordText = this.scene.add.text(this.centerX, height * this.UI_CONSTANTS.POSITIONS.WORD_TEXT, '', {
           fontSize: Math.max(14, 16 * this.gameScale) + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#1f2937',
           fontStyle: 'bold'
       }).setOrigin(0.5);
   }

   private createHintButton() {
       const width = this.scene.cameras.main.width;
       const height = this.scene.cameras.main.height;
       
       const buttonX = width * this.UI_CONSTANTS.SIZES.MARGIN + 30;
       const buttonY = height * 0.05 + 18;
       
       const hintBg = this.scene.add.graphics();
       hintBg.fillStyle(0x4f46e5, 1);
       hintBg.fillRoundedRect(-30, -18, 60, 36, 18);
       hintBg.x = buttonX;
       hintBg.y = buttonY;
       
       const hintText = this.scene.add.text(buttonX, buttonY, '💡 Pista', {
           fontSize: '14px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#ffffff',
           fontStyle: 'bold'
       }).setOrigin(0.5);
       
       this.hintButton = this.scene.add.zone(buttonX, buttonY, 60, 36);
       this.hintButton.setInteractive({ useHandCursor: true });
       
       this.hintButton.on('pointerover', () => {
           hintBg.clear();
           hintBg.fillStyle(0x6366f1, 1);
           hintBg.fillRoundedRect(-30, -18, 60, 36, 18);
           hintBg.x = buttonX;
           hintBg.y = buttonY;
       });
       
       this.hintButton.on('pointerout', () => {
           hintBg.clear();
           hintBg.fillStyle(0x4f46e5, 1);
           hintBg.fillRoundedRect(-30, -18, 60, 36, 18);
           hintBg.x = buttonX;
           hintBg.y = buttonY;
       });
       
       this.hintButton.on('pointerdown', () => {
           this.scene.onHintUsed();
       });
   }

   private createFeedbackText() {
       const height = this.scene.cameras.main.height;
       
       this.feedbackText = this.scene.add.text(this.centerX, height * this.UI_CONSTANTS.POSITIONS.FEEDBACK, '', {
           fontSize: Math.max(16, 18 * this.gameScale) + 'px',
           fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
           color: '#059669',
           fontStyle: 'bold'
       }).setOrigin(0.5);
   }

   public updateUI(gameData: any) {
       this.scoreText.setText('💎 ' + gameData.score);
       this.livesText.setText('❤️ ' + gameData.lives);
       this.levelText.setText('⭐ ' + gameData.level);
       
       this.scene.tweens.add({
           targets: this.scoreText,
           scaleX: 1.05,
           scaleY: 1.05,
           duration: 150,
           ease: 'Back.easeOut',
           yoyo: true
       });
   }

   public updateTimer(timeLeft: number) {
       this.timerText.setText('⏰ ' + timeLeft + 's');
       this.updateProgressBar(timeLeft);
       
       if (timeLeft <= 10) {
           this.timerText.setColor('#dc2626');
       } else {
           this.timerText.setColor('#ea580c');
       }
   }

   public displayWord(word: any) {
       this.emojiText.setText(word.emoji);
       this.wordText.setText('Forma la palabra del emoji');
   }

   public showWordComplete(wordText: string) {
       this.wordText.setText('✅ ' + wordText + ' - ¡PERFECTO!');
       
       this.scene.tweens.add({
           targets: this.wordText,
           scaleX: 1.2,
           scaleY: 1.2,
           duration: 300,
           ease: 'Back.easeOut',
           yoyo: true
       });
       
       this.showFeedback('¡Excelente! +50 puntos + bonus tiempo', '#10b981');
       
       confetti({
           particleCount: 60,
           spread: 70,
           origin: { y: 0.6 },
           colors: ['#10b981', '#34d399', '#6ee7b7']
       });
   }

   public showFeedback(message: string, color: string) {
       this.feedbackText.setText(message);
       this.feedbackText.setColor(color);
       
       this.scene.tweens.add({
           targets: this.feedbackText,
           scaleX: 1.1,
           scaleY: 1.1,
           duration: 200,
           ease: 'Back.easeOut',
           yoyo: true,
           onComplete: () => {
               this.scene.time.delayedCall(3000, () => {
                   this.feedbackText.setText('');
               });
           }
       });
   }

   public clearFeedback() {
       this.feedbackText.setText('');
   }

   public updateProgressIndicator(completed: number, required: number) {
       const progress = completed / required;
       const width = this.scene.cameras.main.width;
       const height = this.scene.cameras.main.height;
       
       this.progressIndicator.setText(`Progreso: ${completed}/${required}`);
       
       this.progressBarMini.clear();
       this.progressBarMini.fillStyle(0xe5e7eb, 1);
       this.progressBarMini.fillRoundedRect(width * 0.77, height * 0.08, 120, 4, 2);
       this.progressBarMini.fillStyle(0x10b981, 1);
       this.progressBarMini.fillRoundedRect(width * 0.77, height * 0.08, 120 * progress, 4, 2);
   }

   public showAchievement(achievement: string) {
       confetti({
           particleCount: 30,
           spread: 40,
           origin: { y: 0.4 },
           colors: ['#fbbf24', '#f59e0b', '#d97706']
       });
       
       const achievementText = this.scene.add.text(
           this.centerX, 
           this.scene.cameras.main.height * 0.3, 
           achievement, 
           {
               fontSize: Math.max(18, 22 * this.gameScale) + 'px',
               fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
               color: '#d97706',
               fontStyle: 'bold'
           }
       ).setOrigin(0.5);
       
       achievementText.setScale(0);
       
       this.scene.tweens.add({
           targets: achievementText,
           scaleX: 1.2,
           scaleY: 1.2,
           duration: 500,
           ease: 'Back.easeOut',
           onComplete: () => {
               this.scene.time.delayedCall(2000, () => {
                   this.scene.tweens.add({
                       targets: achievementText,
                       alpha: 0,
                       duration: 300,
                       onComplete: () => achievementText.destroy()
                   });
               });
           }
       });
   }

   private updateProgressBar(timeLeft: number) {
       const width = this.scene.cameras.main.width;
       const height = this.scene.cameras.main.height;
       
       this.progressBar.clear();
       const progress = timeLeft / 30;
       const barWidth = (width * (1 - this.UI_CONSTANTS.SIZES.MARGIN * 2)) * progress;
       
       let color = 0x10b981;
       if (timeLeft <= 15) color = 0xf59e0b;
       if (timeLeft <= 8) color = 0xef4444;
       
       this.progressBar.fillStyle(color, 1);
       this.progressBar.fillRoundedRect(
           width * this.UI_CONSTANTS.SIZES.MARGIN, 
           height * this.UI_CONSTANTS.POSITIONS.PROGRESS, 
           barWidth, 
           this.UI_CONSTANTS.SIZES.PROGRESS_HEIGHT, 
           3
       );
   }
}