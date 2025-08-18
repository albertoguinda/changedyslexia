import { Scene } from 'phaser';
import { GameData } from '../utils/GameData';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

interface Word {
    text: string;
    syllables: string[];
    emoji: string;
    level: number;
}

interface SyllableCard {
    graphics: Phaser.GameObjects.Graphics;
    text: Phaser.GameObjects.Text;
    zone: Phaser.GameObjects.Zone;
    syllable: string;
    isPlaced: boolean;
    correctPosition: number;
    originalX: number;
    originalY: number;
}

interface DropSlot {
    graphics: Phaser.GameObjects.Graphics;
    zone: Phaser.GameObjects.Zone;
    position: number;
    occupied: boolean;
    syllableCard: SyllableCard | null;
}

export class WordBuilderScene extends Scene {
    private gameData: GameData;
    private scoreText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;
    private levelText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private wordText!: Phaser.GameObjects.Text;
    private emojiText!: Phaser.GameObjects.Text;
    private feedbackText!: Phaser.GameObjects.Text;
    private syllableCards: SyllableCard[] = [];
    private dropSlots: DropSlot[] = [];
    private currentWord!: Word;
    private gameTimer!: Phaser.Time.TimerEvent;
    private centerX: number = 0;
    private centerY: number = 0;
    private gameScale: number = 1;
    
    private words: Word[] = [
        { text: "CASA", syllables: ["CA", "SA"], emoji: "🏠", level: 1 },
        { text: "MESA", syllables: ["ME", "SA"], emoji: "🪑", level: 1 },
        { text: "GATO", syllables: ["GA", "TO"], emoji: "🐱", level: 1 },
        { text: "LUNA", syllables: ["LU", "NA"], emoji: "🌙", level: 1 },
        { text: "AGUA", syllables: ["A", "GUA"], emoji: "💧", level: 1 },
        { text: "PELOTA", syllables: ["PE", "LO", "TA"], emoji: "⚽", level: 2 },
        { text: "CAMISA", syllables: ["CA", "MI", "SA"], emoji: "👕", level: 2 },
        { text: "ZAPATO", syllables: ["ZA", "PA", "TO"], emoji: "👟", level: 2 },
        { text: "MARIPOSA", syllables: ["MA", "RI", "PO", "SA"], emoji: "🦋", level: 3 }
    ];

    constructor() {
        super({ key: 'WordBuilderScene' });
        this.gameData = new GameData();
    }

    create() {
        this.calculateLayout();
        this.createBackground();
        this.createUI();
        this.startGameTimer();
        this.showWelcome();
    }
    
    private calculateLayout() {
        this.centerX = this.cameras.main.width / 2;
        this.centerY = this.cameras.main.height / 2;
        this.gameScale = Math.min(this.cameras.main.width / 1200, this.cameras.main.height / 800);
        this.gameScale = Math.max(0.7, Math.min(1.2, this.gameScale));
    }
    
    private showWelcome() {
        Swal.fire({
            title: '🏗️ Constructor de Palabras',
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 12px; line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)); 
                                padding: 16px; border-radius: 12px; margin-bottom: 16px; 
                                border: 2px solid rgba(16, 185, 129, 0.2);">
                        <h3 style="margin: 0 0 8px 0; color: #059669; font-size: 18px; font-weight: 700;">
                            🎯 Tu mision
                        </h3>
                        <p style="margin: 0; color: #374151; font-size: 15px;">
                            Arrastra las silabas a los cuadros para formar la palabra que representa el emoji
                        </p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 10px; 
                                    border: 2px solid rgba(16, 185, 129, 0.3); text-align: center;">
                            <div style="font-size: 20px; margin-bottom: 6px;">✅</div>
                            <div style="font-weight: 600; color: #059669; font-size: 14px;">Correcto</div>
                            <div style="font-size: 12px; color: #6b7280;">+10 puntos por silaba</div>
                        </div>
                        <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 10px; 
                                    border: 2px solid rgba(239, 68, 68, 0.3); text-align: center;">
                            <div style="font-size: 20px; margin-bottom: 6px;">❌</div>
                            <div style="font-weight: 600; color: #dc2626; font-size: 14px;">Intentalo</div>
                            <div style="font-size: 12px; color: #6b7280;">La silaba vuelve</div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(79, 70, 229, 0.1); padding: 12px; border-radius: 10px; 
                                border: 2px dashed rgba(79, 70, 229, 0.3); text-align: center;">
                        <div style="color: #4f46e5; font-weight: 600; margin-bottom: 6px; font-size: 14px;">💡 Consejo</div>
                        <div style="font-size: 13px; color: #6b7280;">
                            Escucha en tu mente como suena cada silaba. 
                            <strong>El orden importa</strong>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: '🚀 Construir',
            confirmButtonColor: '#10b981',
            allowOutsideClick: false,
            buttonsStyling: false,
            customClass: {
                popup: 'compact-game-popup',
                confirmButton: 'compact-game-btn'
            }
        }).then(() => {
            this.startNewWord();
            confetti({
                particleCount: 40,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#10b981', '#34d399', '#6ee7b7']
            });
        });
    }
    
    private createBackground() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        // Decorative circles
        this.add.circle(this.cameras.main.width * 0.1, this.cameras.main.height * 0.15, 25 * this.gameScale, 0x10b981, 0.06);
        this.add.circle(this.cameras.main.width * 0.9, this.cameras.main.height * 0.85, 30 * this.gameScale, 0x34d399, 0.05);
    }
    
    private createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        this.add.text(this.centerX, height * 0.06, '🏗️ Word Builder', {
            fontSize: Math.max(20, 24 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#1f2937',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.createStatsContainer();
        this.createWordArea();
        
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
        statsContainer.fillStyle(0xf0fdf4, 0.9);
        statsContainer.fillRoundedRect(width * 0.05, height * 0.11, width * 0.9, height * 0.08, 12);
        statsContainer.lineStyle(1, 0x10b981, 0.3);
        statsContainer.strokeRoundedRect(width * 0.05, height * 0.11, width * 0.9, height * 0.08, 12);
        
        const statsY = height * 0.15;
        const fontSize = Math.max(14, 16 * this.gameScale);
        
        // Stats texts with emojis
        this.scoreText = this.add.text(width * 0.2, statsY, '💎 ' + this.gameData.score, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#059669',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.livesText = this.add.text(width * 0.4, statsY, '❤️ ' + this.gameData.lives, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#dc2626',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.levelText = this.add.text(width * 0.6, statsY, '⭐ ' + this.gameData.level, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#7c3aed',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.timerText = this.add.text(width * 0.8, statsY, '⏰ ' + this.gameData.timeLeft + 's', {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#ea580c',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
    
    private createWordArea() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Large emoji display
        this.emojiText = this.add.text(this.centerX, height * 0.3, '', {
            fontSize: Math.max(50, 70 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif'
        }).setOrigin(0.5);
        
        // Word display for completed words
        this.wordText = this.add.text(this.centerX, height * 0.42, '', {
            fontSize: Math.max(20, 28 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#374151',
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
    
    private startNewWord() {
        this.clearGameObjects();
        this.feedbackText.setText('');
        
        // Get words for current level
        const levelWords = this.words.filter(word => word.level === this.gameData.level);
        if (levelWords.length === 0) {
            this.gameWin();
            return;
        }
        
        this.currentWord = Phaser.Utils.Array.GetRandom(levelWords);
        this.gameData.startNewWord();
        
        // Show emoji and clear word
        this.emojiText.setText(this.currentWord.emoji);
        this.wordText.setText('');
        
        // Create game elements after a short delay
        this.time.delayedCall(500, () => {
            this.createDropSlots();
            this.createSyllableCards();
        });
    }
    
    private createDropSlots() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const numSlots = this.currentWord.syllables.length;
        const slotWidth = Math.max(80, 100 * this.gameScale);
        const slotHeight = Math.max(60, 70 * this.gameScale);
        const spacing = 20;
        const totalWidth = (slotWidth * numSlots) + (spacing * (numSlots - 1));
        const startX = this.centerX - totalWidth / 2;
        const slotY = height * 0.55;
        
        for (let i = 0; i < numSlots; i++) {
            const slotX = startX + (slotWidth / 2) + i * (slotWidth + spacing);
            
            // Create slot graphics
            const slotGraphics = this.add.graphics();
            slotGraphics.lineStyle(3, 0x10b981, 0.6);
            slotGraphics.strokeRoundedRect(-slotWidth/2, -slotHeight/2, slotWidth, slotHeight, 12);
            slotGraphics.lineStyle(1, 0x34d399, 0.4);
            slotGraphics.strokeRoundedRect(-slotWidth/2 + 2, -slotHeight/2 + 2, slotWidth - 4, slotHeight - 4, 10);
            slotGraphics.x = slotX;
            slotGraphics.y = slotY;
            
            // Create drop zone
            const dropZone = this.add.zone(slotX, slotY, slotWidth, slotHeight);
            dropZone.setRectangleDropZone(slotWidth, slotHeight);
            
            // Store slot data
            const slot: DropSlot = {
                graphics: slotGraphics,
                zone: dropZone,
                position: i,
                occupied: false,
                syllableCard: null
            };
            
            this.dropSlots.push(slot);
        }
    }
    
    private createSyllableCards() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create syllables with some distractors
        let syllables = [...this.currentWord.syllables];
        
        // Add 1 distractor from other words
        const otherWords = this.words.filter(w => w.text !== this.currentWord.text);
        if (otherWords.length > 0) {
            const randomWord = Phaser.Utils.Array.GetRandom(otherWords);
            const distractor = Phaser.Utils.Array.GetRandom(randomWord.syllables);
            if (!syllables.includes(distractor)) {
                syllables.push(distractor);
            }
        }
        
        // Shuffle syllables
        syllables = Phaser.Utils.Array.Shuffle(syllables);
        
        const cardWidth = Math.max(70, 85 * this.gameScale);
        const cardHeight = Math.max(50, 60 * this.gameScale);
        const spacing = 15;
        const totalWidth = (cardWidth * syllables.length) + (spacing * (syllables.length - 1));
        const startX = this.centerX - totalWidth / 2;
        const cardY = height * 0.75;
        
        syllables.forEach((syllable, index) => {
            const cardX = startX + (cardWidth / 2) + index * (cardWidth + spacing);
            
            // Create card graphics
            const cardGraphics = this.add.graphics();
            cardGraphics.fillStyle(0xffffff, 1);
            cardGraphics.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 12);
            cardGraphics.lineStyle(2, 0x34d399, 1);
            cardGraphics.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 12);
            cardGraphics.x = cardX;
            cardGraphics.y = cardY;
            
            // Create card text
            const cardText = this.add.text(cardX, cardY, syllable, {
                fontSize: Math.max(16, 20 * this.gameScale) + 'px',
                fontFamily: 'Inter, Arial, sans-serif',
                color: '#374151',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Create draggable zone
            const dragZone = this.add.zone(cardX, cardY, cardWidth, cardHeight);
            dragZone.setInteractive({ 
                useHandCursor: true, 
                draggable: true 
            });
            
            // Determine correct position
            const correctPosition = this.currentWord.syllables.indexOf(syllable);
            
            // Create syllable card object
            const syllableCard: SyllableCard = {
                graphics: cardGraphics,
                text: cardText,
                zone: dragZone,
                syllable: syllable,
                isPlaced: false,
                correctPosition: correctPosition,
                originalX: cardX,
                originalY: cardY
            };
            
            // Setup drag events
            this.setupDragEvents(syllableCard);
            this.syllableCards.push(syllableCard);
        });
    }
    
    private setupDragEvents(card: SyllableCard) {
        // Drag start
        card.zone.on('dragstart', () => {
            card.graphics.setTint(0x34d399);
            card.text.setTint(0x059669);
            this.children.bringToTop(card.graphics);
            this.children.bringToTop(card.text);
            this.children.bringToTop(card.zone);
        });
        
        // During drag
        card.zone.on('drag', (pointer: any, dragX: number, dragY: number) => {
            card.graphics.x = dragX;
            card.text.x = dragX;
            card.graphics.y = dragY;
            card.text.y = dragY;
        });
        
        // Drag end
        card.zone.on('dragend', () => {
            card.graphics.clearTint();
            card.text.clearTint();
        });
        
        // Drop on target
        card.zone.on('drop', (pointer: any, dropZone: Phaser.GameObjects.Zone) => {
            this.handleDrop(card, dropZone);
        });
        
        // Return to original position if not dropped on valid target
        card.zone.on('dragend', (pointer: any, dragX: number, dragY: number, dropped: boolean) => {
            if (!dropped && !card.isPlaced) {
                this.tweens.add({
                    targets: [card.graphics, card.text],
                    x: card.originalX,
                    y: card.originalY,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
        });
    }
    
    private handleDrop(card: SyllableCard, dropZone: Phaser.GameObjects.Zone) {
        const slot = this.dropSlots.find(s => s.zone === dropZone);
        if (!slot) return;
        
        // If slot occupied, return previous card to original position
        if (slot.occupied && slot.syllableCard) {
            this.returnCardToOriginal(slot.syllableCard);
        }
        
        // Place new card in slot
        card.isPlaced = true;
        slot.occupied = true;
        slot.syllableCard = card;
        
        // Animate card to slot position
        this.tweens.add({
            targets: [card.graphics, card.text],
            x: slot.zone.x,
            y: slot.zone.y,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.checkWord();
            }
        });
        
        // Visual feedback for correct/incorrect placement
        if (card.correctPosition === slot.position) {
            this.gameData.addCorrectSyllable();
            this.showSlotFeedback(slot, true);
        } else {
            this.gameData.addIncorrectSyllable();
            this.showSlotFeedback(slot, false);
        }
    }
    
    private returnCardToOriginal(card: SyllableCard) {
        card.isPlaced = false;
        
        // Find and clear the slot
        const slot = this.dropSlots.find(s => s.syllableCard === card);
        if (slot) {
            slot.occupied = false;
            slot.syllableCard = null;
        }
        
        // Animate back to original position
        this.tweens.add({
            targets: [card.graphics, card.text],
            x: card.originalX,
            y: card.originalY,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
    
    private showSlotFeedback(slot: DropSlot, isCorrect: boolean) {
        const color = isCorrect ? 0x10b981 : 0xef4444;
        
        // Clear and redraw slot with feedback color
        slot.graphics.clear();
        slot.graphics.fillStyle(color, 0.2);
        slot.graphics.fillRoundedRect(-slot.zone.width/2, -slot.zone.height/2, slot.zone.width, slot.zone.height, 12);
        slot.graphics.lineStyle(3, color, 0.8);
        slot.graphics.strokeRoundedRect(-slot.zone.width/2, -slot.zone.height/2, slot.zone.width, slot.zone.height, 12);
        
        // Return to normal appearance after delay
        this.time.delayedCall(1000, () => {
            slot.graphics.clear();
            slot.graphics.lineStyle(3, 0x10b981, 0.6);
            slot.graphics.strokeRoundedRect(-slot.zone.width/2, -slot.zone.height/2, slot.zone.width, slot.zone.height, 12);
            slot.graphics.lineStyle(1, 0x34d399, 0.4);
            slot.graphics.strokeRoundedRect(-slot.zone.width/2 + 2, -slot.zone.height/2 + 2, slot.zone.width - 4, slot.zone.height - 4, 10);
        });
    }
    
    private checkWord() {
        // Check if all slots are filled
        const allFilled = this.dropSlots.every(slot => slot.occupied);
        if (!allFilled) return;
        
        // Check if word is correct
        const isCorrect = this.dropSlots.every(slot => 
            slot.syllableCard && slot.syllableCard.correctPosition === slot.position
        );
        
        if (isCorrect) {
            this.wordCompleted();
        } else {
            this.showFeedback('Revisa el orden de las silabas', '#f59e0b');
        }
    }
    
    private wordCompleted() {
        this.gameData.completeWord();
        this.wordText.setText(this.currentWord.text);
        
        // Success animation
        this.tweens.add({
            targets: this.wordText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            ease: 'Back.easeOut',
            yoyo: true
        });
        
        this.showFeedback('Excelente +50 puntos', '#10b981');
        
        // Success confetti
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#6ee7b7']
        });
        
        this.updateUI();
        
        // Move to next word after delay
        this.time.delayedCall(2500, () => {
            if (this.gameData.wordsCompleted >= this.gameData.level * 2) {
                this.completeLevel();
            } else {
                this.startNewWord();
            }
        });
    }
    
    private completeLevel() {
        this.gameData.levelUp();
        
        // Level complete confetti
        confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#6ee7b7', '#22d3ee']
        });
        
        Swal.fire({
            title: '🎉 Nivel Completado',
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 16px; text-align: center;">
                    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)); 
                                padding: 16px; border-radius: 12px; margin-bottom: 12px;
                                border: 2px solid rgba(16, 185, 129, 0.25);">
                        <div style="font-size: 28px; font-weight: bold; color: #059669; margin-bottom: 6px;">
                            Nivel ` + this.gameData.level + `
                        </div>
                        <div style="font-size: 14px; color: #6b7280;">
                            Palabras mas complejas te esperan
                        </div>
                    </div>
                    <div style="color: #059669; font-size: 16px; font-weight: 600;">
                        +` + (this.gameData.level * 10) + ` puntos bonus
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
        
        this.time.delayedCall(3000, () => this.startNewWord());
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
        
        if (this.gameData.timeLeft <= 8) {
            this.timerText.setColor('#dc2626');
        }
        
        if (this.gameData.timeLeft <= 0) {
            this.timeUp();
        }
    }
    
    private timeUp() {
        this.gameData.loseLife();
        this.showFeedback('Se acabo el tiempo -1 vida', '#ef4444');
        
        if (this.gameData.lives <= 0) {
            this.time.delayedCall(1500, () => this.gameOver());
        } else {
            this.time.delayedCall(2000, () => this.startNewWord());
        }
        
        this.updateUI();
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
        
        if (this.gameData.lives <= 1) {
            this.livesText.setColor('#dc2626');
            this.tweens.add({
                targets: this.livesText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                ease: 'Power2.easeOut',
                yoyo: true
            });
        }
    }
    
    private clearGameObjects() {
        // Clear syllable cards
        this.syllableCards.forEach(card => {
            card.graphics?.destroy();
            card.text?.destroy();
            card.zone?.destroy();
        });
        this.syllableCards = [];
        
        // Clear drop slots
        this.dropSlots.forEach(slot => {
            slot.graphics?.destroy();
            slot.zone?.destroy();
        });
        this.dropSlots = [];
    }
    
    private gameWin() {
        this.gameTimer.remove();
        this.clearGameObjects();
        this.gameData.endSession();
        
        // Epic win confetti sequence
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 200, () => {
                confetti({
                    particleCount: 80,
                    spread: 80,
                    origin: { 
                       x: 0.2 + (i * 0.2), 
                       y: 0.7 
                   },
                   colors: ['#10b981', '#34d399', '#6ee7b7', '#22d3ee', '#a78bfa']
               });
           });
       }
       
       Swal.fire({
           title: '🏆 MAESTRO CONSTRUCTOR',
           html: `
               <div style="font-family: 'Inter', sans-serif; padding: 20px; text-align: center;">
                   <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)); 
                               padding: 24px; border-radius: 16px; margin-bottom: 20px;
                               border: 3px solid rgba(16, 185, 129, 0.3);">
                       <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
                       <div style="font-size: 24px; font-weight: bold; color: #059669; margin-bottom: 8px;">
                           Has completado todos los niveles
                       </div>
                       <div style="font-size: 16px; color: #6b7280;">
                           Tu conciencia silabica es excepcional
                       </div>
                   </div>
                   <div style="color: #059669; font-size: 20px; font-weight: 700;">
                       Puntuacion Final: ` + this.gameData.score + ` puntos
                   </div>
               </div>
           `,
           confirmButtonText: '🔄 Jugar de Nuevo',
           confirmButtonColor: '#10b981',
           buttonsStyling: false,
           customClass: {
               popup: 'compact-game-popup',
               confirmButton: 'compact-game-btn'
           }
       }).then(() => {
           (window as any).restartGame();
       });
   }
   
   private gameOver() {
       this.gameTimer.remove();
       this.clearGameObjects();
       this.gameData.endSession();
       this.showGameOverScreen();
   }
   
   private showGameOverScreen() {
       const sessionData = this.gameData.getSessionData();
       
       Swal.fire({
           title: '🎮 Partida Terminada',
           html: `
               <div style="font-family: 'Inter', sans-serif; padding: 16px;">
                   <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1)); 
                               padding: 16px; border-radius: 12px; margin-bottom: 16px;
                               border: 2px solid rgba(16, 185, 129, 0.25);">
                       <div style="font-size: 16px; font-weight: 600; color: #059669; margin-bottom: 6px;">
                           Buen trabajo construyendo palabras
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
                           <div style="font-size: 11px; color: #6b7280;">Precision</div>
                       </div>
                       <div style="background: rgba(96, 165, 250, 0.1); padding: 12px; border-radius: 10px; 
                                   text-align: center; border: 2px solid rgba(96, 165, 250, 0.3);">
                           <div style="font-size: 20px; font-weight: bold; color: #2563eb; margin-bottom: 3px;">
                               ` + sessionData.wordsCompleted + `
                           </div>
                           <div style="font-size: 11px; color: #6b7280;">Palabras</div>
                       </div>
                   </div>
                   
                   <div style="background: rgba(52, 211, 153, 0.1); padding: 12px; border-radius: 10px; 
                               border: 2px solid rgba(52, 211, 153, 0.25); text-align: center;">
                       <div style="font-weight: 600; color: #10b981; margin-bottom: 4px; font-size: 14px;">🧠 Analisis Silabico</div>
                       <div style="font-size: 12px; color: #6b7280;">
                           ` + sessionData.performanceRating + ` • Conciencia fonologica: ` + sessionData.phonologicalAwareness + `%
                       </div>
                   </div>
               </div>
           `,
           showCancelButton: true,
           confirmButtonText: '🔄 Jugar Otra Vez',
           cancelButtonText: '📊 Ver Dashboard',
           confirmButtonColor: '#10b981',
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