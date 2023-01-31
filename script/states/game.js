const State = require('../state');
const Sprite = require("../utils/sprite");
const STATES = require("../states");
const {getRenderer} = require("../renderer");

const testAnimations = {
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

class Game extends State {

  constructor() {
    super();
    this.test = new Sprite('tree', './img/test_t.png', 20, 20, testAnimations);
  }

  update(dt, keys) {
    // if (keys.length > 0) {
    //   this.next = STATES.GAME;
    // }
    this.test.update();
    return super.update(dt, keys);
  }

  draw() {
    const r = getRenderer();
    r.fillStyle = '#89CFF0';
    r.fillRect(0,0,r.width,90)
    r.fillStyle = 'green';
    r.fillRect(0,90,r.width,20)
    r.fillStyle = '#5b3e31';
    r.fillRect(0,110,r.width,r.height-110)
    this.test.draw(r.center.x-50, 0, {
      width: 100,
      height: 100,
    });
  }
}

module.exports = Game;