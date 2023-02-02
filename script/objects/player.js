const Sprite = require('../utils/sprite');
const Root = require('./root');
const {
  CURSOR_SPEED,
  GROUND_LINE,
  GROUND_DEPTH,
  KEYS,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} = require('../utils/constants');
const { distance } = require('../utils/calculation')

const ROOT_COOLDOWN = 30;

const treeAnimations = {
  normal: {
    frames: [
      [0, 0, 8],
      [0, 1, 7],
      [0, 2, 6],
      [0, 3, 7],
      [0, 4, 7],
    ],
    next: 'normal',
  },
};

const cursorAnimations = {
  normal: {
    frames: [
      [0, 0, 35],
      [0, 1, 5],
    ],
    next: 'normal',
  },
};

class Player {

  constructor() {
    this.treeSprite = new Sprite('tree', './img/tree_small.png', 80, 80, treeAnimations);

    this.cursorSprite = new Sprite('cursor', './img/cursor.png', 64, 64, cursorAnimations);
    this.cursor = {
      x: WINDOW_WIDTH/2,
      y: GROUND_DEPTH + GROUND_LINE,
    }
    this.roots = [];
    this.pendingRoot = null;
    this.rootCooldown = 0;
    this.water = 0;
  }

  update(dt, keys, puddles) {
    if (keys.includes(KEYS.A)) {
      // Move Left
      this.cursor.x -= CURSOR_SPEED;
      if (this.cursor.x < 0) this.cursor.x = 0;
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
      if (!this.pendingRoot) {
        this.pendingRoot = new Root({ x: WINDOW_WIDTH / 2, y: 100 }, { x, y });
        this.roots.push(this.pendingRoot);
      } else {
        this.pendingRoot.setTarget({ x, y });
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

    this.treeSprite.update();
    for (const root of this.roots) {
      root.update(dt, keys, this.cursor);
    }
    if (this.rootCooldown > 0) this.rootCooldown -= 1;
    this.cursorSprite.update();
  }

  draw(renderer) {
    this.treeSprite.draw(renderer.center.x-50, 0, {
      width: 100,
      height: 100,
    });
    for (const root of this.roots) {
      root.draw(renderer);
    }
    this.cursorSprite.draw(this.cursor.x-32, this.cursor.y-32)
  }
}

module.exports = Player;