const State = require('../state');
const STATES = require('../states');
const { getRenderer } = require('../renderer');
const COLORS = require('../utils/colors');

const GROUND_LINE = 70;
const puddles = [];
const MAX_PUDDLE_RADIUS = 100;
const MAX_PUDDLE_COUNT = 30;
const puddleCooldown = 120;
let nextPuddleIn = puddleCooldown;

class Game extends State {

  constructor() {
    super();
  }

  update(dt, keys) {
    const r = getRenderer();

    puddles.forEach((puddle) => {
      if (puddle.radius < MAX_PUDDLE_RADIUS) {
        puddle.radius += 0.1;
      }
    });

    if (nextPuddleIn === 0 && puddles.length < MAX_PUDDLE_COUNT) {
      puddles.push({
        x: Math.floor(Math.random() * r.width),
        y: Math.floor(Math.random() * (r.height - GROUND_LINE)) + GROUND_LINE,
        radius: Math.floor(Math.random() * 10) + 5,
      });
      nextPuddleIn = puddleCooldown;
    }
    nextPuddleIn -= 1;
    return super.update(dt, keys);
  }

  draw() {
    const r = getRenderer();
    r.isolatePath({
      fillStyle: COLORS.DIRT,
    }, () => {
      r.fillRect(0, GROUND_LINE, r.width, r.height - GROUND_LINE);
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
  }
}

module.exports = Game;