import Phaser from 'phaser';
import { BaseTDEnemy } from './BaseTDEnemy';
import type { TDEnemyConfig } from './BaseTDEnemy';
import { safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

const VACUUM_CONFIG: TDEnemyConfig = {
  textureKey: 'enemy_vacuum',
  displayHeight: 96,
  stats: {
    maxHealth: CONFIG.enemyStats.vacuum.maxHealth.value,
    speed: CONFIG.enemyStats.vacuum.speed.value,
    reward: CONFIG.enemyStats.vacuum.reward.value,
    damage: CONFIG.enemyStats.vacuum.damage.value,
  },
};

export class EnemyVacuum extends BaseTDEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, VACUUM_CONFIG);
  }

  protected onDamageTaken(damage: number): void {
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });
  }

  protected onDeath(): void {
    safeAddSound(this.scene, 'sfx_enemy_death', { volume: 0.6 });
  }
}
