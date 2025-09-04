export class WordsData {
    private static words = [
    // NIVEL 1 - 2 sílabas (20 palabras)
    { text: "CASA", syllables: ["CA", "SA"], emoji: "🏠", level: 1 },
    { text: "MESA", syllables: ["ME", "SA"], emoji: "🪑", level: 1 },
    { text: "GATO", syllables: ["GA", "TO"], emoji: "🐱", level: 1 },
    { text: "LIBRO", syllables: ["LI", "BRO"], emoji: "📖", level: 1 },
    { text: "PERRO", syllables: ["PE", "RRO"], emoji: "🐶", level: 1 },
    { text: "LUNA", syllables: ["LU", "NA"], emoji: "🌙", level: 1 },
    { text: "AGUA", syllables: ["A", "GUA"], emoji: "💧", level: 1 },
    { text: "FUEGO", syllables: ["FUE", "GO"], emoji: "🔥", level: 1 },
    { text: "FLOR", syllables: ["FLOR"], emoji: "🌸", level: 1 },
    { text: "NUBE", syllables: ["NU", "BE"], emoji: "☁️", level: 1 },
    { text: "PATO", syllables: ["PA", "TO"], emoji: "🦆", level: 1 },
    { text: "COCHE", syllables: ["CO", "CHE"], emoji: "🚗", level: 1 },
    { text: "ÁRBOL", syllables: ["ÁR", "BOL"], emoji: "🌳", level: 1 },
    { text: "RATÓN", syllables: ["RA", "TÓN"], emoji: "🐭", level: 1 },
    { text: "PLATO", syllables: ["PLA", "TO"], emoji: "🍽️", level: 1 },
    { text: "SOL", syllables: ["SOL"], emoji: "☀️", level: 1 },
    { text: "PAN", syllables: ["PAN"], emoji: "🍞", level: 1 },
    { text: "OSO", syllables: ["O", "SO"], emoji: "🐻", level: 1 },
    { text: "MANO", syllables: ["MA", "NO"], emoji: "✋", level: 1 },
    { text: "DADO", syllables: ["DA", "DO"], emoji: "🎲", level: 1 },
    
    // NIVEL 2 - 3 sílabas (20 palabras)
    { text: "PELOTA", syllables: ["PE", "LO", "TA"], emoji: "⚽", level: 2 },
    { text: "CAMISA", syllables: ["CA", "MI", "SA"], emoji: "👕", level: 2 },
    { text: "VENTANA", syllables: ["VEN", "TA", "NA"], emoji: "🪟", level: 2 },
    { text: "PLÁTANO", syllables: ["PLÁ", "TA", "NO"], emoji: "🍌", level: 2 },
    { text: "CABALLO", syllables: ["CA", "BA", "LLO"], emoji: "🐴", level: 2 },
    { text: "TORTUGA", syllables: ["TOR", "TU", "GA"], emoji: "🐢", level: 2 },
    { text: "PALOMA", syllables: ["PA", "LO", "MA"], emoji: "🕊️", level: 2 },
    { text: "CORONA", syllables: ["CO", "RO", "NA"], emoji: "👑", level: 2 },
    { text: "HELADO", syllables: ["HE", "LA", "DO"], emoji: "🍦", level: 2 },
    { text: "ZAPATO", syllables: ["ZA", "PA", "TO"], emoji: "👟", level: 2 },
    { text: "GALLETA", syllables: ["GA", "LLE", "TA"], emoji: "🍪", level: 2 },
    { text: "NARANJA", syllables: ["NA", "RAN", "JA"], emoji: "🍊", level: 2 },
    { text: "MANZANA", syllables: ["MAN", "ZA", "NA"], emoji: "🍎", level: 2 },
    { text: "GUITARRA", syllables: ["GUI", "TA", "RRA"], emoji: "🎸", level: 2 },
    { text: "TELÉFONO", syllables: ["TE", "LÉ", "FO", "NO"], emoji: "📞", level: 2 },
    { text: "TOMATE", syllables: ["TO", "MA", "TE"], emoji: "🍅", level: 2 },
    { text: "CEBOLLA", syllables: ["CE", "BO", "LLA"], emoji: "🧅", level: 2 },
    { text: "AVIÓN", syllables: ["A", "VIÓN"], emoji: "✈️", level: 2 },
    { text: "CAMIÓN", syllables: ["CA", "MIÓN"], emoji: "🚛", level: 2 },
    { text: "RELOJ", syllables: ["RE", "LOJ"], emoji: "⏰", level: 2 },
    
    // NIVEL 3 - 4 sílabas (15 palabras)
    { text: "MARIPOSA", syllables: ["MA", "RI", "PO", "SA"], emoji: "🦋", level: 3 },
    { text: "ELEFANTE", syllables: ["E", "LE", "FAN", "TE"], emoji: "🐘", level: 3 },
    { text: "PIRÁMIDE", syllables: ["PI", "RÁ", "MI", "DE"], emoji: "🔺", level: 3 },
    { text: "MEDICINA", syllables: ["ME", "DI", "CI", "NA"], emoji: "💊", level: 3 },
    { text: "HOSPITAL", syllables: ["HOS", "PI", "TAL"], emoji: "🏥", level: 3 },
    { text: "BIBLIOTECA", syllables: ["BI", "BLIO", "TE", "CA"], emoji: "📚", level: 3 },
    { text: "FOTOGRAFÍA", syllables: ["FO", "TO", "GRA", "FÍA"], emoji: "📸", level: 3 },
    { text: "DINOSAURIO", syllables: ["DI", "NO", "SAU", "RIO"], emoji: "🦕", level: 3 },
    { text: "HELICÓPTERO", syllables: ["HE", "LI", "CÓP", "TE", "RO"], emoji: "🚁", level: 3 },
    { text: "MICROSCOPIO", syllables: ["MI", "CROS", "CO", "PIO"], emoji: "🔬", level: 3 },
    { text: "ESCALERA", syllables: ["ES", "CA", "LE", "RA"], emoji: "🪜", level: 3 },
    { text: "PARAGUAS", syllables: ["PA", "RA", "GUAS"], emoji: "☂️", level: 3 },
    { text: "SEMÁFORO", syllables: ["SE", "MÁ", "FO", "RO"], emoji: "🚦", level: 3 },
    { text: "LAVADORA", syllables: ["LA", "VA", "DO", "RA"], emoji: "🧺", level: 3 },
    { text: "SUBMARINO", syllables: ["SUB", "MA", "RI", "NO"], emoji: "🚤", level: 3 },
    
    // NIVEL 4 - 5+ sílabas (12 palabras)
    { text: "BICICLETA", syllables: ["BI", "CI", "CLE", "TA"], emoji: "🚲", level: 4 },
    { text: "TELEVISIÓN", syllables: ["TE", "LE", "VI", "SIÓN"], emoji: "📺", level: 4 },
    { text: "AMBULANCIA", syllables: ["AM", "BU", "LAN", "CIA"], emoji: "🚑", level: 4 },
    { text: "ESCUELA", syllables: ["ES", "CUE", "LA"], emoji: "🎓", level: 4 },
    { text: "SUPERMERCADO", syllables: ["SU", "PER", "MER", "CA", "DO"], emoji: "🛒", level: 4 },
    { text: "COMPUTADORA", syllables: ["COM", "PU", "TA", "DO", "RA"], emoji: "💻", level: 4 },
    { text: "BOMBERO", syllables: ["BOM", "BE", "RO"], emoji: "🚒", level: 4 },
    { text: "ELECTRICIDAD", syllables: ["E", "LEC", "TRI", "CI", "DAD"], emoji: "⚡", level: 4 },
    { text: "CONSTRUCCIÓN", syllables: ["CONS", "TRUC", "CIÓN"], emoji: "🏗️", level: 4 },
    { text: "REFRIGERADOR", syllables: ["RE", "FRI", "GE", "RA", "DOR"], emoji: "🧊", level: 4 },
    { text: "ASTRONAUTA", syllables: ["AS", "TRO", "NAU", "TA"], emoji: "👨‍🚀", level: 4 },
    { text: "FARMACIA", syllables: ["FAR", "MA", "CIA"], emoji: "💉", level: 4 }
    ];

    static getWordsForLevel(level: number) {
        return [...this.words.filter(word => word.level === level)];
    }

    static getAvailableWords(level: number, usedWords: any[]) {
        return this.words.filter(word => 
            word.level === level && 
            !usedWords.some(used => used.text === word.text)
        );
    }

    static getRandomWordForLevel(level: number, usedWords: any[] = []) {
        const available = this.getAvailableWords(level, usedWords);
        if (available.length === 0) {
            return null;
        }
        return available[Math.floor(Math.random() * available.length)];
    }
}