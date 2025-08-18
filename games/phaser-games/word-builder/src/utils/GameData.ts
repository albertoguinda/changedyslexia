export class GameData {
    public score: number = 0;
    public level: number = 1;
    public lives: number = 3;
    public timeLeft: number = 30;
    public wordsCompleted: number = 0;
    public correctSyllables: number = 0;
    public incorrectSyllables: number = 0;
    
    private sessionStartTime: number;
    private currentWordStartTime: number;

    constructor() {
        this.sessionStartTime = Date.now();
        this.currentWordStartTime = Date.now();
    }

    // Score management
    addScore(points: number) {
        this.score += points;
    }

    // Lives management
    loseLife() {
        this.lives = Math.max(0, this.lives - 1);
    }

    // Level management
    levelUp() {
        this.level++;
        this.timeLeft = 30; // Reset timer for new level
    }

    // Time management
    resetTimer(seconds: number = 30) {
        this.timeLeft = seconds;
    }

    decreaseTime() {
        this.timeLeft = Math.max(0, this.timeLeft - 1);
    }

    // Word tracking
    startNewWord() {
        this.currentWordStartTime = Date.now();
        this.resetTimer(30);
    }

    completeWord() {
        this.wordsCompleted++;
        this.addScore(50); // Base score for completing word
        
        // Bonus for time left
        const timeBonus = this.timeLeft * 2;
        this.addScore(timeBonus);
    }

    // Syllable tracking
    addCorrectSyllable() {
        this.correctSyllables++;
        this.addScore(10);
    }

    addIncorrectSyllable() {
        this.incorrectSyllables++;
    }

    // Session data for end screen
    getSessionData() {
        const totalPlayTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        const totalSyllables = this.correctSyllables + this.incorrectSyllables;
        const accuracy = totalSyllables > 0 ? Math.round((this.correctSyllables / totalSyllables) * 100) : 0;
        
        return {
            score: this.score,
            level: this.level,
            wordsCompleted: this.wordsCompleted,
            correctSyllables: this.correctSyllables,
            incorrectSyllables: this.incorrectSyllables,
            accuracy: accuracy,
            totalPlayTime: totalPlayTime,
            syllablesPerMinute: totalPlayTime > 0 ? Math.round((this.correctSyllables / totalPlayTime) * 60) : 0,
            performanceRating: this.getPerformanceRating(accuracy, this.wordsCompleted),
            phonologicalAwareness: Math.min(100, Math.round((this.wordsCompleted / this.level) * 25)),
            processingSpeed: Math.min(100, Math.round((this.correctSyllables / totalPlayTime) * 30))
        };
    }

    private getPerformanceRating(accuracy: number, wordsCompleted: number): string {
        if (accuracy >= 90 && wordsCompleted >= 10) {
            return "¡Excelente construcción silábica!";
        } else if (accuracy >= 80 && wordsCompleted >= 7) {
            return "¡Muy buena conciencia fonológica!";
        } else if (accuracy >= 70 && wordsCompleted >= 5) {
            return "¡Buen progreso en segmentación!";
        } else if (accuracy >= 60) {
            return "¡Sigue practicando, vas bien!";
        } else {
            return "¡Cada intento te hace mejorar!";
        }
    }

    // End session
    endSession() {
        console.log('Sesión de Word Builder terminada:', this.getSessionData());
    }

    // Reset for new game
    reset() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.timeLeft = 30;
        this.wordsCompleted = 0;
        this.correctSyllables = 0;
        this.incorrectSyllables = 0;
        this.sessionStartTime = Date.now();
        this.currentWordStartTime = Date.now();
    }
}
