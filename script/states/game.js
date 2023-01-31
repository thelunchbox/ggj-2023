const State = require('../state');
const STATES = require('../states');
const { getRenderer } = require('../renderer');
const COLORS = require('../utils/colors');
const Sprite = require("../utils/sprite");

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

const GROUND_LINE = 80;
const GROUND_DEPTH = 20;
const puddles = [];
const MAX_PUDDLE_RADIUS = 50;
const MAX_PUDDLE_COUNT = 30;
const puddleCooldown = 120;
let nextPuddleIn = puddleCooldown;

class Game extends State {

  constructor() {
    super();
    this.test = new Sprite('tree', './img/test_t.png', 20, 20, testAnimations);
  }

  update(dt, keys) {
    const r = getRenderer();

    puddles.forEach((puddle) => {
      if (puddle.radius < MAX_PUDDLE_RADIUS) {
        puddle.radius += 0.1;
      }
    });

    if (nextPuddleIn === 0 && puddles.length < MAX_PUDDLE_COUNT) {
      const yBuffer = GROUND_LINE + GROUND_DEPTH + MAX_PUDDLE_RADIUS + 5;
      puddles.push({
        x: Math.floor(Math.random() * r.width),
        y: Math.floor(Math.random() * (r.height - yBuffer)) + yBuffer,
        radius: Math.floor(Math.random() * 10) + 5,
      });
      nextPuddleIn = puddleCooldown;
    }
    nextPuddleIn -= 1;    
    this.test.update();
    return super.update(dt, keys);
  }

  draw() {
    const r = getRenderer();
    r.isolatePath({
      fillStyle: COLORS.DIRT,
    }, () => {
      r.fillRect(0, GROUND_LINE + GROUND_DEPTH, r.width, r.height - GROUND_LINE - GROUND_DEPTH);
    });
    r.isolatePath({
      fillStyle: COLORS.PLANT,
    }, () => {
      r.fillRect(0, GROUND_LINE, r.width, GROUND_DEPTH);
    });
    puddles.forEach((puddle) => {
      r.isolatePath({
        fillStyle: COLORS.WATER,
      }, () => {
        r.fillCircle(puddle.x, puddle.y, puddle.radius);
      });
    });
    r.isolatePath({
      fillStyle: COLORS.SKY,
    }, () => {
      r.fillRect(0, 0, r.width, GROUND_LINE);
    });
    this.test.draw(r.center.x-50, 0, {
      width: 100,
      height: 100,
    });
  }
}

module.exports = Game;