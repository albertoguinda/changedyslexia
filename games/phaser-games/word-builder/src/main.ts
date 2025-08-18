import { Game, Types } from 'phaser';
import { WordBuilderScene } from './scenes/WordBuilderScene';

// ConfiguraciÃ³n optimizada para Word Builder
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [WordBuilderScene]
};

// Inicializar juego
const game = new Game(config);

// FunciÃ³n global para reiniciar
(window as any).restartGame = () => {
    game.scene.restart('WordBuilderScene');
};

// Log de inicio
console.log('í¿—ï¸ Word Builder iniciado correctamente');
