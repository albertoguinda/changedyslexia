import { Scene } from 'phaser';
import { GameData } from '../utils/GameData';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

export class WordBuilderScene extends Scene {
    private gameData: GameData;
    private scoreText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;
    private levelText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private wordText!: Phaser.GameObjects.Text;
    private emojiText!: Phaser.GameObjects.Text;
    private feedbackText!: Phaser.GameObjects.Text;
    private progressBar!: Phaser.GameObjects.Graphics;
    private syllableCards: any[] = [];
    private dropSlots: any[] = [];
    private currentWord: any;
    private gameTimer!: Phaser.Time.TimerEvent;
    private centerX: number = 0;
    private centerY: number = 0;
    private gameScale: number = 1;
    
    private words = [
        { text: "CASA", syllables: ["CA", "SA"], emoji: "í¿ ", level: 1 },
        { text: "MESA", syllables: ["ME", "SA"], emoji: "íº‘", level: 1 },
        { text: "GATO", syllables: ["GA", "TO"], emoji: "í°±", level: 1 },
        { text: "PELOTA", syllables: ["PE", "LO", "TA"], emoji: "âš½", level: 2 },
        { text: "CAMISA", syllables: ["CA", "MI", "SA"], emoji: "í±•", level: 2 }
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
            title: 'Constructor de Palabras',
            html: `
                <div style="font-family: 'Inter', sans-serif; padding: 12px;">
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                        <h3 style="margin: 0 0 8px 0; color: #059669; font-size: 18px; font-weight: 700;">
                            Tu mision
                        </h3>
                        <p style="margin: 0; color: #374151; font-size: 15px;">
                            Arrastra las silabas a los cuadros para formar la palabra del emoji
                        </p>
                    </div>
                    <div style="background: rgba(79, 70, 229, 0.1); padding: 12px; border-radius: 10px; text-align: center;">
                        <div style="color: #4f46e5; font-weight: 600; margin-bottom: 6px;">Consejo</div>
                        <div style="font-size: 13px; color: #6b7280;">
                            El orden de las silabas es importante
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: 'Construir',
            confirmButtonColor: '#10b981',
            allowOutsideClick: false
        }).then(() => {
            this.startNewWord();
        });
    }
    
    private createBackground() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    }
    
    private createUI() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        this.add.text(this.centerX, height * 0.06, 'Word Builder', {
            fontSize: Math.max(20, 24 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#1f2937',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.createStatsContainer();
        this.createProgressBar();
        this.createWordArea();
        
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
        
        const statsContainer = this.add.graphics();
        statsContainer.fillStyle(0xf0fdf4, 0.9);
        statsContainer.fillRoundedRect(width * 0.05, height * 0.11, width * 0.9, height * 0.08, 12);
        statsContainer.lineStyle(1, 0x10b981, 0.3);
        statsContainer.strokeRoundedRect(width * 0.05, height * 0.11, width * 0.9, height * 0.08, 12);
        
        const statsY = height * 0.15;
        const fontSize = Math.max(14, 16 * this.gameScale);
        
        this.scoreText = this.add.text(width * 0.175, statsY, 'Puntos: ' + this.gameData.score, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#059669',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.livesText = this.add.text(width * 0.375, statsY, 'Vidas: ' + this.gameData.lives, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#dc2626',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.levelText = this.add.text(width * 0.625, statsY, 'Nivel: ' + this.gameData.level, {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#7c3aed',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.timerText = this.add.text(width * 0.825, statsY, 'Tiempo: ' + this.gameData.timeLeft + 's', {
            fontSize: fontSize + 'px',
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#ea580c',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }
    
    private createProgressBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0xd1fae5, 1);
        progressBg.fillRoundedRect(width * 0.05, height * 0.21, width * 0.9, 6, 3);
        
        this.progressBar = this.add.graphics();
        this.updateProgressBar();
    }
    
    private updateProgressBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.progressBar.clear();
        const progress = this.gameData.timeLeft / 30;
        const barWidth = (width * 0.9) * progress;
        
        let color = 0x10b981;
        if (this.gameData.timeLeft <= 15) color = 0xf59e0b;
        if (this.gameData.timeLeft <= 8) color = 0xef4444;
        
        this.progressBar.fillStyle(color, 1);
        this.progressBar.fillRoundedRect(width * 0.05, height * 0.21, barWidth, 6, 3);
    }
    
    private createWordArea() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // EMOJI GRANDE
        this.emojiText = this.add.text(this.centerX, height * 0.32, '', {
            fontSize: Math.max(60, 80 * this.gameScale) + 'px',
            fontFamily: 'Inter, Arial, sans-serif'
        }).setOrigin(0.5);
        
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
        
        const levelWords = this.words.filter(word => word.level === this.gameData.level);
        if (levelWords.length === 0) {
            this.gameWin();
            return;
        }
        
        this.currentWord = Phaser.Utils.Array.GetRandom(levelWords);
        this.gameData.startNewWord();
        
        // MOSTRAR EMOJI
        this.emojiText.setText(this.currentWord.emoji);
        this.wordText.setText('');
        
        this.time.delayedCall(500, () => {
            this.createDropSlots();
            this.createSyllableCards();
        });
    }
    
    private createDropSlots() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const numSlots = this.currentWord.syllables.length;
        const slotWidth = 100;
        const slotHeight = 70;
        const spacing = 20;
        const totalWidth = (slotWidth * numSlots) + (spacing * (numSlots - 1));
        const startX = this.centerX - totalWidth / 2;
        const slotY = height * 0.55;
        
        for (let i = 0; i < numSlots; i++) {
            const slotX = startX + (slotWidth / 2) + i * (slotWidth + spacing);
            
            const slotGraphics = this.add.graphics();
            slotGraphics.lineStyle(3, 0x10b981, 0.8);
            slotGraphics.strokeRoundedRect(-slotWidth/2, -slotHeight/2, slotWidth, slotHeight, 12);
            slotGraphics.x = slotX;
            slotGraphics.y = slotY;
            
            const dropZone = this.add.zone(slotX, slotY, slotWidth, slotHeight);
            dropZone.setRectangleDropZone(slotWidth, slotHeight);
            dropZone.setData('slotIndex', i);
            
            this.dropSlots.push({
                graphics: slotGraphics,
                zone: dropZone,
                position: i,
                occupied: false,
                syllableCard: null
            });
        }
    }
    
    private createSyllableCards() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Silabas + distractores
        let syllables = [...this.currentWord.syllables];
        
        // AÃ±adir 1 distractor
        const otherWords = this.words.filter(w => w.text !== this.currentWord.text);
        if (otherWords.length > 0) {
            const randomWord = Phaser.Utils.Array.GetRandom(otherWords);
            const distractor = Phaser.Utils.Array.GetRandom(randomWord.syllables);
            if (!syllables.includes(distractor)) {
                syllables.push(distractor);
            }
        }
        
        syllables = Phaser.Utils.Array.Shuffle(syllables);
        
        const cardWidth = 85;
        const cardHeight = 60;
        const spacing = 15;
        const totalWidth = (cardWidth * syllables.length) + (spacing * (syllables.length - 1));
        const startX = this.centerX - totalWidth / 2;
        const cardY = height * 0.75;
        
        syllables.forEach((syllable, index) => {
            const cardX = startX + (cardWidth / 2) + index * (cardWidth + spacing);
            
            // FONDO DE CARTA
            const cardGraphics = this.add.graphics();
            cardGraphics.fillStyle(0xffffff, 1);
            cardGraphics.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 12);
            cardGraphics.lineStyle(2, 0x34d399, 1);
            cardGraphics.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 12);
            cardGraphics.x = cardX;
            cardGraphics.y = cardY;
            
            // TEXTO DE SILABA
            const cardText = this.add.text(cardX, cardY, syllable, {
                fontSize: '20px',
                fontFamily: 'Inter, Arial, sans-serif',
                color: '#374151',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // ZONA DRAGGABLE
            const dragZone = this.add.zone(cardX, cardY, cardWidth, cardHeight);
            dragZone.setInteractive({ 
                useHandCursor: true, 
                draggable: true 
            });
            
            // DATOS DE LA CARTA
            const correctPosition = this.currentWord.syllables.indexOf(syllable);
            dragZone.setData('syllable', syllable);
            dragZone.setData('correctPosition', correctPosition);
            dragZone.setData('originalX', cardX);
            dragZone.setData('originalY', cardY);
            dragZone.setData('graphics', cardGraphics);
            dragZone.setData('text', cardText);
            dragZone.setData('isPlaced', false);
            
            // EVENTOS DRAG & DROP
            this.setupDragEvents(dragZone);
            
            this.syllableCards.push(dragZone);
        });
    }
    
    private setupDragEvents(dragZone: Phaser.GameObjects.Zone) {
        const graphics = dragZone.getData('graphics');
        const text = dragZone.getData('text');
        
        // INICIAR DRAG
        dragZone.on('dragstart', () => {
            graphics.setTint(0x34d399);
            text.setTint(0x059669);
            this.children.bringToTop(graphics);
            this.children.bringToTop(text);
            this.children.bringToTop(dragZone);
        });
        
        // DURANTE DRAG
        dragZone.on('drag', (pointer: any, dragX: number, dragY: number) => {
            graphics.x = dragX;
            text.x = dragX;
            graphics.y = dragY;
            text.y = dragY;
        });
        
        // TERMINAR DRAG
        dragZone.on('dragend', () => {
            graphics.clearTint();
            text.clearTint();
        });
        
        // SOLTAR EN TARGET
        dragZone.on('drop', (pointer: any, dropZone: Phaser.GameObjects.Zone) => {
            this.handleDrop(dragZone, dropZone);
        });
        
        // VOLVER A POSICION ORIGINAL SI NO SE SUELTA EN TARGET VALIDO
        dragZone.on('dragend', (pointer: any, dragX: number, dragY: number, dropped: boolean) => {
            if (!dropped && !dragZone.getData('isPlaced')) {
                this.tweens.add({
                    targets: [graphics, text],
                    x: dragZone.getData('originalX'),
                    y: dragZone.getData('originalY'),
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
        });
    }
    
    private handleDrop(dragZone: Phaser.GameObjects.Zone, dropZone: Phaser.GameObjects.Zone) {
        const slotIndex = dropZone.getData('slotIndex');
        if (slotIndex === undefined) return;
        
        const slot = this.dropSlots[slotIndex];
        if (!slot) return;
        
        // Si hay una carta en el slot, devolverla
        if (slot.occupied && slot.syllableCard) {
            this.returnCardToOriginal(slot.syllableCard);
        }
        
        // Colocar nueva carta
        const graphics = dragZone.getData('graphics');
        const text = dragZone.getData('text');
        const correctPosition = dragZone.getData('correctPosition');
        
        dragZone.setData('isPlaced', true);
        slot.occupied = true;
        slot.syllableCard = dragZone;
        
        // Animar a posicion del slot
        this.tweens.add({
            targets: [graphics, text],
            x: slot.zone.x,
            y: slot.zone.y,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.checkWord();
            }
        });
        
        // Feedback visual
        if (correctPosition === slotIndex) {
            this.gameData.addCorrectSyllable();
            this.showSlotFeedback(slot, true);
        } else {
            this.gameData.addIncorrectSyllable();
            this.showSlotFeedback(slot, false);
        }
    }
    
    private returnCardToOriginal(dragZone: Phaser.GameObjects.Zone) {
        const graphics = dragZone.getData('graphics');
        const text = dragZone.getData('text');
        
        dragZone.setData('isPlaced', false);
        
        // Limpiar slot
        const slot = this.dropSlots.find(s => s.syllableCard === dragZone);
        if (slot) {
            slot.occupied = false;
            slot.syllableCard = null;
        }
        
        this.tweens.add({
            targets: [graphics, text],
            x: dragZone.getData('originalX'),
            y: dragZone.getData('originalY'),
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
    
    private showSlotFeedback(slot: any, isCorrect: boolean) {
        const color = isCorrect ? 0x10b981 : 0xef4444;
        
        slot.graphics.clear();
        slot.graphics.fillStyle(color, 0.2);
        slot.graphics.fillRoundedRect(-50, -35, 100, 70, 12);
        slot.graphics.lineStyle(3, color, 0.8);
        slot.graphics.strokeRoundedRect(-50, -35, 100, 70, 12);
        
        this.time.delayedCall(1000, () => {
            slot.graphics.clear();
            slot.graphics.lineStyle(3, 0x10b981, 0.8);
            slot.graphics.strokeRoundedRect(-50, -35, 100, 70, 12);
        });
    }
    
    private checkWord() {
        const allFilled = this.dropSlots.every(slot => slot.occupied);
        if (!allFilled) return;
        
        const isCorrect = this.dropSlots.every(slot => {
            const dragZone = slot.syllableCard;
            return dragZone && dragZone.getData('correctPosition') === slot.position;
        });
        
        if (isCorrect) {
            this.wordCompleted();
        } else {
            this.showFeedback('Revisa el orden de las silabas', '#f59e0b');
        }
    }
    
    private wordCompleted() {
        this.gameData.completeWord();
        this.wordText.setText(this.currentWord.text);
        
        this.tweens.add({
            targets: this.wordText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            ease: 'Back.easeOut',
            yoyo: true
        });
        
        this.showFeedback('Excelente +50 puntos', '#10b981');
        
        confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#6ee7b7']
        });
        
        this.updateUI();
        
        this.time.delayedCall(2500, () => {
            this.startNewWord();
        });
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
        this.timerText.setText('Tiempo: ' + this.gameData.timeLeft + 's');
        this.updateProgressBar();
        
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
        this.scoreText.setText('Puntos: ' + this.gameData.score);
        this.livesText.setText('Vidas: ' + this.gameData.lives);
        this.levelText.setText('Nivel: ' + this.gameData.level);
    }
    
    private clearGameObjects() {
        this.syllableCards.forEach(card => {
            const graphics = card.getData('graphics');
            const text = card.getData('text');
            graphics?.destroy();
            text?.destroy();
            card?.destroy();
        });
        this.syllableCards = [];
        
        this.dropSlots.forEach(slot => {
            slot.graphics?.destroy();
            slot.zone?.destroy();
        });
        this.dropSlots = [];
    }
    
    private gameWin() {
        this.gameTimer.remove();
        this.clearGameObjects();
        
        Swal.fire({
            title: 'MAESTRO CONSTRUCTOR',
            html: 'Puntuacion Final: ' + this.gameData.score + ' puntos',
            confirmButtonText: 'Jugar de Nuevo',
            confirmButtonColor: '#10b981'
        }).then(() => {
            (window as any).restartGame();
        });
    }
    
    private gameOver() {
        this.gameTimer.remove();
        this.clearGameObjects();
        
        Swal.fire({
            title: 'Partida Terminada',
            html: 'Puntuacion: ' + this.gameData.score + ' puntos',
            showCancelButton: true,
            confirmButtonText: 'Jugar Otra Vez',
            cancelButtonText: 'Dashboard',
            confirmButtonColor: '#10b981'
        }).then((result) => {
            if (result.isConfirmed) {
                (window as any).restartGame();
            } else {
                window.open('http://localhost:4200', '_blank');
            }
        });
    }
}
