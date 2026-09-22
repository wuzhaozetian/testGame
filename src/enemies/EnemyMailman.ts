import Phaser from 'phaser';
import { BaseTDEnemy } from './BaseTDEnemy';
import type { TDEnemyConfig } from './BaseTDEnemy';
import { safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

const MAILMAN_CONFIG: TDEnemyConfig = {
  textureKey: 'enemy_mailman',
  displayHeight: 140,
  stats: {
    maxHealth: CONFIG.enemyStats.mailman.maxHealth.value,
    speed: CONFIG.enemyStats.mailman.speed.value,
    reward: CONFIG.enemyStats.mailman.reward.value,
    damage: CONFIG.enemyStats.mailman.damage.value,
  },
};

export class EnemyMailman extends BaseTDEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, MAILMAN_CONFIG);
  }

  protected onDamageTaken(damage: number): void {
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });
    // Light screen shake for the boss
    this.scene.cameras.main.shake(100, 0.003);
  }

  protected onDeath(): void {
    safeAddSound(this.scene, 'sfx_enemy_death', { volume: 0.8 });
  }
}
