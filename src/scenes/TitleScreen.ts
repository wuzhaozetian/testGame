import Phaser from "phaser";
import { LevelManager } from "../LevelManager.js";
import * as utils from "../utils.js";

/**
 * Title Screen Scene - Game start screen
 * This file is a STANDARD TEMPLATE
 * 
 * TODO for AI: Customize the following:
 * 1. createDOMUI() - Modify the HTML/CSS to match game theme
 * 2. initializeSounds() - Change background music key to your game's music
 * 3. startGame() - Change UI click sound key if needed
 */
export class TitleScreen extends Phaser.Scene {
  // UI elements
  public uiContainer!: Phaser.GameObjects.DOMElement;

  // Input controls - HTML event handlers
  public keydownHandler?: (event: KeyboardEvent) => void;
  public clickHandler?: (event: Event) => void;

  // Audio
  public backgroundMusic!: Phaser.Sound.BaseSound;

  // State flags
  public isStarting: boolean = false;

  constructor() {
    super({
      key: "TitleScreen",
    });
    this.isStarting = false;
  }

  init(): void {
    // Reset start flag
    this.isStarting = false;
  }

  create(): void {
    // Initialize sounds first
    this.initializeSounds();

    // Create background image (Phaser layer, behind DOM)
    this.createBackground();

    // Create DOM UI (text overlay on top of background)
    this.createDOMUI();

    // Set up input controls
    this.setupInputs();

    // Play background music
    this.playBackgroundMusic();

    // Listen for scene shutdown to cleanup event listeners
    this.events.once("shutdown", () => {
      this.cleanupEventListeners();
    });
  }

  /**
   * Create the title screen background using a Phaser image.
   * Uses title_bg from asset-pack (alias to living_room_bg.png).
   * Semi-transparent dark overlay for text contrast (matches kimi_uiHeavy_harryPotter).
   */
  createBackground(): void {
    const cam = this.cameras.main;
    const bgKey = 'title_bg';
    if (this.textures.exists(bgKey)) {
      const bg = this.add.image(cam.width / 2, cam.height / 2, bgKey);
      bg.setDisplaySize(cam.width, cam.height);
      bg.setDepth(0);
    }
  }

  /**
   * TODO: Customize this method to match your game's visual theme
   * - Change background image/color
   * - Change game title image or text
   * - Modify animations and styles
   */
  createDOMUI(): void {
    const uiHTML = `
      <div id="title-screen-container" class="fixed top-0 left-0 w-full h-full pointer-events-none z-[1000] font-retro flex flex-col justify-between items-center" style="image-rendering: pixelated; background-color: transparent;">

        <div class="flex flex-col items-center justify-between pt-10 pb-16 w-full text-center pointer-events-auto h-full relative z-10">

          <div id="game-title-container" class="flex-shrink-0 flex flex-col items-center justify-center" style="margin-top: 32px;">
            <div style="font-size:28px;font-weight:700;letter-spacing:0.35em;color:#FFAB00;text-shadow:0 0 14px rgba(255,171,0,0.5),2px 2px 0px #000;margin-bottom:8px;">HAJIMI DEFENSE</div>
            <div style="font-size:56px;font-weight:900;letter-spacing:-0.02em;color:#FFF;text-shadow:4px 4px 0px #000,6px 6px 0px rgba(0,0,0,0.5),0 0 30px rgba(255,255,255,0.15);line-height:1;">THE TUNA CRISIS</div>
          </div>

          <div class="flex-grow"></div>

          <div id="press-enter-text" style="font-size:36px;font-weight:700;color:#FFD700;letter-spacing:0.12em;text-shadow:0 0 8px rgba(255,215,0,0.5),3px 3px 0px #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;animation:arcadePulse 1s ease-in-out infinite;pointer-events:none;flex-shrink:0;user-select:none;">&#9654;&ensp;任意键开始&ensp;&#9664;</div>

        </div>

        <style>
          @keyframes arcadePulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(0.97); }
          }
        </style>
      </div>
    `;

    // Add DOM element to the scene - MUST use utils.initUIDom
    this.uiContainer = utils.initUIDom(this, uiHTML);
  }

  /**
   * Standard input setup - DO NOT MODIFY
   */
  setupInputs(): void {
    // Add HTML event listeners for keyboard and mouse events
    const handleStart = (event: Event) => {
      event.preventDefault();
      this.startGame();
    };

    // Listen for Enter and Space key events on the document
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        this.startGame();
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);

    // Add click event to the UI container
    if (this.uiContainer && this.uiContainer.node) {
      this.uiContainer.node.addEventListener("click", handleStart);
    }

    // Store event listeners for cleanup
    this.keydownHandler = handleKeyDown;
    this.clickHandler = handleStart;
  }

  /**
   * TODO: Change the music key to your game's title screen music
   */
  initializeSounds(): void {
    // TODO: Replace "title_screen_music" with your actual music asset key
    // this.backgroundMusic = this.sound.add("title_screen_music", {
    //   volume: 0.4,
    //   loop: true,
    // });
  }

  playBackgroundMusic(): void {
    // Play the initialized background music
    if (this.backgroundMusic) {
      this.backgroundMusic.play();
    }
  }

  /**
   * Standard game start logic - DO NOT MODIFY structure
   * TODO: Change "ui_click" to your actual UI click sound key
   */
  startGame(): void {
    // Prevent multiple triggers
    if (this.isStarting) return;
    this.isStarting = true;

    // Play click sound
    // TODO: Replace "ui_click" with your actual sound asset key
    // this.sound.play("ui_click", { volume: 0.3 });

    // Clean up event listeners
    this.cleanupEventListeners();

    // Stop background music
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }

    // Add transition effect
    this.cameras.main.fadeOut(500, 0, 0, 0);

    // Start first level after delay
    this.time.delayedCall(500, () => {
      const firstLevelScene = LevelManager.getFirstLevelScene();
      if (firstLevelScene) {
        this.scene.start(firstLevelScene);
      } else {
        console.error("No first level scene found in LEVEL_ORDER");
      }
    });
  }

  /**
   * Standard cleanup - DO NOT MODIFY
   */
  cleanupEventListeners(): void {
    // Remove HTML event listeners
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
    }

    if (this.clickHandler && this.uiContainer && this.uiContainer.node) {
      this.uiContainer.node.removeEventListener("click", this.clickHandler);
    }
  }

  update(): void {
    // Title screen doesn't need special update logic
  }
}
