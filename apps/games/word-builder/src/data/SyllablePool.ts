export class SyllablePool {
    private static readonly pool = [
        "CA", "CO", "CU", "CE", "CI", "QUE", "QUI",
        "GA", "GO", "GU", "GUE", "GUI", "JA", "JE", "JI", "JO", "JU",
        "BA", "BE", "BI", "BO", "BU", "VA", "VE", "VI", "VO", "VU",
        "DA", "DE", "DI", "DO", "DU", "TA", "TE", "TI", "TO", "TU",
        "PA", "PE", "PI", "PO", "PU", "FA", "FE", "FI", "FO", "FU",
        "MA", "ME", "MI", "MO", "MU", "NA", "NE", "NI", "NO", "NU",
        "LA", "LE", "LI", "LO", "LU", "RA", "RE", "RI", "RO", "RU",
        "SA", "SE", "SI", "SO", "SU", "ZA", "ZE", "ZI", "ZO", "ZU",
        "CHA", "CHE", "CHI", "CHO", "CHU",
        "LLA", "LLE", "LLI", "LLO", "LLU",
        "ÑA", "ÑE", "ÑI", "ÑO", "ÑU",
        "RRA", "RRE", "RRI", "RRO", "RRU",
        "BRA", "BRE", "BRI", "BRO", "BRU",
        "BLA", "BLE", "BLI", "BLO", "BLU",
        "CRA", "CRE", "CRI", "CRO", "CRU",
        "CLA", "CLE", "CLI", "CLO", "CLU",
        "DRA", "DRE", "DRI", "DRO", "DRU",
        "FRA", "FRE", "FRI", "FRO", "FRU",
        "FLA", "FLE", "FLI", "FLO", "FLU",
        "GRA", "GRE", "GRI", "GRO", "GRU",
        "PRA", "PRE", "PRI", "PRO", "PRU",
        "PLA", "PLE", "PLI", "PLO", "PLU",
        "TRA", "TRE", "TRI", "TRO", "TRU", "PLÁ"
    ];

    static generateDistractors(correctSyllables: string[], level: number): string[] {
        const numDistractors = Math.min(level + 2, 6);
        const distractors = this.getRandomSyllables(correctSyllables, numDistractors);
        const allSyllables = [...correctSyllables, ...distractors];
        
        // Shuffle array
        for (let i = allSyllables.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allSyllables[i], allSyllables[j]] = [allSyllables[j], allSyllables[i]];
        }
        
        return allSyllables;
    }

    private static getRandomSyllables(exclude: string[], count: number): string[] {
        const available = this.pool.filter(syllable => !exclude.includes(syllable));
        const selected: string[] = [];
        
        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            const syllable = available.splice(randomIndex, 1)[0];
            selected.push(syllable);
        }
        
        return selected;
    }
}