import { BaseTower } from './BaseTower';
import type { TowerTypeConfig } from './BaseTower';
import type { BaseTDEnemy } from '../enemies/BaseTDEnemy';
import { safeAddSound } from '../utils';
import * as CONFIG from '../gameConfig.json';

export const TABBY_TOWER_CONFIG: TowerTypeConfig = {
  id: 'tabby',
  name: 'Spitfire Tabby',
  textureKey: 'cat_tabby',
  cost: CONFIG.towerStats.tabby.cost.value,
  damage: CONFIG.towerStats.tabby.damage.value,
  range: CONFIG.towerStats.tabby.range.value,
  fireRate: CONFIG.towerStats.tabby.fireRate.value,
  projectileKey: 'proj_mung',
  projectileSpeed: CONFIG.towerStats.tabby.projectileSpeed.value,
  targetingMode: 'first',
  upgrades: [
    { level: 2, cost: 60, damage: 18, range: 200, fireRate: 2.2 },
    { level: 3, cost: 90, damage: 25, range: 220, fireRate: 2.8 },
  ],
};

export class TowerTabby extends BaseTower {
  protected onFire(target: BaseTDEnemy): void {
    safeAddSound(this.scene, 'sfx_spit', { volume: 0.4 });
  }

  protected getRangeCircleColor(): number {
    return 0xffa500; // orange
  }
}
