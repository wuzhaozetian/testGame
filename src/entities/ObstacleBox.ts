import Phaser from 'phaser';
import { BaseObstacle } from './BaseObstacle';
import type { ObstacleConfig } from './BaseObstacle';
import { safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

const BOX_CONFIG: ObstacleConfig = {
  textureKey: 'obstacle_box',
  displayHeight: 128,
  maxHealth: CONFIG.obstacleStats.box.maxHealth.value,
  reward: CONFIG.obstacleStats.box.reward.value,
};

export class ObstacleBox extends BaseObstacle {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, BOX_CONFIG);
  }

  protected onClicked(): void {
    safeAddSound(this.scene, 'sfx_bonk', { volume: 0.5 });
  }

  protected onDamaged(remainingHealth: number): void {
    // Visual feedback already handled by base class
  }

  protected onDestroyed(): void {
    safeAddSound(this.scene, 'sfx_break', { volume: 0.6 });
  }
}
