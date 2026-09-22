import Phaser from 'phaser';
import { BaseTDEnemy } from './BaseTDEnemy';
import type { TDEnemyConfig } from './BaseTDEnemy';
import { safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

const DUST_CONFIG: TDEnemyConfig = {
  textureKey: 'enemy_dust',
  displayHeight: 60,
  stats: {
    maxHealth: CONFIG.enemyStats.dust.maxHealth.value,
    speed: CONFIG.enemyStats.dust.speed.value,
    reward: CONFIG.enemyStats.dust.reward.value,
    damage: CONFIG.enemyStats.dust.damage.value,
  },
};

export class EnemyDust extends BaseTDEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, DUST_CONFIG);
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
