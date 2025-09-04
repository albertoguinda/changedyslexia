import { WordBuilderScene } from '../scenes/WordBuilderScene';
import { SyllablePool } from '../data/SyllablePool';

export class GameplayManager {
    private scene: WordBuilderScene;
    private syllableCards: any[] = [];
    private dropSlots: any[] = [];
    private gameScale: number = 1;
    private centerX: number = 0;
    private centerY: number = 0;

    constructor(scene: WordBuilderScene) {
        this.scene = scene;
        this.calculateLayout();
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

    setupGameplay(currentWord: any) {
        this.createDropSlots(currentWord);
        this.createSyllableCards(currentWord);
    }

    clearGameObjects() {
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

    private createDropSlots(currentWord: any) {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        const numSlots = currentWord.syllables.length;
        const slotWidth = Math.max(70, 90 * this.gameScale);
        const slotHeight = Math.max(50, 65 * this.gameScale);
        const spacing = 15;
        const totalWidth = (slotWidth * numSlots) + (spacing * (numSlots - 1));
        const startX = this.centerX - totalWidth / 2;
        const slotY = height * 0.55;
        
        for (let i = 0; i < numSlots; i++) {
            const slotX = startX + (slotWidth / 2) + i * (slotWidth + spacing);
            
            const slotGraphics = this.scene.add.graphics();
            slotGraphics.fillStyle(0xffffff, 1);
            slotGraphics.fillRoundedRect(-slotWidth/2, -slotHeight/2, slotWidth, slotHeight, 16);
            slotGraphics.lineStyle(2, 0xe5e7eb, 1);
            slotGraphics.strokeRoundedRect(-slotWidth/2, -slotHeight/2, slotWidth, slotHeight, 16);
            slotGraphics.x = slotX;
            slotGraphics.y = slotY;
            
            const dropZone = this.scene.add.zone(slotX, slotY, slotWidth, slotHeight);
            dropZone.setRectangleDropZone(slotWidth, slotHeight);
            dropZone.setData('slotIndex', i);
            
            this.dropSlots.push({
                graphics: slotGraphics,
                zone: dropZone,
                position: i,
                occupied: false,
                syllableCard: null,
                width: slotWidth,
                height: slotHeight
            });
        }
    }

    private createSyllableCards(currentWord: any) {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        const syllables = SyllablePool.generateDistractors(
            currentWord.syllables,
            this.scene.gameDataRef.level
        );
        
        const cardWidth = Math.max(70, 90 * this.gameScale);
        const cardHeight = Math.max(50, 65 * this.gameScale);
        const spacing = 15;
        const totalWidth = (cardWidth * syllables.length) + (spacing * (syllables.length - 1));
        const startX = this.centerX - totalWidth / 2;
        const cardY = height * 0.75;
        
        syllables.forEach((syllable, index) => {
            const cardX = startX + (cardWidth / 2) + index * (cardWidth + spacing);
            
            this.scene.time.delayedCall(index * 80, () => {
                this.createSyllableCard(syllable, cardX, cardY, cardWidth, cardHeight, currentWord);
            });
        });
    }

    private createSyllableCard(
        syllable: string,
        cardX: number,
        cardY: number,
        cardWidth: number,
        cardHeight: number,
        currentWord: any
    ) {
        const cardGraphics = this.scene.add.graphics();
        cardGraphics.fillStyle(0xffffff, 1);
        cardGraphics.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 16);
        cardGraphics.lineStyle(2, 0xe5e7eb, 1);
        cardGraphics.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 16);
        cardGraphics.x = cardX;
        cardGraphics.y = cardY;
        
        const cardText = this.scene.add.text(cardX, cardY, syllable, {
            fontSize: Math.max(16, 20 * this.gameScale) + 'px',
            fontFamily: 'OpenDyslexic, Inter, Arial, sans-serif',
            color: '#374151',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const dragZone = this.scene.add.zone(cardX, cardY, cardWidth, cardHeight);
        dragZone.setInteractive({ 
            useHandCursor: true,
            draggable: true 
        });
        
        const correctPosition = currentWord.syllables.indexOf(syllable);
        dragZone.setData('syllable', syllable);
        dragZone.setData('correctPosition', correctPosition);
        dragZone.setData('originalX', cardX);
        dragZone.setData('originalY', cardY);
        dragZone.setData('graphics', cardGraphics);
        dragZone.setData('text', cardText);
        dragZone.setData('isPlaced', false);
        dragZone.setData('width', cardWidth);
        dragZone.setData('height', cardHeight);
        
        this.setupDragEvents(dragZone);
        this.syllableCards.push(dragZone);
        
        cardText.setScale(0.8);
        cardGraphics.setScale(0.8);
        
        this.scene.tweens.add({
            targets: [cardText, cardGraphics],
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    private setupDragEvents(dragZone: Phaser.GameObjects.Zone) {
        this.scene.input.setDraggable(dragZone);
        
        dragZone.on('drag', (pointer: any, dragX: number, dragY: number) => {
            const graphics = dragZone.getData('graphics');
            const text = dragZone.getData('text');
            graphics.x = dragX;
            text.x = dragX;
            graphics.y = dragY;
            text.y = dragY;
        });
        
        dragZone.on('drop', (pointer: any, dropZone: Phaser.GameObjects.Zone) => {
            this.handleDrop(dragZone, dropZone);
        });
    }

    private handleDrop(dragZone: Phaser.GameObjects.Zone, dropZone: Phaser.GameObjects.Zone) {
        const slotIndex = dropZone.getData('slotIndex');
        if (slotIndex === undefined) return;
        
        const slot = this.dropSlots[slotIndex];
        if (!slot) return;
        
        const graphics = dragZone.getData('graphics');
        const text = dragZone.getData('text');
        const correctPosition = dragZone.getData('correctPosition');
        
        console.log(`Dropped syllable in slot ${slotIndex}, correct position is ${correctPosition}`);
        
        dragZone.setData('isPlaced', true);
        slot.occupied = true;
        slot.syllableCard = dragZone;
        
        this.scene.tweens.add({
            targets: [graphics, text],
            x: slot.zone.x,
            y: slot.zone.y,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                console.log('Drop animation complete, checking word...');
                this.checkWord();
            }
        });
        
        if (correctPosition === slotIndex) {
            this.scene.gameDataRef.addCorrectSyllable();
            console.log('Correct syllable placement');
        } else {
            this.scene.gameDataRef.addIncorrectSyllable();
            console.log('Incorrect syllable placement');
        }
    }

    private checkWord() {
        const allFilled = this.dropSlots.every(slot => slot.occupied);
        if (!allFilled) return;
        
        const isCorrect = this.dropSlots.every(slot => {
            const dragZone = slot.syllableCard;
            if (!dragZone) return false;
            
            const correctPosition = dragZone.getData('correctPosition');
            return correctPosition === slot.position;
        });
        
        console.log('Checking word completion:', { allFilled, isCorrect });
        
        if (isCorrect) {
            console.log('Word completed successfully!');
            this.scene.onWordCompleted();
        } else {
            console.log('Word incorrect, waiting for correction');
        }
    }
}