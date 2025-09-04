export class GameData {
    public score: number = 0;
    public level: number = 1;
    public lives: number = 3;
    public timeLeft: number = 30;
    public wordsCompleted: number = 0;
    public correctSyllables: number = 0;
    public incorrectSyllables: number = 0;
    public currentStreak: number = 0;
    public bestStreak: number = 0;
    public hintsUsed: number = 0;
    public perfectWords: number = 0;
    public totalAttempts: number = 0;
    
    private sessionStartTime: number;
    private currentWordStartTime: number;
    private wordTimes: number[] = [];

    constructor() {
        this.sessionStartTime = Date.now();
        this.currentWordStartTime = Date.now();
    }

    addScore(points: number) {
        this.score += points;
    }

    loseLife() {
        this.lives = Math.max(0, this.lives - 1);
        this.currentStreak = 0;
    }

    levelUp() {
        this.level++;
        const bonus = this.level * 10;
        this.addScore(bonus);
        this.timeLeft = 30;
    }

    resetTimer(seconds: number = 30) {
        this.timeLeft = seconds;
    }

    decreaseTime() {
        this.timeLeft = Math.max(0, this.timeLeft - 1);
    }

    startNewWord() {
        this.currentWordStartTime = Date.now();
        this.resetTimer(30);
        this.totalAttempts++;
    }

    completeWord() {
        const wordTime = (Date.now() - this.currentWordStartTime) / 1000;
        this.wordTimes.push(wordTime);
        this.wordsCompleted++;
        this.currentStreak++;
        this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
        
        this.addScore(50);
        
        const timeBonus = Math.max(0, this.timeLeft * 2);
        this.addScore(timeBonus);
        
        if (this.currentStreak >= 3) {
            const streakBonus = this.currentStreak * 5;
            this.addScore(streakBonus);
        }
        
        if (this.incorrectSyllables === 0) {
            this.perfectWords++;
            this.addScore(25);
        }
    }

    addCorrectSyllable() {
        this.correctSyllables++;
        this.addScore(10);
    }

    addIncorrectSyllable() {
        this.incorrectSyllables++;
        this.currentStreak = Math.max(0, this.currentStreak - 1);
    }

    usedHint() {
        this.hintsUsed++;
        this.score = Math.max(0, this.score - 5);
    }

    getAccuracy(): number {
        const total = this.correctSyllables + this.incorrectSyllables;
        if (total === 0) return 100;
        return Math.round((this.correctSyllables / total) * 100);
    }

    getAverageWordTime(): number {
        if (this.wordTimes.length === 0) return 0;
        const total = this.wordTimes.reduce((sum, time) => sum + time, 0);
        return Math.round(total / this.wordTimes.length);
    }

    getPerformanceRating(): string {
        const accuracy = this.getAccuracy();
        const speed = this.getAverageWordTime();
        const level = this.level;
        
        if (accuracy >= 95 && speed <= 15 && level >= 3) {
            return "Construcción silábica excepcional";
        } else if (accuracy >= 90 && speed <= 20 && level >= 2) {
            return "Excelente conciencia fonológica";
        } else if (accuracy >= 80 && speed <= 25) {
            return "Muy buena segmentación silábica";
        } else if (accuracy >= 70) {
            return "Buen progreso en construcción";
        } else if (accuracy >= 60) {
            return "Sigue practicando, vas bien";
        } else {
            return "Cada intento te hace mejorar";
        }
    }

    getSessionData() {
        const totalPlayTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        
        return {
            game: 'word-builder',
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            score: this.score,
            level: this.level,
            wordsCompleted: this.wordsCompleted,
            totalPlayTime: totalPlayTime,
            accuracy: this.getAccuracy(),
            correctSyllables: this.correctSyllables,
            incorrectSyllables: this.incorrectSyllables,
            totalAttempts: this.totalAttempts,
            perfectWords: this.perfectWords,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            hintsUsed: this.hintsUsed,
            averageWordTime: this.getAverageWordTime(),
            performanceRating: this.getPerformanceRating(),
            deviceType: this.getDeviceType(),
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            startTime: new Date(this.sessionStartTime).toISOString(),
            endTime: new Date().toISOString()
        };
    }

    private getDeviceType(): string {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile';
        if (width <= 768) return 'tablet';
        return 'desktop';
    }

    async sendSessionToAPI(): Promise<boolean> {
        const sessionData = this.getSessionData();
        
        try {
            const response = await fetch('http://localhost:8000/api/game-sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game: sessionData.game,
                    version: sessionData.version,
                    score: sessionData.score,
                    level: sessionData.level,
                    accuracy: sessionData.accuracy,
                    timeSpent: sessionData.averageWordTime,
                    totalPlayTime: sessionData.totalPlayTime,
                    correctAnswers: sessionData.correctSyllables,
                    incorrectAnswers: sessionData.incorrectSyllables,
                    totalAttempts: sessionData.totalAttempts,
                    bestStreak: sessionData.bestStreak,
                    hintsUsed: sessionData.hintsUsed,
                    skillMetrics: {
                        syllable_construction: {
                            correct_first_attempt: sessionData.correctSyllables,
                            required_hints: sessionData.hintsUsed,
                            syllable_errors: sessionData.incorrectSyllables,
                            words_completed: sessionData.wordsCompleted,
                            perfect_words: sessionData.perfectWords
                        }
                    },
                    detailedMetrics: {
                        session_quality: {
                            focus_score: Math.min(100, sessionData.accuracy + 10),
                            engagement_level: Math.min(100, (this.currentStreak * 15) + 50),
                            word_difficulty_progression: this.level
                        }
                    },
                    deviceType: this.getDeviceType(),
                    screenSize: sessionData.screenSize,
                    performanceRating: sessionData.performanceRating,
                    visualDiscrimination: Math.max(40, Math.min(95, sessionData.accuracy - 5)),
                    attentionSpan: Math.max(35, Math.min(100, sessionData.accuracy + 5)),
                    processingSpeed: Math.max(45, Math.min(100, 100 - sessionData.averageWordTime)),
                    phonologicalAwareness: Math.max(40, Math.min(95, sessionData.accuracy + 10))
                })
            });

            if (response.ok) {
                console.log('Sesión enviada exitosamente a la API');
                return true;
            } else {
                console.error('Error al enviar sesión:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error de conexión al enviar sesión:', error);
            return false;
        }
    }

    endSession() {
        const sessionData = this.getSessionData();
        console.log('Word Builder session data:', sessionData);
        
        // Enviar a API
        this.sendSessionToAPI();
        
        // Save to localStorage como fallback
        const existingSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
        existingSessions.push(sessionData);
        
        if (existingSessions.length > 50) {
            existingSessions.splice(0, existingSessions.length - 50);
        }
        
        localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
        localStorage.setItem('lastGameSession', JSON.stringify(sessionData));
        
        return sessionData;
    }

    reset() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.timeLeft = 30;
        this.wordsCompleted = 0;
        this.correctSyllables = 0;
        this.incorrectSyllables = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.hintsUsed = 0;
        this.perfectWords = 0;
        this.totalAttempts = 0;
        this.sessionStartTime = Date.now();
        this.currentWordStartTime = Date.now();
        this.wordTimes = [];
    }
}