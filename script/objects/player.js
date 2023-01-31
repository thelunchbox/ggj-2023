const Sprite = require('../utils/sprite');
const treeAnimations = {
  normal: {
    frames: [
      [0, 0, 35],
      [0, 1, 15],
      [0, 2, 20],
      [0, 1, 25],
    ],
    next: 'normal',
  },
};

class Player {

  constructor() {
    this.sprite = new Sprite('tree', './img/test_t.png', 20, 20, treeAnimations);
  }

  update(dt, keys) {
    this.sprite.update();
  }

  draw(renderer) {
    this.sprite.draw(renderer.center.x-50, 0, {
      width: 100,
      height: 100,
    });
  }
}

module.exports = Player;