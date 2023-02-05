const Sprite = require('../utils/sprite');
const Root = require('./root');
const {
  CURSOR_SPEED,
  GROUND_LINE,
  GROUND_DEPTH,
  GROUND_LEFT_BOUND,
  KEYS,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  LEVEL_SCALE,
  DEATH_SPEED,
  WATER_DECAY,
} = require('../utils/constants');
const animations = require('../utils/animations');
const { distance } = require('../utils/calculation');
const COLORS = require("../utils/colors");

const ROOT_COOLDOWN = 30;
let GAME_OVER = false;

const growth_map = {
  sprout: 'twig',
  twig: 'bush',
  bush: 'tree',
  tree: 'tree'
}

class Player {

  constructor() {
    this.treeSprite = new Sprite('tree', './img/tree_stages.png', 80, 80, animations.TREE);
    this.meterSprite = new Sprite('meter', './img/big-meter.png', 50, 900, animations.METER);
    this.cursorSprite = new Sprite('cursor', './img/cursor.png', 64, 64, animations.CURSOR);
    this.deathSprite = new Sprite('death', './img/dead.png', 32, 32, animations.CURSOR);
    this.cursor = {
      x: WINDOW_WIDTH/2,
      y: GROUND_DEPTH + GROUND_LINE + 30,
    }
    this.roots = [];
    this.pendingRoot = null;
    this.rootCooldown = 10;
    this.water = LEVEL_SCALE/2;
    this.next_level = LEVEL_SCALE;
    this.death_level = 10;
    this.death_target = 10;
    this.current_state = 'sprout';
  }

  getTotalRootLength() {
    return this.roots.reduce((agg, root) => agg + root.points.length, 0);
  }

  update(dt, keys, puddles) {
    if ( GAME_OVER ) {
      return;
    }

    if (keys.includes(KEYS.A)) {
      // Move Left
      this.cursor.x -= CURSOR_SPEED;
      if (this.cursor.x < GROUND_LEFT_BOUND) this.cursor.x = GROUND_LEFT_BOUND;
    } else if (keys.includes(KEYS.D)) {
      // Move Right
      this.cursor.x += CURSOR_SPEED;
      if (this.cursor.x > WINDOW_WIDTH) this.cursor.x = WINDOW_WIDTH;
    }
    if (keys.includes(KEYS.W)) {
      // Move Up
      this.cursor.y -= CURSOR_SPEED;
      if (this.cursor.y < GROUND_LINE + GROUND_DEPTH) this.cursor.y = GROUND_LINE + GROUND_DEPTH;
    } else if (keys.includes(KEYS.S)) {
      // Move Down
      this.cursor.y += CURSOR_SPEED;
      if (this.cursor.y > WINDOW_HEIGHT) this.cursor.y = WINDOW_HEIGHT;
    }
    if (keys.includes(KEYS.J) && this.rootCooldown === 0) {
      const { x, y } = this.cursor;
      this.rootCooldown = ROOT_COOLDOWN;
      if (this.pendingRoot && y <= this.pendingRoot.start.y) {
        console.error('roots cannot grow up');
        const index = this.roots.indexOf(this.pendingRoot);
        this.roots.splice(index, 1);
        this.pendingRoot = null;
      } else {
        if (!this.pendingRoot) {
          this.pendingRoot = new Root({ x: WINDOW_WIDTH / 2, y: 100 }, { x, y });
          this.roots.push(this.pendingRoot);
        } else {
          this.pendingRoot.setTarget({ x, y });
        }
      }
      this.pendingRoot = null;
    }
    if (keys.includes(KEYS.K) && !this.pendingRoot) {
      this.rootCooldown = ROOT_COOLDOWN;
      const { x, y } = this.cursor;
      // find the nearest root node, if applicable
      const nearestPointOfEachRoot = this.roots
        .map(r => r.findNearestPoint({ x, y }))
        .filter(pair => pair[1] < 30)
        .sort((a, b) => a[1] - b[1]);

      const nearestPoint = nearestPointOfEachRoot[0];
      if (nearestPoint) {
        this.pendingRoot = new Root(nearestPoint[0]);
        this.roots.push(this.pendingRoot);
      }
    }

    const rootTips = this.roots.filter(r => r.doneGrowing()).map(r => r.tip());
    puddles.forEach(puddle => {
      const puddleCenter = { x: puddle.x, y: puddle.y };
      for (const tip of rootTips) {
        if (distance(tip, puddleCenter) <= puddle.radius) {
          puddle.drain();
          this.water += 1;
        }
      }
    });

    this.water -= WATER_DECAY;

    if (this.water > this.next_level) {
      this.current_state = growth_map[this.current_state];
      this.treeSprite.animate(this.current_state);
      this.next_level += LEVEL_SCALE;
      this.death_target += LEVEL_SCALE;
    }
    if (this.death_level < this.death_target) {
      this.death_level += DEATH_SPEED;
    }

    this.treeSprite.update();
    for (const root of this.roots) {
      root.update(dt, keys, this.cursor);
    }
    if (this.rootCooldown > 0) this.rootCooldown -= 1;
    this.cursorSprite.update();

    if (this.death_level > this.water) {
      GAME_OVER = true;
    }
  }

  draw(renderer) {
    for (const root of this.roots) {
      root.drawOutline(renderer);
    }
    for (const root of this.roots) {
      root.draw(renderer);
    }

    this.treeSprite.draw(renderer.center.x-50, 0, {
      width: 100,
      height: 100,
    });

    this.cursorSprite.draw(this.cursor.x-32, this.cursor.y-32)

    // Water meter
    renderer.isolatePath({
      fillStyle: COLORS.WATER,
    }, () => {
      renderer.fillRect(0, WINDOW_HEIGHT-this.water, 50, this.water);
    });
    this.meterSprite.draw(0, 0);
    renderer.isolatePath({
      fillStyle: '#0ab000',
    }, () => {
      renderer.fillRect(0, WINDOW_HEIGHT-this.next_level, 50, 2);
    });
    this.deathSprite.draw(55, WINDOW_HEIGHT-this.death_level-16);
    this.meterSprite.draw(0, 0);
    renderer.isolatePath({
      fillStyle: '#ff0000',
    }, () => {
      renderer.fillRect(0, WINDOW_HEIGHT-this.death_level, 50, 2);
    });

    if (GAME_OVER) {
      this.deathSprite.draw(WINDOW_WIDTH-700, (WINDOW_HEIGHT-700)/2, { width: 700, height: 700 });
    }

  }
}

module.exports = Player;