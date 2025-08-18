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
        // Bonus points for completing level
        const bonus = this.level * 5;
        this.addScore(bonus);
        
        // Track time spent on this level
        this.timeSpentPerLevel.push(Date.now());
        
        // Check if it was a perfect round
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
        const timeSpent = (60 - this.timeLeft) / 60; // in minutes
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
        return 'Necesita Pr√°ctica';
    }
    
    getSessionData() {
        const endTime = new Date();
        const totalPlayTime = Math.round((endTime.getTime() - this.startTime.getTime()) / 1000);
        
        return {
            // Game identification
            game: 'letter-detective',
            version: '1.0.0',
            
            // Basic metrics
            score: this.score,
            level: this.level,
            timeSpent: 60 - this.timeLeft,
            totalPlayTime: totalPlayTime,
            
            // Accuracy metrics
            accuracy: this.getAccuracy(),
            correctAnswers: this.correctAnswers,
            incorrectAnswers: this.incorrectAnswers,
            lettersFound: this.lettersFound,
            
            // Performance metrics
            wpm: this.getWPM(),
            perfectRounds: this.perfectRounds,
            bestStreak: this.bestStreak,
            difficulty: this.getDifficulty(),
            performanceRating: this.getPerformanceRating(),
            
            // Detailed analysis
            livesLost: 3 - this.lives,
            averageTimePerLevel: this.getAverageTimePerLevel(),
            
            // Timestamps
            date: endTime.toISOString(),
            startTime: this.startTime.toISOString(),
            endTime: endTime.toISOString(),
            
            // Session context
            deviceType: this.getDeviceType(),
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            
            // Skills analysis (specific to dyslexia)
            visualDiscrimination: this.getVisualDiscriminationScore(),
            attentionSpan: this.getAttentionScore(),
            processingSpeed: this.getProcessingSpeedScore()
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
        // Based on accuracy with confusing letters (b/d, p/q)
        return Math.min(100, this.getAccuracy() + (this.perfectRounds * 5));
    }
    
    private getAttentionScore(): number {
        // Based on consistency and time management
        const timeEfficiency = (60 - this.timeLeft) / 60;
        const consistency = this.bestStreak / Math.max(1, this.level);
        return Math.round((timeEfficiency * 50) + (consistency * 50));
    }
    
    private getProcessingSpeedScore(): number {
        // Based on WPM and quick responses
        const speedScore = Math.min(100, this.getWPM() * 2);
        return speedScore;
    }
    
    endSession() {
        const sessionData = this.getSessionData();
        console.log('Ì≤æ Sesi√≥n detallada guardada:', sessionData);
        
        // Save to localStorage (later will be API)
        const existingSessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
        existingSessions.push(sessionData);
        
        // Keep only last 50 sessions to avoid localStorage overflow
        if (existingSessions.length > 50) {
            existingSessions.splice(0, existingSessions.length - 50);
        }
        
        localStorage.setItem('gameSessions', JSON.stringify(existingSessions));
        localStorage.setItem('lastGameSession', JSON.stringify(sessionData));
        
        // Also save aggregated stats
        this.updateAggregatedStats(sessionData);
        
        return sessionData;
    }
    
    private updateAggregatedStats(sessionData: any) {
        const stats = JSON.parse(localStorage.getItem('aggregatedStats') || '{}');
        
        // Initialize if first time
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
        
        // Update aggregated data
        ld.totalSessions++;
        ld.totalScore += sessionData.score;
        ld.totalTime += sessionData.timeSpent;
        ld.bestScore = Math.max(ld.bestScore, sessionData.score);
        ld.bestLevel = Math.max(ld.bestLevel, sessionData.level);
        ld.totalLettersFound += sessionData.lettersFound;
        
        // Calculate running average accuracy
        ld.averageAccuracy = Math.round(
            ((ld.averageAccuracy * (ld.totalSessions - 1)) + sessionData.accuracy) / ld.totalSessions
        );
        
        // Track skill progression over time
        ld.skillProgression.push({
            date: sessionData.date,
            accuracy: sessionData.accuracy,
            level: sessionData.level,
            visualDiscrimination: sessionData.visualDiscrimination,
            processingSpeed: sessionData.processingSpeed
        });
        
        // Keep only last 30 progression points
        if (ld.skillProgression.length > 30) {
            ld.skillProgression.splice(0, ld.skillProgression.length - 30);
        }
        
        localStorage.setItem('aggregatedStats', JSON.stringify(stats));
        console.log('Ì≥à Stats agregadas actualizadas:', stats);
    }
}
