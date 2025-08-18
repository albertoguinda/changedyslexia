import { Scene } from 'phaser';
import { GameData } from '../utils/GameData';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

export class LetterDetectiveScene extends Scene {
    private gameData: GameData;
    
    // UI Elements
    private scoreText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private levelText!: Phaser.GameObjects.Text;
    private questionText!: Phaser.GameObjects.Text;
    private feedbackText!: Phaser.GameObjects.Text;
    private progressBar!: Phaser.GameObjects.Graphics;
    
    // Game Objects
    private letters: Phaser.GameObjects.Zone[] = [];
    private currentTarget: string = '';
    private gameTimer!: Phaser.Time.TimerEvent;
    
    // Layout calculations
    private centerX: number = 0;
    private centerY: number = 0;
    private gameScale: number = 1;
    
    // Dyslexia-friendly letter pairs
    private letterPairs = [
        { target: 'b', confuser: 'd', difficulty: 1 },
        { target: 'd', confuser: 'b', difficulty: 1 },
        { target: 'p', confuser: 'q', difficulty: 2 },
        { target: 'q', confuser: 'p', difficulty: 2 }
    ];

    constructor() {
        super({ key: 'LetterDetectiveScene' });
        this.gameData = new GameData();
    }

    create() {
        this.calculateLayout();
        this.createBackground();
        this.createUI();
        this.startGameTimer();
        this.showCompactWelcome();
    }
    
    private calculateLayout() {
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;
        this.gameScale = Math.min(this.cameras.main.width / 800, this.cameras.main.height / 600);
        this.gameScale = Math.max(0.7, Math.min(1.2, this.gameScale));
        
        console.log('Layout calculado: ' + this.cameras.main.width + 'x' + this.cameras.main.height + ', scale: ' + this.gameScale);
    }
    
    private showCompactWelcome() {
        Swal.fire({
            title: '🔍 ¡Hola Detective!',
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 12px; line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(244, 114, 182, 0.1)); 
                                padding: 16px; border-radius: 12px; margin-bottom: 16px; 
                                border: 2px solid rgba(139, 92, 246, 0.2);">
                        <h3 style="margin: 0 0 8px 0; color: #7c3aed; font-size: 18px; font-weight: 700;">
                            🎯 Tu misión
                        </h3>
                        <p style="margin: 0; color: #374151; font-size: 15px;">
                            Encuentra todas las letras que sean <strong style="color: #7c3aed;">exactamente iguales</strong> 
                            a la que aparece marcada arriba
                        </p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 10px; 
                                    border: 2px solid rgba(16, 185, 129, 0.3); text-align: center;">
                            <div style="font-size: 20px; margin-bottom: 6px;">✅</div>
                            <div style="font-weight: 600; color: #059669; font-size: 14px;">¡Correcto!</div>
                            <div style="font-size: 12px; color: #6b7280;">+10 puntos</div>
                        </div>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 10px; 
                                    border: 2px solid rgba(239, 68, 68, 0.3); text-align: center;">
                            <div style="font-size: 20px; margin-bottom: 6px;">❌</div>
                            <div style="font-weight: 600; color: #dc2626; font-size: 14px;">¡Ups!</div>
                            <div style="font-size: 12px; color: #6b7280;">-1 vida</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(79, 70, 229, 0.1); padding: 12px; border-radius: 10px; 
                                border: 2px dashed rgba(79, 70, 229, 0.3); text-align: center;">
                        <div style="color: #4f46e5; font-weight: 600; margin-bottom: 6px; font-size: 14px;">💡 Consejo</div>
                        <div style="font-size: 13px; color: #6b7280;">
                            Las letras <strong>b</strong> y <strong>d</strong> se parecen, 
                            ¡pero son diferentes! Tómate tu tiempo.
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '🚀 ¡Empezar!',
            confirmButtonColor: '#8b5cf6',
            allowOutsideClick: false,
            buttonsStyling: false,
            customClass: {
                popup: 'compact-game-popup',
                confirmButton: 'compact-game-btn'
            }
        }).then(() => {
            this.startNewRound();
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#8b5cf6', '#f472b6', '#60a5fa']
            });
        });
    }
    
    private createBackground() {
        // Simple, clean background
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Subtle decorative elements
        this.add.circle(this.cameras.main.width * 0.1, this.cameras.main.height * 0.15, 30 * this.gameScale, 0x8b5cf6, 0.05);
        this.add.circle(this.cameras.main.width * 0.9, this.cameras.main.height * 0.85, 35 * this.gameScale, 0xf472b6, 0.05);
    }
    
    private createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        this.add.text(this.centerX, height * 0.06, '🔍 Letter Detective', {
            fontSize: Math.max(20, 24 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#1f2937',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Stats container
        this.createStatsContainer();
        
        // Progress bar
        this.createProgressBar();
        
        // Question area
        this.createQuestionArea();
        
        // Feedback area
        this.feedbackText = this.add.text(this.centerX, height * 0.9, '', {
            fontSize: Math.max(16, 18 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#059669',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
    
    private createStatsContainer() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Stats background
        const statsContainer = this.add.graphics();
        statsContainer.fillStyle(0xf8fafc, 0.9);
        statsContainer.fillRoundedRect(
            width * 0.05, 
            height * 0.11, 
            width * 0.9, 
            height * 0.08, 
            12
        );
        statsContainer.lineStyle(1, 0xe5e7eb, 1);
        statsContainer.strokeRoundedRect(
            width * 0.05, 
            height * 0.11, 
            width * 0.9, 
            height * 0.08, 
            12
        );
        
        const statsY = height * 0.15;
        const fontSize = Math.max(14, 16 * this.gameScale);
        
        // Stats texts
        this.scoreText = this.add.text(width * 0.175, statsY, '💎 ' + this.gameData.score, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#059669',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.livesText = this.add.text(width * 0.375, statsY, '❤️ ' + this.gameData.lives, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#dc2626',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.levelText = this.add.text(width * 0.625, statsY, '⭐ ' + this.gameData.level, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#7c3aed',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.timerText = this.add.text(width * 0.825, statsY, '⏰ ' + this.gameData.timeLeft + 's', {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#ea580c',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
    
    private createProgressBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Progress bar background
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0xe5e7eb, 1);
        progressBg.fillRoundedRect(width * 0.05, height * 0.21, width * 0.9, 6, 3);
        
        this.progressBar = this.add.graphics();
        this.updateProgressBar();
    }
    
    private updateProgressBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.progressBar.clear();
        const progress = this.gameData.timeLeft / 60;
        const barWidth = (width * 0.9) * progress;
        
        let color = 0x10b981;
        if (this.gameData.timeLeft <= 20) color = 0xf59e0b;
        if (this.gameData.timeLeft <= 10) color = 0xef4444;
        
        this.progressBar.fillStyle(color, 1);
        this.progressBar.fillRoundedRect(width * 0.05, height * 0.21, barWidth, 6, 3);
    }
    
    private createQuestionArea() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Question background
        const questionBg = this.add.graphics();
        questionBg.fillStyle(0x8b5cf6, 0.1);
        questionBg.fillRoundedRect(width * 0.1, height * 0.25, width * 0.8, height * 0.06, 12);
        questionBg.lineStyle(2, 0x8b5cf6, 0.4);
        questionBg.strokeRoundedRect(width * 0.1, height * 0.25, width * 0.8, height * 0.06, 12);
        
        this.questionText = this.add.text(this.centerX, height * 0.28, '', {
            fontSize: Math.max(16, 18 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#1f2937',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
    
    private startGameTimer() {
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
    
    private startNewRound() {
        this.clearLetters();
        this.feedbackText.setText('');
        
        const pair = Phaser.Utils.Array.GetRandom(this.letterPairs);
        this.currentTarget = pair.target;
        
        this.questionText.setText('Encuentra todas las "' + this.currentTarget.toUpperCase() + '"');
        
        this.time.delayedCall(300, () => {
            this.generateLetterGrid(9, 3, pair);
        });
    }
    
    private generateLetterGrid(totalLetters: number, targetCount: number, pair: any) {
        const positions = this.calculateTighterGridPositions(totalLetters);
        
        // Perfect letter sizing
        const letterSize = Math.max(28, 36 * this.gameScale);
        const boxSize = Math.max(70, 90 * this.gameScale);
        
        positions.forEach((pos, i) => {
            this.time.delayedCall(i * 80, () => {
                const isTarget = i < targetCount;
                const letterChar = isTarget ? pair.target : pair.confuser;
                
                // Clean letter creation
                const letterBg = this.add.graphics();
                letterBg.fillStyle(0xffffff, 1);
                letterBg.fillRoundedRect(-boxSize/2, -boxSize/2, boxSize, boxSize, 16);
                letterBg.lineStyle(2, 0xe5e7eb, 1);
                letterBg.strokeRoundedRect(-boxSize/2, -boxSize/2, boxSize, boxSize, 16);
                letterBg.x = pos.x;
                letterBg.y = pos.y;
                
                const letter = this.add.text(pos.x, pos.y, letterChar, {
                    fontSize: letterSize + 'px',
                    fontFamily: 'Inter, Arial, sans-serif',
                    color: '#374151',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                
                const interactive = this.add.zone(pos.x, pos.y, boxSize, boxSize);
                interactive.setInteractive({ useHandCursor: true });
                interactive.setData('isTarget', isTarget);
                interactive.setData('clicked', false);
                interactive.setData('letter', letter);
                interactive.setData('background', letterBg);
                
                // Clean hover effects
                interactive.on('pointerover', () => this.onLetterHover(interactive, true));
                interactive.on('pointerout', () => this.onLetterHover(interactive, false));
                interactive.on('pointerdown', () => this.onLetterClick(interactive));
                
                // Simple entry animation
                letter.setScale(0.8);
                letterBg.setScale(0.8);
                
                this.tweens.add({
                    targets: [letter, letterBg],
                    scaleX: 1,
                    scaleY: 1,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
                
                this.letters.push(interactive);
            });
        });
    }
    
    private calculateTighterGridPositions(count: number): {x: number, y: number}[] {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const positions = [];
        const cols = 3;
        const rows = 3;
        
        // TIGHTER grid calculation - less spacing
        const gridWidth = width * 0.55; // Reduced from 0.7
        const gridHeight = height * 0.35; // Reduced from 0.4
        const startX = this.centerX - gridWidth/2;
        const startY = height * 0.4; // Moved down slightly
        
        const spacingX = gridWidth / (cols - 1);
        const spacingY = gridHeight / (rows - 1);
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                positions.push({
                    x: startX + col * spacingX,
                    y: startY + row * spacingY
                });
            }
        }
        
        return Phaser.Utils.Array.Shuffle(positions).slice(0, count);
    }
    
    private onLetterHover(interactive: Phaser.GameObjects.Zone, isHover: boolean) {
        if (interactive.getData('clicked')) return;
        
        const bg = interactive.getData('background');
        const letter = interactive.getData('letter');
        
        if (isHover) {
            // Clean hover effect
            bg.clear();
            bg.fillStyle(0xf8fafc, 1);
            bg.fillRoundedRect(-interactive.width/2, -interactive.height/2, interactive.width, interactive.height, 16);
            bg.lineStyle(3, 0x8b5cf6, 0.8);
            bg.strokeRoundedRect(-interactive.width/2, -interactive.height/2, interactive.width, interactive.height, 16);
            
            this.tweens.add({
                targets: [bg, letter],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150,
                ease: 'Back.easeOut'
            });
        } else {
            // Return to normal
            bg.clear();
            bg.fillStyle(0xffffff, 1);
            bg.fillRoundedRect(-interactive.width/2, -interactive.height/2, interactive.width, interactive.height, 16);
            bg.lineStyle(2, 0xe5e7eb, 1);
            bg.strokeRoundedRect(-interactive.width/2, -interactive.height/2, interactive.width, interactive.height, 16);
            
            this.tweens.add({
                targets: [bg, letter],
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Back.easeOut'
            });
        }
    }
    
    private onLetterClick(interactive: Phaser.GameObjects.Zone) {
        if (interactive.getData('clicked')) return;
        
        interactive.setData('clicked', true);
        const isTarget = interactive.getData('isTarget');
        const bg = interactive.getData('background');
        const letter = interactive.getData('letter');
        
        if (isTarget) {
            // Success
            bg.clear();
            bg.fillStyle(0x10b981, 1);
            bg.fillRoundedRect(-interactive.width/2, -interactive.height/2, interactive.width, interactive.height, 16);
            
            letter.setColor('#ffffff');
            this.gameData.addScore(10);
            this.gameData.addCorrectAnswer();
            this.showFeedback('¡Perfecto! +10 puntos', '#10b981');
            
            // Success animation
            this.tweens.add({
                targets: [bg, letter],
                scaleX: 1.15,
                scaleY: 1.15,
                duration: 200,
                ease: 'Back.easeOut',
                yoyo: true
            });
            
            // Success confetti
            confetti({
                particleCount: 12,
                spread: 30,
                origin: { 
                    x: interactive.x / this.cameras.main.width,
                    y: interactive.y / this.cameras.main.height
                },
                colors: ['#10b981', '#34d399']
            });
            
            if (this.checkRoundComplete()) {
                this.time.delayedCall(1000, () => this.completeRound());
            }
        } else {
            // Error
            bg.clear();
            bg.fillStyle(0xef4444, 1);
            bg.fillRoundedRect(-interactive.width/2, -interactive.height/2, interactive.width, interactive.height, 16);
            
            letter.setColor('#ffffff');
            this.gameData.loseLife();
            this.gameData.addIncorrectAnswer();
            this.showFeedback('¡Ups! Esa letra es diferente', '#ef4444');
            
            // Error shake
            this.tweens.add({
                targets: [bg, letter],
                x: interactive.x + 5,
                duration: 50,
                yoyo: true,
                repeat: 4,
                ease: 'Power2'
            });
            
            if (this.gameData.lives <= 0) {
                this.time.delayedCall(1200, () => this.gameOver());
            }
        }
        
        this.updateUI();
    }
    
    private checkRoundComplete(): boolean {
        return this.letters
            .filter(letter => letter.getData('isTarget'))
            .every(letter => letter.getData('clicked'));
    }
    
    private completeRound() {
        this.gameData.levelUp();
        
        // Level complete confetti
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#8b5cf6', '#f472b6', '#60a5fa']
        });
        
        Swal.fire({
            title: '🎉 ¡Nivel Completado!',
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 16px; text-align: center;">
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(244, 114, 182, 0.1)); 
                                padding: 16px; border-radius: 12px; margin-bottom: 12px;
                                border: 2px solid rgba(139, 92, 246, 0.25);">
                        <div style="font-size: 28px; font-weight: bold; color: #7c3aed; margin-bottom: 6px;">
                            Nivel ` + this.gameData.level + `
                        </div>
                        <div style="font-size: 14px; color: #6b7280;">
                            ¡Excelente trabajo! Sigues mejorando
                        </div>
                    </div>
                    <div style="color: #059669; font-size: 16px; font-weight: 600;">
                        +` + (this.gameData.level * 5) + ` puntos bonus
                    </div>
                </div>
            `,
            timer: 2500,
            showConfirmButton: false,
            buttonsStyling: false,
            customClass: {
                popup: 'compact-game-popup'
            }
        });
        
        this.time.delayedCall(3000, () => this.startNewRound());
    }
    
    private showFeedback(message: string, color: string) {
        this.feedbackText.setText(message);
        this.feedbackText.setColor(color);
        
        this.tweens.add({
            targets: this.feedbackText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            ease: 'Back.easeOut',
            yoyo: true,
            onComplete: () => {
                this.time.delayedCall(1800, () => {
                    this.feedbackText.setText('');
                });
            }
        });
    }
    
    private updateTimer() {
        this.gameData.decreaseTime();
        this.timerText.setText('⏰ ' + this.gameData.timeLeft + 's');
        this.updateProgressBar();
        
        if (this.gameData.timeLeft <= 10) {
            this.timerText.setColor('#dc2626');
        }
        
        if (this.gameData.timeLeft <= 0) {
            this.gameOver();
        }
    }
    
    private updateUI() {
        this.scoreText.setText('💎 ' + this.gameData.score);
        this.livesText.setText('❤️ ' + this.gameData.lives);
        this.levelText.setText('⭐ ' + this.gameData.level);
        
        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 150,
            ease: 'Back.easeOut',
            yoyo: true
        });
    }
    
    private clearLetters() {
        this.letters.forEach(letter => {
            const bg = letter.getData('background');
            const text = letter.getData('letter');
            bg?.destroy();
            text?.destroy();
            letter.destroy();
        });
        this.letters = [];
    }
    
    private gameOver() {
        this.gameTimer.remove();
        this.clearLetters();
        this.gameData.endSession();
        this.showGameOverScreen();
    }
    
    private showGameOverScreen() {
        const sessionData = this.gameData.getSessionData();
        
        Swal.fire({
            title: '🎮 ¡Partida Terminada!',
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 16px;">
                    <div style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1)); 
                                padding: 16px; border-radius: 12px; margin-bottom: 16px;
                                border: 2px solid rgba(79, 70, 229, 0.25);">
                        <div style="font-size: 16px; font-weight: 600; color: #4f46e5; margin-bottom: 6px;">
                            ¡Buen trabajo, detective!
                        </div>
                        <div style="font-size: 13px; color: #6b7280;">
                            Tiempo total: ` + Math.floor(sessionData.totalPlayTime / 60) + `m ` + (sessionData.totalPlayTime % 60) + `s
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 10px; 
                                    text-align: center; border: 2px solid rgba(16, 185, 129, 0.3);">
                            <div style="font-size: 20px; font-weight: bold; color: #059669; margin-bottom: 3px;">
                                ` + sessionData.score + `
                            </div>
                            <div style="font-size: 11px; color: #6b7280;">Puntos</div>
                        </div>
                        <div style="background: rgba(139, 92, 246, 0.1); padding: 12px; border-radius: 10px; 
                                    text-align: center; border: 2px solid rgba(139, 92, 246, 0.3);">
                            <div style="font-size: 20px; font-weight: bold; color: #7c3aed; margin-bottom: 3px;">
                                ` + sessionData.level + `
                            </div>
                            <div style="font-size: 11px; color: #6b7280;">Nivel</div>
                        </div>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 10px; 
                                    text-align: center; border: 2px solid rgba(239, 68, 68, 0.3);">
                            <div style="font-size: 20px; font-weight: bold; color: #dc2626; margin-bottom: 3px;">
                                ` + sessionData.accuracy + `%
                            </div>
                            <div style="font-size: 11px; color: #6b7280;">Precisión</div>
                        </div>
                        <div style="background: rgba(96, 165, 250, 0.1); padding: 12px; border-radius: 10px; 
                                    text-align: center; border: 2px solid rgba(96, 165, 250, 0.3);">
                            <div style="font-size: 20px; font-weight: bold; color: #2563eb; margin-bottom: 3px;">
                                ` + sessionData.lettersFound + `
                            </div>
                            <div style="font-size: 11px; color: #6b7280;">Letras</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(244, 114, 182, 0.1); padding: 12px; border-radius: 10px; 
                                border: 2px solid rgba(244, 114, 182, 0.25); text-align: center;">
                        <div style="font-weight: 600; color: #f472b6; margin-bottom: 4px; font-size: 14px;">📊 Análisis</div>
                        <div style="font-size: 12px; color: #6b7280;">
                            ` + sessionData.performanceRating + ` • Discriminación visual: ` + sessionData.visualDiscrimination + `%
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '🔄 Jugar Otra Vez',
            cancelButtonText: '📊 Ver Dashboard',
           confirmButtonColor: '#8b5cf6',
           cancelButtonColor: '#6b7280',
           buttonsStyling: false,
           customClass: {
               popup: 'compact-game-popup',
               confirmButton: 'compact-game-btn',
               cancelButton: 'compact-game-btn-secondary'
           }
       }).then((result) => {
           if (result.isConfirmed) {
               (window as any).restartGame();
           } else if (result.dismiss === Swal.DismissReason.cancel) {
               window.open('http://localhost:4200', '_blank');
           }
       });
   }
}