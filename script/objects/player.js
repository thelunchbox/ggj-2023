const Sprite = require('../utils/sprite');
const Root = require('./root');
const { WINDOW_WIDTH, WINDOW_HEIGHT} = require('../utils/constants');
const { CURSOR_SPEED } = require('../utils/constants');

const treeAnimations = {
  normal: {
    frames: [
      [0, 0, 35],
      [0, 1, 15],
      [0, 2, 20],
      [0, 3, 25],
      [0, 4, 25],
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
      y: WINDOW_HEIGHT/2,
    }
    this.roots = []
    this.roots.push(new Root(WINDOW_WIDTH/2, 100, WINDOW_WIDTH/2, 130));
  }

  update(dt, keys) {
    if (keys.includes(65)) {
      // Move Left
      this.cursor.x -= CURSOR_SPEED;
    }
    if (keys.includes(68)) {
      // Move Right
      this.cursor.x += CURSOR_SPEED;
    }
    if (keys.includes(87)) {
      // Move Up
      this.cursor.y -= CURSOR_SPEED;
    }
    if (keys.includes(83)) {
      // Move Down
      this.cursor.y += CURSOR_SPEED;
    }

    this.treeSprite.update();
    for (const root of this.roots) {
      root.update(dt, keys, this.cursor);
    }
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