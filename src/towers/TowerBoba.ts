import Phaser from 'phaser';
import { BaseTower } from './BaseTower';
import type { TowerTypeConfig } from './BaseTower';
import type { BaseTDEnemy } from '../enemies/BaseTDEnemy';
import { createProjectile, safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

export const BOBA_TOWER_CONFIG: TowerTypeConfig = {
  id: 'boba',
  name: 'Boba Calico',
  textureKey: 'cat_calico',
  cost: CONFIG.towerStats.boba.cost.value,
  damage: CONFIG.towerStats.boba.damage.value,
  range: CONFIG.towerStats.boba.range.value,
  fireRate: CONFIG.towerStats.boba.fireRate.value,
  projectileKey: 'proj_boba',
  projectileSpeed: CONFIG.towerStats.boba.projectileSpeed.value,
  targetingMode: 'first',
  upgrades: [
    { level: 2, cost: 90, damage: 12, range: 180, fireRate: 1.5 },
    { level: 3, cost: 135, damage: 18, range: 200, fireRate: 1.8 },
  ],
};

export class TowerBoba extends BaseTower {
  protected createProjectile(target: BaseTDEnemy): Phaser.Physics.Arcade.Sprite | null {
    const proj = super.createProjectile(target);
    if (proj) {
      (proj as any).slowAmount = CONFIG.towerStats.boba.slowAmount.value;
      (proj as any).slowDuration = CONFIG.towerStats.boba.slowDuration.value;
    }
    return proj;
  }

  protected onFire(target: BaseTDEnemy): void {
    safeAddSound(this.scene, 'sfx_spit', { volume: 0.4 });
  }

  protected getRangeCircleColor(): number {
    return 0xaa44ff; // purple
  }
}
