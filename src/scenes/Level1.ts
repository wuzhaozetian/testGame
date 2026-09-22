import Phaser from 'phaser';
import { BaseTDScene } from './BaseTDScene';
import type { GridConfig, PathPoint } from './BaseTDScene';
import type { TowerTypeConfig } from '../towers/BaseTower';
import type { WaveDefinition } from '../systems/WaveManager';
import {
  CellType,
  textureExists,
  drawPathLine,
  drawTowerSlots,
  showFloatingText,
  worldToGrid,
  safeAddSound,
  gridToWorld,
} from '../utils';
import { BaseTDEnemy } from '../enemies/BaseTDEnemy';
import type { BaseTower } from '../towers/BaseTower';
import type { BaseObstacle } from '../entities/BaseObstacle';
import * as CONFIG from '../gameConfig.json';

// Tower configs
import { TABBY_TOWER_CONFIG, TowerTabby } from '../towers/TowerTabby';
import { SIAMESE_TOWER_CONFIG, TowerSiamese } from '../towers/TowerSiamese';
import { CHONKY_TOWER_CONFIG, TowerChonky } from '../towers/TowerChonky';
import { BOBA_TOWER_CONFIG, TowerBoba } from '../towers/TowerBoba';

// Enemy classes
import { EnemyCucumber } from '../enemies/EnemyCucumber';
import { EnemyDust } from '../enemies/EnemyDust';
import { EnemyVacuum } from '../enemies/EnemyVacuum';
import { EnemyMailman } from '../enemies/EnemyMailman';

// Obstacle classes
import { ObstacleBox } from '../entities/ObstacleBox';
import { ObstacleShoe } from '../entities/ObstacleShoe';

export class Level1 extends BaseTDScene {
  constructor() {
    super({ key: 'Level1' });
  }

  // ===================== ABSTRACT METHOD IMPLEMENTATIONS =====================

  protected getGridConfig(): GridConfig {
    const cellSize = CONFIG.towerDefenseConfig.cellSize.value;
    const cols = 16;
    const rows = 12;
    const mapW = cols * cellSize;
    const mapH = rows * cellSize;
    const screenW = CONFIG.screenSize.width.value;
    const screenH = CONFIG.screenSize.height.value;
    const offsetX = Math.floor((screenW - mapW) / 2);
    const offsetY = Math.floor((screenH - mapH) / 2);

    // S=SPAWN(3), P=PATH(1), E=EXIT(4), B=BUILDABLE(0), X=BLOCKED(2)
    // Obstacles at (5,2), (11,5), (8,8) - away from edges, not on path
    const cells: CellType[][] = [
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // row 0
      [2, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], // row 1: S at (1,1), P goes right
      [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], // row 2: obstacle at (5,2)
      [2, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2], // row 3: P turns right
      [2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2], // row 4
      [2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 2, 0, 0, 0, 2], // row 5: obstacle at (11,5)
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2], // row 6
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2], // row 7: P turns right
      [2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 2], // row 8: obstacle at (8,8)
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 4], // row 9: E at (15,9)
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], // row 10
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // row 11
    ];

    return { cols, rows, cellSize, cells, offsetX, offsetY };
  }

  protected getPathWaypoints(): PathPoint[] {
    return [
      { gridX: 1, gridY: 1 },   // SPAWN (Door)
      { gridX: 4, gridY: 1 },   // Turn down
      { gridX: 4, gridY: 3 },   // Turn right
      { gridX: 7, gridY: 3 },   // Turn down
      { gridX: 7, gridY: 5 },   // Turn right
      { gridX: 9, gridY: 5 },   // Turn down
      { gridX: 9, gridY: 7 },   // Turn right
      { gridX: 11, gridY: 7 },  // Turn down
      { gridX: 11, gridY: 9 },  // Turn right
      { gridX: 15, gridY: 9 },  // EXIT (Tuna Can)
    ];
  }

  protected createEnvironment(): void {
    const screenW = CONFIG.screenSize.width.value;
    const screenH = CONFIG.screenSize.height.value;

    // Background image -- stretch to full screen
    if (textureExists(this, 'living_room_bg')) {
      const bg = this.add.image(0, 0, 'living_room_bg').setOrigin(0, 0);
      bg.setDisplaySize(screenW, screenH);
      bg.setDepth(-10);
    }

    // Tower slot visuals: hidden by default, shown during placement mode
    this.towerSlotGroup = drawTowerSlots(
      this, this.cells, this.cellSize, this.gridOffsetX, this.gridOffsetY
    );

    // Path visualization: semi-transparent brown line
    drawPathLine(this, this.pathWaypoints, 8, 0x8B4513, 0.6, -5);

    // Spawn point -- Door image at the spawn position
    const spawnWorld = this.gridToWorld(1, 1);
    if (textureExists(this, 'spawn_door')) {
      const door = this.add.image(spawnWorld.x, spawnWorld.y, 'spawn_door');
      door.setDisplaySize(this.cellSize * 1.5, this.cellSize * 1.5);
      door.setDepth(-4);
    }

    // Defense target -- Golden Tuna Can at the exit position
    const exitWorld = this.gridToWorld(15, 9);
    if (textureExists(this, 'defense_target')) {
      const tunacan = this.add.image(exitWorld.x, exitWorld.y, 'defense_target');
      tunacan.setDisplaySize(this.cellSize * 1.8, this.cellSize * 1.8);
      tunacan.setDepth(-4);
    }
  }

  protected getWaveDefinitions(): WaveDefinition[] {
    // Spawn interval formula: (displayHeight / speed) * 1000 * 1.5
    // cucumber: 72/85 *1000*1.5 = 1271ms -> 1300ms
    // dust:     60/68 *1000*1.5 = 1324ms -> 1350ms
    // vacuum:   96/35 *1000*1.5 = 4114ms -> 4100ms
    // mailman: 140/28 *1000*1.5 = 7500ms (boss, count=1)
    return [
      {
        preDelay: 2000,
        groups: [
          { enemyType: 'cucumber', count: 5, interval: 1300 },
        ],
        reward: 20,
      },
      {
        groups: [
          { enemyType: 'dust', count: 8, interval: 1350 },
          { enemyType: 'vacuum', count: 2, interval: 4100 },
        ],
        reward: 30,
      },
      {
        groups: [
          { enemyType: 'cucumber', count: 4, interval: 1300 },
          { enemyType: 'dust', count: 6, interval: 1350 },
          { enemyType: 'mailman', count: 1, interval: 7500 },
        ],
        reward: 100,
      },
    ];
  }

  protected getMinSpawnInterval(): number {
    // Minimum safe interval: cucumber 72px/85px/s * 1000 * 1.5 = 1271ms
    return 1300;
  }

  protected getTowerTypes(): TowerTypeConfig[] {
    return [
      TABBY_TOWER_CONFIG,
      SIAMESE_TOWER_CONFIG,
      CHONKY_TOWER_CONFIG,
      BOBA_TOWER_CONFIG,
    ];
  }

  protected createEnemy(enemyType: string): BaseTDEnemy | null {
    switch (enemyType) {
      case 'cucumber':
        return new EnemyCucumber(this, 0, 0);
      case 'dust':
        return new EnemyDust(this, 0, 0);
      case 'vacuum':
        return new EnemyVacuum(this, 0, 0);
      case 'mailman':
        return new EnemyMailman(this, 0, 0);
      default:
        console.warn(`Unknown enemy type: ${enemyType}`);
        return null;
    }
  }

  // ===================== TOWER FACTORY OVERRIDE =====================

  protected createTower(
    worldX: number, worldY: number,
    gridX: number, gridY: number,
    config: TowerTypeConfig
  ): BaseTower {
    let tower: BaseTower;
    switch (config.id) {
      case 'tabby':
        tower = new TowerTabby(this, worldX, worldY, gridX, gridY, config,
          this.projectilesGroup, this.enemiesGroup);
        break;
      case 'siamese':
        tower = new TowerSiamese(this, worldX, worldY, gridX, gridY, config,
          this.projectilesGroup, this.enemiesGroup);
        break;
      case 'chonky':
        tower = new TowerChonky(this, worldX, worldY, gridX, gridY, config,
          this.projectilesGroup, this.enemiesGroup);
        break;
      case 'boba':
        tower = new TowerBoba(this, worldX, worldY, gridX, gridY, config,
          this.projectilesGroup, this.enemiesGroup);
        break;
      default:
        tower = super.createTower(worldX, worldY, gridX, gridY, config);
    }
    safeAddSound(this, 'sfx_tower_place', { volume: 0.5 });
    return tower;
  }

  // ===================== HOOK OVERRIDES =====================

  protected onPostCreate(): void {
    // Place obstacles on BLOCKED cells (positions away from edges for visibility)
    const obs1World = this.gridToWorld(5, 2);
    const obs1 = new ObstacleBox(this, obs1World.x, obs1World.y);
    this.obstaclesGroup.add(obs1);

    const obs2World = this.gridToWorld(11, 5);
    const obs2 = new ObstacleShoe(this, obs2World.x, obs2World.y);
    this.obstaclesGroup.add(obs2);

    const obs3World = this.gridToWorld(8, 8);
    const obs3 = new ObstacleBox(this, obs3World.x, obs3World.y);
    this.obstaclesGroup.add(obs3);

    // Play background music
    safeAddSound(this, 'bgm_playful', { volume: 0.3, loop: true });
  }

  protected onProjectileHitEnemy(
    projectile: Phaser.Physics.Arcade.Sprite,
    enemy: BaseTDEnemy
  ): void {
    // Read slow properties BEFORE super destroys the projectile
    const slowAmount = (projectile as any).slowAmount as number | undefined;
    const slowDuration = (projectile as any).slowDuration as number | undefined;

    // Call super to handle damage (splash if present) and destroy projectile
    super.onProjectileHitEnemy(projectile, enemy);

    // Apply slow status effect if projectile has slow properties
    if (slowAmount !== undefined && slowDuration !== undefined && enemy.active) {
      enemy.applyStatusEffect('slow', slowAmount, slowDuration, 0x4488ff);
    }
  }

  protected onEnemyKilled(enemy: BaseTDEnemy): void {
    showFloatingText(this, enemy.x, enemy.y, `+${enemy.killReward}`, '#FFD700', 20);
  }

  protected onEnemyReachedEnd(enemy: BaseTDEnemy): void {
    this.cameras.main.shake(300, 0.01);
  }

  protected onComboKill(comboCount: number): void {
    const bonus = CONFIG.towerDefenseConfig.comboBonusPerLevel.value * comboCount;
    this.economyManager.earn(bonus);
    this.events.emit('showCombo', comboCount);
    safeAddSound(this, 'sfx_combo', { volume: 0.7 });
    showFloatingText(
      this, this.scale.width / 2, 100,
      `COMBO x${comboCount}! +${bonus}`, '#FF8800', 24, 1200, 50
    );
  }

  protected onWaveStart(waveNumber: number): void {
    // No special effect needed -- UIScene handles wave display
  }

  protected onWaveComplete(waveNumber: number): void {
    safeAddSound(this, 'sfx_wave_clear', { volume: 0.8 });
    const waveDefs = this.getWaveDefinitions();
    const wave = waveDefs[waveNumber - 1];
    if (wave?.reward) {
      this.events.emit('showWaveBonus', wave.reward);
      showFloatingText(
        this, this.scale.width / 2, this.scale.height / 2,
        `WAVE BONUS! +${wave.reward}`, '#44FF44', 28, 1500, 60
      );
    }
  }

  protected onObstacleDestroyed(obstacle: BaseObstacle): void {
    // Convert the cell to BUILDABLE
    const grid = worldToGrid(
      obstacle.x, obstacle.y,
      this.cellSize, this.gridOffsetX, this.gridOffsetY
    );
    if (
      grid.gridY >= 0 && grid.gridY < this.cells.length &&
      grid.gridX >= 0 && grid.gridX < this.cells[0].length
    ) {
      this.cells[grid.gridY][grid.gridX] = CellType.BUILDABLE;
    }
    showFloatingText(this, obstacle.x, obstacle.y, `+${(obstacle as any).reward ?? 15}`, '#FFD700', 20);
  }

  protected onTowerPlaced(tower: BaseTower, gridX: number, gridY: number): void {
    // Sound already played in createTower override
  }

  protected onTowerClicked(tower: BaseTower): void {
    if (tower.canUpgrade()) {
      const cost = tower.getUpgradeCost();
      if (cost !== null && this.economyManager.canAfford(cost)) {
        this.upgradeTower(tower);
        safeAddSound(this, 'sfx_tower_upgrade', { volume: 0.6 });
      }
    } else {
      this.sellTower(tower);
      safeAddSound(this, 'sfx_tower_sell', { volume: 0.5 });
    }
  }
}
