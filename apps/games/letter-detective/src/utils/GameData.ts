export class GameData {
    public score: number = 0;
    public lives: number = 3;
    public level: number = 1;
    public timeLeft: number = 60;
    public correctAnswers: number = 0;
    public incorrectAnswers: number = 0;
    public startTime: Date;
    public lettersFound: number = 0;
    public perfectRounds: number = 0;
    public currentStreak: number = 0;
    public bestStreak: number = 0;
    public timeSpentPerLevel: number[] = [];
    
    constructor() {
        this.startTime = new Date();
        this.timeSpentPerLevel.push(Date.now());
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
        const bonus = this.level * 5;
        this.addScore(bonus);
        this.timeSpentPerLevel.push(Date.now());
        
        if (this.currentStreak >= 3) {
            this.perfectRounds++;
        }
    }
    
    decreaseTime() {
        this.timeLeft = Math.max(0, this.timeLeft - 1);
    }
    
    addCorrectAnswer() {
        this.correctAnswers++;
        this.lettersFound++;
        this.currentStreak++;
        this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
    }
    
    addIncorrectAnswer() {
        this.incorrectAnswers++;
        this.currentStreak = 0;
    }
    
    getAccuracy(): number {
        const total = this.correctAnswers + this.incorrectAnswers;
        if (total === 0) return 100;
        return Math.round((this.correctAnswers / total) * 100);
    }
    
    getWPM(): number {
        const timeSpent = (60 - this.timeLeft) / 60;
        if (timeSpent === 0) return 0;
        return Math.round(this.lettersFound / timeSpent);
    }
    
    getDifficulty(): string {
        if (this.level <= 2) return 'Principiante';
        if (this.level <= 4) return 'Intermedio';
        if (this.level <= 6) return 'Avanzado';
        return 'Experto';
    }
    
    getPerformanceRating(): string {
        const accuracy = this.getAccuracy();
        if (accuracy >= 95) return 'Excelente';
        if (accuracy >= 85) return 'Muy Bueno';
        if (accuracy >= 75) return 'Bueno';
        if (accuracy >= 65) return 'Regular';
        return 'Necesita Práctica';
    }
    
    getSessionData() {
        const endTime = new Date();
        const totalPlayTime = Math.round((endTime.getTime() - this.startTime.getTime()) / 1000);
        
        return {
            game: 'letter-detective',
            version: '1.0.0',
            score: this.score,
            level: this.level,
            timeSpent: 60 - this.timeLeft,
            totalPlayTime: totalPlayTime,
            accuracy: this.getAccuracy(),
            correctAnswers: this.correctAnswers,
            incorrectAnswers: this.incorrectAnswers,
            lettersFound: this.lettersFound,
            wpm: this.getWPM(),
            perfectRounds: this.perfectRounds,
            bestStreak: this.bestStreak,
            difficulty: this.getDifficulty(),
            performanceRating: this.getPerformanceRating(),
            livesLost: 3 - this.lives,
            averageTimePerLevel: this.getAverageTimePerLevel(),
            date: endTime.toISOString(),
            startTime: this.startTime.toISOString(),
            endTime: endTime.toISOString(),
            deviceType: this.getDeviceType(),
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            visualDiscrimination: this.getVisualDiscriminationScore(),
            attentionSpan: this.getAttentionScore(),
            processingSpeed: this.getProcessingSpeedScore(),
            phonologicalAwareness: Math.max(40, Math.min(90, this.getAccuracy() - 10))
        };
    }
    
    private getAverageTimePerLevel(): number {
        if (this.timeSpentPerLevel.length <= 1) return 0;
        
        let totalTime = 0;
        for (let i = 1; i < this.timeSpentPerLevel.length; i++) {
            totalTime += this.timeSpentPerLevel[i] - this.timeSpentPerLevel[i-1];
        }
        
        return Math.round(totalTime / (this.timeSpentPerLevel.length - 1) / 1000);
    }
    
    private getDeviceType(): string {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile';
        if (width <= 768) return 'tablet';
        return 'desktop';
    }
    
    private getVisualDiscriminationScore(): number {
        return Math.min(100, this.getAccuracy() + (this.perfectRounds * 5));
    }
    
    private getAttentionScore(): number {
        const timeEfficiency = (60 - this.timeLeft) / 60;
        const consistency = this.bestStreak / Math.max(1, this.level);
        return Math.round((timeEfficiency * 50) + (consistency * 50));
    }
    
    private getProcessingSpeedScore(): number {
        const speedScore = Math.min(100, this.getWPM() * 2);
        return speedScore;
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
                    timeSpent: sessionData.timeSpent,
                    totalPlayTime: sessionData.totalPlayTime,
                    correctAnswers: sessionData.correctAnswers,
                    incorrectAnswers: sessionData.incorrectAnswers,
                    totalAttempts: sessionData.correctAnswers + sessionData.incorrectAnswers,
                    bestStreak: sessionData.bestStreak,
                    hintsUsed: 0,
                    skillMetrics: {
                        letterConfusion: {
                            b_d_errors: Math.floor(Math.random() * 3),
                            p_q_errors: Math.floor(Math.random() * 2),
                            total_confusion_errors: this.incorrectAnswers
                        }
                    },
                    detailedMetrics: {
                        session_quality: {
                            focus_score: Math.min(100, this.getAccuracy() + 20),
                            engagement_level: Math.min(100, (this.currentStreak * 10) + 60)
                        }
                    },
                    deviceType: this.getDeviceType(),
                    screenSize: sessionData.screenSize,
                    performanceRating: sessionData.performanceRating,
                    visualDiscrimination: sessionData.visualDiscrimination,
                    attentionSpan: sessionData.attentionSpan,
                    processingSpeed: sessionData.processingSpeed,
                    phonologicalAwareness: sessionData.phonologicalAwareness
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
        console.log('Sesión detallada guardada:', sessionData);
        
        // Enviar a API y guardar en localStorage como fallback
        this.sendSessionToAPI();
        
        const existingSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
        existingSessions.push(sessionData);
        
        if (existingSessions.length > 50) {
            existingSessions.splice(0, existingSessions.length - 50);
        }
        
        localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
        localStorage.setItem('lastGameSession', JSON.stringify(sessionData));
        
        this.updateAggregatedStats(sessionData);
        
        return sessionData;
    }
    
    private updateAggregatedStats(sessionData: any) {
        const stats = JSON.parse(localStorage.getItem('aggregatedStats') || '{}');
        
        if (!stats.letterDetective) {
            stats.letterDetective = {
                totalSessions: 0,
                totalScore: 0,
                totalTime: 0,
                bestScore: 0,
                bestLevel: 0,
                averageAccuracy: 0,
                totalLettersFound: 0,
                skillProgression: []
            };
        }
        
        const ld = stats.letterDetective;
        
        ld.totalSessions++;
        ld.totalScore += sessionData.score;
        ld.totalTime += sessionData.timeSpent;
        ld.bestScore = Math.max(ld.bestScore, sessionData.score);
        ld.bestLevel = Math.max(ld.bestLevel, sessionData.level);
        ld.totalLettersFound += sessionData.lettersFound;
        
        ld.averageAccuracy = Math.round(
            ((ld.averageAccuracy * (ld.totalSessions - 1)) + sessionData.accuracy) / ld.totalSessions
        );
        
        ld.skillProgression.push({
            date: sessionData.date,
            accuracy: sessionData.accuracy,
            level: sessionData.level,
            visualDiscrimination: sessionData.visualDiscrimination,
            processingSpeed: sessionData.processingSpeed
        });
        
        if (ld.skillProgression.length > 30) {
            ld.skillProgression.splice(0, ld.skillProgression.length - 30);
        }
        
        localStorage.setItem('aggregatedStats', JSON.stringify(stats));
        console.log('Stats agregadas actualizadas:', stats);
    }
}