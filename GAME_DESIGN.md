# Technical Game Design Document: Hajimi Defense: The Tuna Crisis

## Section 0: Technical Architecture

**Archetype**: `tower_defense`

**Base Classes** (from template_api.md):
- `BaseTDScene` → `Level1` (only level)
- `BaseTower` → `TowerTabby`, `TowerSiamese`, `TowerChonky`, `TowerBoba`
- `BaseTDEnemy` → `EnemyCucumber`, `EnemyDust`, `EnemyVacuum`, `EnemyMailman`
- `BaseObstacle` → `ObstacleBox`, `ObstacleShoe`

**Resolution**: 1152*768 (template standard)

**Scene Flow Diagram**:
```
TitleScreen -> Level1 -> VictoryUIScene (if win) -> TitleScreen
                     -> GameOverUIScene (if lose) -> TitleScreen
```

**LevelManager.LEVEL_ORDER**: `["Level1"]`

**Scene Keys Used**:
- `"TitleScreen"` (pre-existing)
- `"Level1"` (new)
- `"UIScene"` (pre-existing, auto-started)
- `"VictoryUIScene"` (pre-existing, triggered by BaseTDScene)
- `"GameOverUIScene"` (pre-existing, triggered by BaseTDScene)

## Section 1: Visual Style & Asset Registry

**Style Anchor**: "Cute pixel art, bright colors, top-down perspective for map, side/front view for characters. All assets should be soft and rounded — avoid sharp corners, use smooth curves and chubby shapes for a more Q (cute) and cartoonish feel."

**Asset Registry Table**:

| type | key | description | params |
|------|-----|-------------|--------|
| background | living_room_bg | Top-down view of a wooden living room floor with scattered cat toys (feather wand, yarn ball, mouse toy), a small rug in the corner, and faint outlines of furniture legs. Bright, clean, cartoonish pixel art style. | resolution: "1536*1024" |
| image | tower_slot | A round fluffy cushion with soft edges, light beige color, subtle stitching pattern around the edge. Top-down view. | - |
| image | defense_target | A golden tuna can with shiny metallic texture, slightly open lid, cartoonish sparkle effect. Top-down view. | - |
| image | spawn_door | An open wooden door with cat-shaped doorstop, showing hallway beyond. Top-down view from inside room. | - |
| image | obstacle_box | A cardboard box with flaps open, brown corrugated texture, slightly crumpled. Top-down view. | - |
| image | obstacle_shoe | A messy pile of shoes (sneaker, slipper, boot) in a heap. Top-down view. | - |
| image | cat_tabby | Top-down view of a cute orange tabby cat sitting upright on a cushion, cheeks puffed out ready to spit, alert expression. | - |
| image | cat_siamese | Top-down view of an elegant Siamese cat sitting upright, squinting eyes focused, poised to spit fish bones. | - |
| image | cat_fat | Top-down view of a fat orange cat lying on its side, lazily holding a red bean bun, looking sleepy. | - |
| image | cat_calico | Top-down view of a calico cat sitting upright, holding a boba tea straw, tapioca pearls visible in mouth. | - |
| image | proj_mung | A small round green mung bean with slight sheen, cartoonish simple shape. | - |
| image | proj_bone | An elongated white fish bone with jagged edges, sharp point at one end. | - |
| image | proj_bun | A round brown-red bean bun with steam lines, soft bread texture. | - |
| image | proj_boba | A round black tapioca pearl with sticky, glistening texture, slight translucency. | - |
| image | enemy_cucumber | Top-down view of a walking green cucumber with tiny stick legs, cartoon face with scared expression, small size. | - |
| image | enemy_dust | Top-down view of a grey dust ball puff with two cute eyes, tiny and fluffy. | - |
| image | enemy_vacuum | Top-down view of a round robot vacuum cleaner with red LED light as eye, metallic texture, medium size. | - |
| image | enemy_mailman | Top-down view of a giant mailman figure in blue uniform, holding mailbag, huge sprite compared to other enemies. | - |
| image | icon_kibble | A small cat food bowl icon with brown kibble pieces, simple cartoon style for UI. | - |
| image | icon_tower_tabby | Icon for Spitfire Tabby tower selection UI: small version of tabby cat with green bean. | - |
| image | icon_tower_siamese | Icon for Sniper Siamese tower selection UI: small version of siamese cat with fish bone. | - |
| image | icon_tower_fat | Icon for Chonky Orange tower selection UI: small version of fat cat with red bun. | - |
| image | icon_tower_calico | Icon for Boba Calico tower selection UI: small version of calico cat with boba pearl. | - |
| audio | sfx_tower_place | Soft "plop" sound like a cat landing on cushion, gentle thud. | audioType: "sfx" |
| audio | sfx_tower_sell | Quick "whoosh" sound like something being whisked away, light airy. | audioType: "sfx" |
| audio | sfx_tower_upgrade | Sparkle/chime sound, magical ascending notes, cute and rewarding. | audioType: "sfx" |
| audio | sfx_spit | Cute "Pfft" sound like a small spit, airy and comical. | audioType: "sfx" |
| audio | sfx_bonk | Soft bonk/hit sound, like a bean hitting something, cartoonish. | audioType: "sfx" |
| audio | sfx_break | Cracking/breaking cardboard sound, crinkly and satisfying. | audioType: "sfx" |
| audio | sfx_combo | Exciting ascending chime, 8-bit style, rewarding feeling. | audioType: "sfx" |
| audio | sfx_wave_clear | Triumphant short jingle, happy resolution, 8-bit fanfare. | audioType: "sfx" |
| audio | sfx_enemy_death | Soft pop sound, like bubble bursting, cute not violent. | audioType: "sfx" |
| audio | bgm_playful | Funny, bouncy 8-bit music with cute melody, loopable background track. | audioType: "bgm", duration: 20 |

## Section 2: Game Configuration

```json
{
  "towerDefenseConfig": {
    "startingGold": { "value": 120, "type": "number", "description": "Initial Kibble (cat food currency) for Level 1" },
    "startingLives": { "value": 10, "type": "number", "description": "Initial Sanity (lives) - game ends when reaches 0" },
    "cellSize": { "value": 64, "type": "number", "description": "Grid cell size in pixels" },
    "timeBetweenWaves": { "value": 5000, "type": "number", "description": "Milliseconds between waves (countdown timer)" },
    "sellRefundRate": { "value": 0.7, "type": "number", "description": "Percentage of invested Kibble refunded when selling tower" },
    "comboTimeWindow": { "value": 2000, "type": "number", "description": "Milliseconds between kills to count as combo" },
    "comboBonusPerLevel": { "value": 2, "type": "number", "description": "Extra Kibble per combo level (e.g., combo 3 = +6 Kibble)" }
  },
  "towerStats": {
    "tabby": {
      "cost": { "value": 40, "type": "number", "description": "Spitfire Tabby placement cost" },
      "damage": { "value": 12, "type": "number", "description": "Base damage per green mung bean" },
      "range": { "value": 180, "type": "number", "description": "Attack range in pixels" },
      "fireRate": { "value": 1.8, "type": "number", "description": "Shots per second" },
      "projectileSpeed": { "value": 400, "type": "number", "description": "Mung bean travel speed (px/sec)" }
    },
    "siamese": {
      "cost": { "value": 80, "type": "number", "description": "Sniper Siamese placement cost" },
      "damage": { "value": 45, "type": "number", "description": "Base damage per fish bone" },
      "range": { "value": 320, "type": "number", "description": "Attack range in pixels" },
      "fireRate": { "value": 0.5, "type": "number", "description": "Shots per second" },
      "projectileSpeed": { "value": 600, "type": "number", "description": "Fish bone travel speed (px/sec)" }
    },
    "chonky": {
      "cost": { "value": 100, "type": "number", "description": "Chonky Orange placement cost" },
      "damage": { "value": 30, "type": "number", "description": "Base damage at center of splash" },
      "range": { "value": 140, "type": "number", "description": "Attack range in pixels" },
      "fireRate": { "value": 0.7, "type": "number", "description": "Shots per second" },
      "projectileSpeed": { "value": 250, "type": "number", "description": "Red bean bun travel speed (px/sec)" },
      "splashRadius": { "value": 80, "type": "number", "description": "Radius of splash damage area" }
    },
    "boba": {
      "cost": { "value": 60, "type": "number", "description": "Boba Calico placement cost" },
      "damage": { "value": 8, "type": "number", "description": "Base damage per tapioca pearl" },
      "range": { "value": 160, "type": "number", "description": "Attack range in pixels" },
      "fireRate": { "value": 1.2, "type": "number", "description": "Shots per second" },
      "projectileSpeed": { "value": 300, "type": "number", "description": "Tapioca pearl travel speed (px/sec)" },
      "slowAmount": { "value": 0.5, "type": "number", "description": "Speed multiplier when slowed (0.5 = 50% speed)" },
      "slowDuration": { "value": 2000, "type": "number", "description": "Slow effect duration in milliseconds" }
    }
  },
  "enemyStats": {
    "cucumber": {
      "maxHealth": { "value": 40, "type": "number", "description": "Cucumber enemy health" },
      "speed": { "value": 120, "type": "number", "description": "Movement speed (px/sec)" },
      "reward": { "value": 8, "type": "number", "description": "Kibble dropped when killed" },
      "damage": { "value": 1, "type": "number", "description": "Sanity lost when reaches exit" }
    },
    "dust": {
      "maxHealth": { "value": 15, "type": "number", "description": "Dust Bunny enemy health" },
      "speed": { "value": 80, "type": "number", "description": "Movement speed (px/sec)" },
      "reward": { "value": 4, "type": "number", "description": "Kibble dropped when killed" },
      "damage": { "value": 1, "type": "number", "description": "Sanity lost when reaches exit" }
    },
    "vacuum": {
      "maxHealth": { "value": 200, "type": "number", "description": "Robot Vacuum enemy health" },
      "speed": { "value": 40, "type": "number", "description": "Movement speed (px/sec)" },
      "reward": { "value": 25, "type": "number", "description": "Kibble dropped when killed" },
      "damage": { "value": 2, "type": "number", "description": "Sanity lost when reaches exit" }
    },
    "mailman": {
      "maxHealth": { "value": 800, "type": "number", "description": "Mailman boss enemy health" },
      "speed": { "value": 30, "type": "number", "description": "Movement speed (px/sec)" },
      "reward": { "value": 100, "type": "number", "description": "Kibble dropped when killed" },
      "damage": { "value": 5, "type": "number", "description": "Sanity lost when reaches exit" }
    }
  },
  "obstacleStats": {
    "box": {
      "maxHealth": { "value": 5, "type": "number", "description": "Cardboard box clicks to destroy" },
      "reward": { "value": 15, "type": "number", "description": "Kibble reward when destroyed" }
    },
    "shoe": {
      "maxHealth": { "value": 5, "type": "number", "description": "Shoe pile clicks to destroy" },
      "reward": { "value": 15, "type": "number", "description": "Kibble reward when destroyed" }
    }
  }
}
```

## Section 3: Entity Architecture

### Tower Types (COPY `_TemplateTower.ts` -> `TowerName.ts`)

**1. TowerTabby.ts** (`TowerTypeConfig`):
```typescript
{
  id: "tabby",
  name: "Spitfire Tabby",
  textureKey: "cat_tabby",
  cost: gameConfig.towerStats.tabby.cost.value,
  damage: gameConfig.towerStats.tabby.damage.value,
  range: gameConfig.towerStats.tabby.range.value,
  fireRate: gameConfig.towerStats.tabby.fireRate.value,
  projectileKey: "proj_mung",
  projectileSpeed: gameConfig.towerStats.tabby.projectileSpeed.value,
  targetingMode: "first",
  upgrades: [
    { level: 2, cost: 60, damage: 18, range: 200, fireRate: 2.2 },
    { level: 3, cost: 90, damage: 25, range: 220, fireRate: 2.8 }
  ]
}
```
**Hook overrides**:
- `onFire(target)`: Play `sfx_spit` sound, call `playFireAnimation()` (default scale pulse)
- `getRangeCircleColor()`: Return `0xffa500` (orange) for hover range circle

**2. TowerSiamese.ts** (`TowerTypeConfig`):
```typescript
{
  id: "siamese",
  name: "Sniper Siamese",
  textureKey: "cat_siamese",
  cost: gameConfig.towerStats.siamese.cost.value,
  damage: gameConfig.towerStats.siamese.damage.value,
  range: gameConfig.towerStats.siamese.range.value,
  fireRate: gameConfig.towerStats.siamese.fireRate.value,
  projectileKey: "proj_bone",
  projectileSpeed: gameConfig.towerStats.siamese.projectileSpeed.value,
  targetingMode: "strongest",
  upgrades: [
    { level: 2, cost: 120, damage: 65, range: 360, fireRate: 0.6 },
    { level: 3, cost: 180, damage: 90, range: 400, fireRate: 0.7 }
  ]
}
```
**Hook overrides**:
- `onFire(target)`: Play `sfx_spit` sound, call `playFireAnimation()`
- `getRangeCircleColor()`: Return `0x4488ff` (blue) for hover range circle

**3. TowerChonky.ts** (`TowerTypeConfig`):
```typescript
{
  id: "chonky",
  name: "Chonky Orange",
  textureKey: "cat_fat",
  cost: gameConfig.towerStats.chonky.cost.value,
  damage: gameConfig.towerStats.chonky.damage.value,
  range: gameConfig.towerStats.chonky.range.value,
  fireRate: gameConfig.towerStats.chonky.fireRate.value,
  projectileKey: "proj_bun",
  projectileSpeed: gameConfig.towerStats.chonky.projectileSpeed.value,
  targetingMode: "closest",
  upgrades: [
    { level: 2, cost: 150, damage: 45, range: 160, fireRate: 0.9 },
    { level: 3, cost: 225, damage: 65, range: 180, fireRate: 1.1 }
  ]
}
```
**Hook overrides**:
- `createProjectile(target)`: Create projectile with `splashRadius: gameConfig.towerStats.chonky.splashRadius.value`
- `onFire(target)`: Play `sfx_spit` sound, call `playFireAnimation()`
- `getRangeCircleColor()`: Return `0xff4444` (red) for hover range circle

**4. TowerBoba.ts** (`TowerTypeConfig`):
```typescript
{
  id: "boba",
  name: "Boba Calico",
  textureKey: "cat_calico",
  cost: gameConfig.towerStats.boba.cost.value,
  damage: gameConfig.towerStats.boba.damage.value,
  range: gameConfig.towerStats.boba.range.value,
  fireRate: gameConfig.towerStats.boba.fireRate.value,
  projectileKey: "proj_boba",
  projectileSpeed: gameConfig.towerStats.boba.projectileSpeed.value,
  targetingMode: "first",
  upgrades: [
    { level: 2, cost: 90, damage: 12, range: 180, fireRate: 1.5 },
    { level: 3, cost: 135, damage: 18, range: 200, fireRate: 1.8 }
  ]
}
```
**Hook overrides**:
- `createProjectile(target)`: Create projectile with `slowAmount: gameConfig.towerStats.boba.slowAmount.value` and `slowDuration: gameConfig.towerStats.boba.slowDuration.value`
- `onFire(target)`: Play `sfx_spit` sound, call `playFireAnimation()`
- `getRangeCircleColor()`: Return `0xaa44ff` (purple) for hover range circle

### Enemy Types (COPY `_TemplateTDEnemy.ts` -> `EnemyName.ts`)

**1. EnemyCucumber.ts** (`TDEnemyConfig`):
```typescript
{
  textureKey: "enemy_cucumber",
  displayHeight: 36,
  stats: {
    maxHealth: gameConfig.enemyStats.cucumber.maxHealth.value,
    speed: gameConfig.enemyStats.cucumber.speed.value,
    reward: gameConfig.enemyStats.cucumber.reward.value,
    damage: gameConfig.enemyStats.cucumber.damage.value
  }
}
```

**2. EnemyDust.ts** (`TDEnemyConfig`):
```typescript
{
  textureKey: "enemy_dust",
  displayHeight: 24,
  stats: {
    maxHealth: gameConfig.enemyStats.dust.maxHealth.value,
    speed: gameConfig.enemyStats.dust.speed.value,
    reward: gameConfig.enemyStats.dust.reward.value,
    damage: gameConfig.enemyStats.dust.damage.value
  }
}
```

**3. EnemyVacuum.ts** (`TDEnemyConfig`):
```typescript
{
  textureKey: "enemy_vacuum",
  displayHeight: 64,
  stats: {
    maxHealth: gameConfig.enemyStats.vacuum.maxHealth.value,
    speed: gameConfig.enemyStats.vacuum.speed.value,
    reward: gameConfig.enemyStats.vacuum.reward.value,
    damage: gameConfig.enemyStats.vacuum.damage.value
  }
}
```

**4. EnemyMailman.ts** (`TDEnemyConfig`):
```typescript
{
  textureKey: "enemy_mailman",
  displayHeight: 96,
  stats: {
    maxHealth: gameConfig.enemyStats.mailman.maxHealth.value,
    speed: gameConfig.enemyStats.mailman.speed.value,
    reward: gameConfig.enemyStats.mailman.reward.value,
    damage: gameConfig.enemyStats.mailman.damage.value
  }
}
```

### Obstacle Types (COPY `_TemplateObstacle.ts` -> `ObstacleName.ts`)

**1. ObstacleBox.ts** (`ObstacleConfig`):
```typescript
{
  textureKey: "obstacle_box",
  displayHeight: 48,
  maxHealth: gameConfig.obstacleStats.box.maxHealth.value,
  reward: gameConfig.obstacleStats.box.reward.value
}
```

**2. ObstacleShoe.ts** (`ObstacleConfig`):
```typescript
{
  textureKey: "obstacle_shoe",
  displayHeight: 40,
  maxHealth: gameConfig.obstacleStats.shoe.maxHealth.value,
  reward: gameConfig.obstacleStats.shoe.reward.value
}
```

### Level Scene: Level1.ts (COPY `_TemplateTDLevel.ts` -> `Level1.ts`)

**Scene Key**: `"Level1"`

## Section 4: Map & Wave Design

### Grid Map Definition (Level 1)

**Grid Size**: 16 columns × 12 rows  
**Cell Size**: 64px  
**Grid Offset**: X: 96px, Y: 64px (centered within 1152*768)

```
X X X X X X X X X X X X X X X X
X S P P P B B B B B B B B B B X
X B B B P B B B B B B B B B B X
X B B B P P P P B B B B B B B X
X B B B B B B P B B B B B B B X
X B B B B B B P P P B B B B B X
X B B B B B B B B P B B B B B X
X B B B B B B B B P P P B B B X
X B B B B B B B B B B P B B B X
X B B B B B B B B B B P P P P E
X B B B B B B B B B B B B B B X
X X X X X X X X X X X X X X X X
```

**Legend**:
- `S`: SPAWN (1,1) - Door at top-left
- `E`: EXIT (15,9) - Tuna Can at bottom-right
- `P`: PATH (brown line)
- `B`: BUILDABLE (tower slots on cushions)
- `X`: BLOCKED (walls/room edges)

**Obstacle Positions** (BLOCKED cells that become BUILDABLE when destroyed):
- Cardboard Box at (2,2)
- Shoe Pile at (13,5)
- Cardboard Box at (7,9)

### Path Waypoints

```
Waypoint 0: (1, 1)   // SPAWN (Door)
Waypoint 1: (4, 1)   // First turn right
Waypoint 2: (4, 3)   // Turn down
Waypoint 3: (7, 3)   // Turn right  -- actually goes down from (6,3) to (6,5) then right
Waypoint 4: (7, 7)   // Turn down
Waypoint 5: (10, 7)  // Turn right
Waypoint 6: (10, 9)  // Turn down
Waypoint 7: (15, 9)  // EXIT (Tuna Can)
```

### Wave Definitions (Level 1)

| Wave | Enemy Groups | Interval | Pre-Delay | Reward |
|------|-------------|----------|-----------|--------|
| 1 | 5× cucumber | 1200ms | 2000ms | 20 Kibble |
| 2 | 8× dust + 2× vacuum | 800ms | - | 30 Kibble |
| 3 | 4× cucumber + 6× dust + 1× mailman | 600ms | - | 100 Kibble |

## Section 5: Implementation Roadmap

```
1. UPDATE LevelManager.ts: set LEVEL_ORDER = ["Level1"]
2. UPDATE main.ts: 
   - Add import: import { Level1 } from './scenes/Level1'
   - Register scene: game.scene.add("Level1", Level1)
3. MERGE gameConfig.json: Merge Section 2 values INTO existing src/gameConfig.json (keep screenSize, debugConfig, renderConfig intact)
4. COPY _TemplateTDLevel.ts -> Level1.ts:
   - Override getGridConfig(): Return 16x12 grid with cells from Section 4
   - Override getPathWaypoints(): Return 8 waypoints from Section 4
   - Override createEnvironment(): Add background, path line, tower slots, spawn door, defense target, obstacles
   - Override getWaveDefinitions(): Return 3 waves from Section 4
   - Override getTowerTypes(): Import and return all 4 tower configs
   - Override createEnemy(enemyType): Factory mapping to enemy classes
   - Override hooks for projectile hits, kills, combos, wave completion, obstacle destruction, enemy reaching end
5. COPY _TemplateTower.ts -> TowerTabby.ts
6. COPY _TemplateTower.ts -> TowerSiamese.ts
7. COPY _TemplateTower.ts -> TowerChonky.ts
8. COPY _TemplateTower.ts -> TowerBoba.ts
9. COPY _TemplateTDEnemy.ts -> EnemyCucumber.ts
10. COPY _TemplateTDEnemy.ts -> EnemyDust.ts
11. COPY _TemplateTDEnemy.ts -> EnemyVacuum.ts
12. COPY _TemplateTDEnemy.ts -> EnemyMailman.ts
13. COPY _TemplateObstacle.ts -> ObstacleBox.ts
14. COPY _TemplateObstacle.ts -> ObstacleShoe.ts
15. UPDATE TitleScreen.ts: Replace GAME TITLE with "Hajimi Defense"
16. VERIFY: Self-review, npm run build, npm run test, npm run dev
```
