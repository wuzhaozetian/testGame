import Phaser from 'phaser';
import * as utils from '../utils';

/**
 * Game Over UI Scene - Death/Failure Screen
 * This file is a STANDARD TEMPLATE
 * 
 * Displayed when player dies or fails the level
 * Restarts current level on Enter/Space/Click
 * 
 * TODO for AI: Customize createDOMUI() to match game theme
 */
export class GameOverUIScene extends Phaser.Scene {
  private currentLevelKey: string | null;
  private isRestarting: boolean;
  private uiContainer: Phaser.GameObjects.DOMElement | null;
  private enterKey?: Phaser.Input.Keyboard.Key;
  private spaceKey?: Phaser.Input.Keyboard.Key;

  constructor() {
    super({
      key: "GameOverUIScene",
    });
    this.currentLevelKey = null;
    this.isRestarting = false;
    this.uiContainer = null;
  }

  /**
   * Receive current level key from game scene
   */
  init(data: { currentLevelKey?: string }) {
    this.currentLevelKey = data.currentLevelKey || "Level1";
    // Reset restart flag
    this.isRestarting = false;
  }

  create(): void {
    // Create DOM UI
    this.createDOMUI();
    // Setup input controls
    this.setupInputs();
  }

  /**
   * TODO: Customize the game over screen appearance
   * Keep the overall structure but modify:
   * - Colors and styles (typically red/dark theme)
   * - Animations
   * - Text content
   */
  createDOMUI(): void {
    const uiHTML = `
      <div id="game-over-container" class="fixed top-0 left-0 w-full h-full pointer-events-none z-[1000] font-retro flex flex-col justify-center items-center" style="background-color: rgba(51, 0, 0, 0.8);">
        <!-- Main Content Container -->
        <div class="flex flex-col items-center justify-center gap-16 p-8 text-center pointer-events-auto">
          
          <!-- Game Over Title -->
          <div id="game-over-title" class="text-red-500 font-bold pointer-events-none" style="
            font-size: clamp(56px, 8rem, 80px);
            text-shadow: 4px 4px 0px #000000;
            animation: dangerBlink 0.5s ease-in-out infinite alternate;
          ">GAME OVER</div>

          <!-- Failure Text -->
          <div id="failure-text" class="text-white font-bold pointer-events-none" style="
            font-size: clamp(24px, 3rem, 36px);
            text-shadow: 2px 2px 0px #000000;
            line-height: 1.4;
          ">Better luck next time!</div>

          <!-- Press Enter Text -->
          <div id="press-enter-text" class="text-yellow-400 font-bold pointer-events-none animate-pulse" style="
            font-size: clamp(24px, 3rem, 36px);
            text-shadow: 3px 3px 0px #000000;
            animation: blink 0.8s ease-in-out infinite alternate;
          ">PRESS ENTER TO RESTART</div>

        </div>

        <!-- Custom Animations -->
        <style>
          @keyframes dangerBlink {
            from { 
              opacity: 0.5; 
              filter: brightness(1);
            }
            to { 
              opacity: 1; 
              filter: brightness(1.2);
            }
          }
          
          @keyframes blink {
            from { opacity: 0.3; }
            to { opacity: 1; }
          }
        </style>
      </div>
    `;

    // Add DOM element to scene - MUST use utils.initUIDom
    this.uiContainer = utils.initUIDom(this, uiHTML);
  }

  /**
   * Standard input setup - DO NOT MODIFY
   */
  setupInputs(): void {
    // Clear previous event listeners
    this.input.off('pointerdown');
    
    // Create keyboard input
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Listen for mouse click events
    this.input.on('pointerdown', () => this.restartGame());

    // Listen for key events
    this.enterKey.on('down', () => this.restartGame());
    this.spaceKey.on('down', () => this.restartGame());
  }

  /**
   * Restart current level - DO NOT MODIFY structure
   */
  restartGame(): void {
    // Prevent multiple triggers
    if (this.isRestarting) return;
    this.isRestarting = true;

    console.log(`Restarting current level: ${this.currentLevelKey}`);

    // Stop current level's background music
    const currentScene = this.scene.get(this.currentLevelKey!) as any;
    if (currentScene?.backgroundMusic) {
      currentScene.backgroundMusic.stop();
    }

    // Clear event listeners
    this.input.off('pointerdown');
    if (this.enterKey) {
      this.enterKey.off('down');
    }
    if (this.spaceKey) {
      this.spaceKey.off('down');
    }

    // Stop all game-related scenes
    this.scene.stop("UIScene");
    this.scene.stop(this.currentLevelKey!);
    
    // Restart current level
    this.scene.start(this.currentLevelKey!);

    // Stop this GameOver scene itself (its DOM overlay blocks input)
    this.scene.stop();
  }

  update(): void {
    // Game Over UI scene doesn't need special update logic
  }
}
