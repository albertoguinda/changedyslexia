import { Scene } from 'phaser';
import { GameData } from '../utils/GameData';
import { UIManager } from '../managers/UIManager';
import { GameplayManager } from '../managers/GameplayManager';
import { ModalManager } from '../managers/ModalManager';
import { WordsData } from '../data/WordsData';

export class WordBuilderScene extends Scene {
    private gameData: GameData;
    private uiManager!: UIManager;
    private gameplayManager!: GameplayManager;
    private modalManager!: ModalManager;
    private gameTimer!: Phaser.Time.TimerEvent;
    private currentWord: any;
    private usedWords: any[] = [];
    private achievements: string[] = [];

    constructor() {
        super({ key: 'WordBuilderScene' });
        this.gameData = new GameData();
    }

    create() {
        console.log('WordBuilderScene created');
        this.initializeManagers();
        this.startGameTimer();
        
        // Delay para asegurar que todo esté inicializado
        this.time.delayedCall(100, () => {
            this.showWelcome();
        });
    }

    private initializeManagers() {
        this.uiManager = new UIManager(this);
        this.gameplayManager = new GameplayManager(this);
        this.modalManager = new ModalManager(this);

        this.uiManager.createUI();
    }

    private showWelcome() {
        console.log('Showing welcome modal');
        
        // Asegurar que SweetAlert esté disponible
        if (typeof (window as any).Swal === 'undefined') {
            console.error('SweetAlert no disponible');
            this.startNewWord();
            return;
        }

        // Delay para asegurar que Phaser esté completamente inicializado
        this.time.delayedCall(500, () => {
            this.modalManager.showWelcomeModal(() => {
                console.log('Welcome modal callback ejecutado correctamente');
                this.startNewWord();
            });
        });
    }

    private startNewWord() {
        console.log('Starting new word');
        this.gameplayManager.clearGameObjects();
        this.uiManager.clearFeedback();
        this.uiManager.updateProgressIndicator(this.gameData.wordsCompleted, this.getWordsRequiredForLevel());

        const availableWords = WordsData.getAvailableWords(this.gameData.level, this.usedWords);

        if (availableWords.length === 0) {
            this.usedWords = this.usedWords.filter(used => used.level !== this.gameData.level);
            const freshWords = WordsData.getWordsForLevel(this.gameData.level);

            if (freshWords.length === 0) {
                if (this.gameData.level < 4) {
                    this.levelUp();
                    return;
                } else {
                    this.gameWin();
                    return;
                }
            }

            this.currentWord = WordsData.getRandomWordForLevel(this.gameData.level, []);
        } else {
            this.currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        }

        this.usedWords.push(this.currentWord);
        this.gameData.startNewWord();

        this.uiManager.displayWord(this.currentWord);

        this.time.delayedCall(300, () => {
            this.gameplayManager.setupGameplay(this.currentWord);
        });
    }

    public onWordCompleted() {
        this.gameData.completeWord();
        this.uiManager.showWordComplete(this.currentWord.text);
        this.uiManager.updateUI(this.gameData);
        this.checkAchievements();

        this.time.delayedCall(2500, () => {
            if (this.checkLevelUp()) {
                this.levelUp();
            } else {
                this.startNewWord();
            }
        });
    }

    public onIncorrectPlacement() {
        this.uiManager.showFeedback('Revisa el orden de las sílabas', '#f59e0b');
    }

    public onSyllablePlaced(isCorrect: boolean) {
        if (isCorrect) {
            this.gameData.addCorrectSyllable();
        } else {
            this.gameData.addIncorrectSyllable();
        }
    }

    public onHintUsed() {
        const currentHints = this.gameData.hintsUsed;
        let hintMessage = '';
        const syllables = this.currentWord.syllables;

        switch (currentHints) {
            case 0:
                hintMessage = `La palabra tiene ${syllables.length} sílabas`;
                break;
            case 1:
                hintMessage = `Empieza con "${syllables[0]}"`;
                break;
            case 2:
                if (syllables.length >= 3) {
                    hintMessage = `La segunda sílaba es "${syllables[1]}"`;
                } else {
                    hintMessage = `Termina con "${syllables[syllables.length - 1]}"`;
                }
                break;
            case 3:
                hintMessage = `Termina con "${syllables[syllables.length - 1]}"`;
                break;
            case 4:
                if (syllables.length >= 4) {
                    const middleIndex = Math.floor(syllables.length / 2);
                    hintMessage = `Una sílaba del medio: "${syllables[middleIndex]}"`;
                } else {
                    hintMessage = `Todas las sílabas: ${syllables.join(' - ')}`;
                }
                break;
            default:
                hintMessage = `Todas las sílabas: ${syllables.join(' - ')}`;
        }

        this.uiManager.showFeedback(hintMessage, '#4f46e5');
        this.gameData.usedHint();
        this.uiManager.updateUI(this.gameData);
    }

    private checkLevelUp(): boolean {
        const wordsRequired = this.getWordsRequiredForLevel();
        return (
            this.gameData.wordsCompleted >= wordsRequired &&
            this.gameData.getAccuracy() >= this.getAccuracyRequiredForLevel() &&
            this.gameData.getAverageWordTime() <= this.getTimeRequiredForLevel()
        );
    }

    private levelUp() {
        this.gameData.levelUp();
        this.modalManager.showLevelUp(this.gameData.level, () => {
            this.startNewWord();
        });
    }

    private gameWin() {
        this.gameTimer.remove();
        this.gameplayManager.clearGameObjects();
        const sessionData = this.gameData.endSession();
        this.modalManager.showGameWin(sessionData);
    }

    private gameOver() {
        this.gameTimer.remove();
        this.gameplayManager.clearGameObjects();
        const sessionData = this.gameData.endSession();
        this.modalManager.showGameOver(sessionData);
    }

    private checkAchievements() {
        if (this.gameData.wordsCompleted === 5 && !this.achievements.includes("Primer Constructor")) {
            this.achievements.push("Primer Constructor");
            this.uiManager.showAchievement("Primer Constructor");
        }

        if (this.gameData.getAccuracy() === 100 && this.gameData.wordsCompleted >= 3 && !this.achievements.includes("Precisión Perfecta")) {
            this.achievements.push("Precisión Perfecta");
            this.uiManager.showAchievement("Precisión Perfecta");
        }
    }

    private startGameTimer() {
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    private updateTimer() {
        this.gameData.decreaseTime();
        this.uiManager.updateTimer(this.gameData.timeLeft);

        if (this.gameData.timeLeft <= 0) {
            this.gameData.loseLife();
            this.uiManager.showFeedback('Se acabó el tiempo -1 vida', '#ef4444');

            if (this.gameData.lives <= 0) {
                this.time.delayedCall(1500, () => this.gameOver());
            } else {
                this.time.delayedCall(2000, () => this.startNewWord());
            }

            this.uiManager.updateUI(this.gameData);
        }
    }

    private getWordsRequiredForLevel(): number {
        return [0, 5, 8, 12, 15][this.gameData.level] || 20;
    }

    private getAccuracyRequiredForLevel(): number {
        return [0, 70, 75, 80, 85][this.gameData.level] || 90;
    }

    private getTimeRequiredForLevel(): number {
        return [0, 25, 20, 18, 15][this.gameData.level] || 12;
    }

    public get gameDataRef() { return this.gameData; }
    public get currentWordRef() { return this.currentWord; }
}