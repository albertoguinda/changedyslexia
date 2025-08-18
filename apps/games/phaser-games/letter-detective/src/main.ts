import { Game } from 'phaser';
import { LetterDetectiveScene } from './scenes/LetterDetectiveScene';
import confetti from 'canvas-confetti';

console.log('ÌæÆ Iniciando Letter Detective...');

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    const container = document.getElementById('game-container');
    if (!container) {
        console.error('‚ùå No se encontr√≥ game-container');
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Calculate perfect dimensions that fill the container
    const containerRect = container.getBoundingClientRect();
    
    // Use full container size with small padding
    const width = Math.floor(containerRect.width - 20);
    const height = Math.floor(containerRect.height - 20);

    console.log(`Ì≥ê Dimensiones perfectas: ${width}x${height}`);

    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: width,
        height: height,
        parent: 'game-container',
        backgroundColor: 'transparent',
        scale: {
            mode: Phaser.Scale.NONE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [LetterDetectiveScene],
        render: {
            antialias: true,
            pixelArt: false
        }
    };

    // Create game
    const game = new Game(config);
    
    console.log('‚úÖ Juego creado con dimensiones perfectas');

    // Global restart function
    (window as any).restartGame = function() {
        console.log('Ì¥Ñ Reiniciando juego...');
        
        if (game) {
            game.destroy(true);
        }
        
        // Gentle restart confetti
        confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#a78bfa', '#f472b6', '#60a5fa']
        });
        
        setTimeout(() => {
            initGame();
        }, 400);
    };

    // Handle window resize
    window.addEventListener('resize', () => {
        // Debounce resize
        clearTimeout((window as any).resizeTimeout);
        (window as any).resizeTimeout = setTimeout(() => {
            console.log('Ì≥± Redimensionando...');
            (window as any).restartGame();
        }, 300);
    });

    (window as any).game = game;
}

// Fallback initialization
if (document.readyState === 'loading') {
    console.log('‚è≥ Esperando DOM...');
} else {
    console.log('Ì∫Ä DOM listo, iniciando inmediatamente');
    initGame();
}
