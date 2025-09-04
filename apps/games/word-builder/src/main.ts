import "./styles.css";
import { Game } from 'phaser';
import { WordBuilderScene } from './scenes/WordBuilderScene';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';

// CRÍTICO: Hacer SweetAlert disponible globalmente
(window as any).Swal = Swal;

console.log('🔤 Iniciando Word Builder...');

let currentGame: Game | null = null;

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    const container = document.getElementById('game-container');
    if (!container) {
        console.error('⌚ No se encontró game-container');
        return;
    }

    // CRÍTICO: Cerrar cualquier modal antes de reiniciar
    if (Swal.isVisible()) {
        Swal.close();
    }

    // Clear any existing content
    container.innerHTML = '';

    const containerRect = container.getBoundingClientRect();
    const width = Math.floor(containerRect.width - 20);
    const height = Math.floor(containerRect.height - 20);

    console.log(`🔍 Dimensiones perfectas: ${width}x${height}`);

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
        scene: [WordBuilderScene],
        render: {
            antialias: true,
            pixelArt: false
        }
    };

    // Destroy existing game completely
    if (currentGame) {
        currentGame.destroy(true, false);
        currentGame = null;
        
        // Esperar a que se destruya completamente
        setTimeout(() => {
            createNewGame(config);
        }, 100);
    } else {
        createNewGame(config);
    }
}

function createNewGame(config: Phaser.Types.Core.GameConfig) {
    // Create new game
    currentGame = new Game(config);
    
    console.log('✅ Juego creado con dimensiones perfectas');

    // Global restart function
    (window as any).restartGame = function() {
        console.log('🔄 Reiniciando juego...');
        
        // Force close any SweetAlert modals
        if (Swal.isVisible()) {
            Swal.close();
        }
        
        confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10b981', '#34d399', '#6ee7b7']
        });
        
        setTimeout(() => {
            initGame();
        }, 500);
    };

    (window as any).game = currentGame;
}

if (document.readyState === 'loading') {
    console.log('⏳ Esperando DOM...');
} else {
    console.log('🚀 DOM listo, iniciando inmediatamente');
    initGame();
}