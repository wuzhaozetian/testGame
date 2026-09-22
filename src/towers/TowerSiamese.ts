import { BaseTower } from './BaseTower';
import type { TowerTypeConfig } from './BaseTower';
import type { BaseTDEnemy } from '../enemies/BaseTDEnemy';
import { safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

export const SIAMESE_TOWER_CONFIG: TowerTypeConfig = {
  id: 'siamese',
  name: 'Sniper Siamese',
  textureKey: 'cat_siamese',
  cost: CONFIG.towerStats.siamese.cost.value,
  damage: CONFIG.towerStats.siamese.damage.value,
  range: CONFIG.towerStats.siamese.range.value,
  fireRate: CONFIG.towerStats.siamese.fireRate.value,
  projectileKey: 'proj_bone',
  projectileSpeed: CONFIG.towerStats.siamese.projectileSpeed.value,
  homing: true,
  targetingMode: 'strongest',
  upgrades: [
    { level: 2, cost: 120, damage: 65, range: 360, fireRate: 0.6 },
    { level: 3, cost: 180, damage: 90, range: 400, fireRate: 0.7 },
  ],
};

export class TowerSiamese extends BaseTower {
  protected onFire(target: BaseTDEnemy): void {
    safeAddSound(this.scene, 'sfx_spit', { volume: 0.4 });
  }

  protected getRangeCircleColor(): number {
    return 0x4488ff; // blue
  }
}
