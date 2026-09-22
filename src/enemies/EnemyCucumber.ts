import Phaser from 'phaser';
import { BaseTDEnemy } from './BaseTDEnemy';
import type { TDEnemyConfig } from './BaseTDEnemy';
import { safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

const CUCUMBER_CONFIG: TDEnemyConfig = {
  textureKey: 'enemy_cucumber',
  displayHeight: 72,
  stats: {
    maxHealth: CONFIG.enemyStats.cucumber.maxHealth.value,
    speed: CONFIG.enemyStats.cucumber.speed.value,
    reward: CONFIG.enemyStats.cucumber.reward.value,
    damage: CONFIG.enemyStats.cucumber.damage.value,
  },
};

export class EnemyCucumber extends BaseTDEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, CUCUMBER_CONFIG);
  }

  protected onDamageTaken(damage: number): void {
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });
  }

  protected onDeath(): void {
    safeAddSound(this.scene, 'sfx_enemy_death', { volume: 0.5 });
  }
}
