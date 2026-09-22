import Phaser from 'phaser';
import { BaseTower } from './BaseTower';
import type { TowerTypeConfig } from './BaseTower';
import type { BaseTDEnemy } from '../enemies/BaseTDEnemy';
import { createProjectile, safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

export const CHONKY_TOWER_CONFIG: TowerTypeConfig = {
  id: 'chonky',
  name: 'Chonky Orange',
  textureKey: 'cat_fat',
  cost: CONFIG.towerStats.chonky.cost.value,
  damage: CONFIG.towerStats.chonky.damage.value,
  range: CONFIG.towerStats.chonky.range.value,
  fireRate: CONFIG.towerStats.chonky.fireRate.value,
  projectileKey: 'proj_bun',
  projectileSpeed: CONFIG.towerStats.chonky.projectileSpeed.value,
  targetingMode: 'closest',
  upgrades: [
    { level: 2, cost: 150, damage: 45, range: 160, fireRate: 0.9 },
    { level: 3, cost: 225, damage: 65, range: 180, fireRate: 1.1 },
  ],
};

export class TowerChonky extends BaseTower {
  protected createProjectile(target: BaseTDEnemy): Phaser.Physics.Arcade.Sprite | null {
    const proj = super.createProjectile(target);
    if (proj) {
      (proj as any).splashRadius = CONFIG.towerStats.chonky.splashRadius.value;
    }
    return proj;
  }

  protected onFire(target: BaseTDEnemy): void {
    safeAddSound(this.scene, 'sfx_spit', { volume: 0.4 });
  }

  protected getRangeCircleColor(): number {
    return 0xff4444; // red
  }
}
