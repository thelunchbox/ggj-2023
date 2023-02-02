const State = require('../state');
const { getRenderer } = require('../renderer');
const Puddle = require('../objects/puddle')
const Player = require('../objects/player')
const World = require('../objects/world')

const {
  GROUND_LINE,
  GROUND_DEPTH,
  MAX_PUDDLE_RADIUS,
  MAX_PUDDLE_COUNT,
} = require('../utils/constants')

const PUDDLE_COOLDOWN = 300;

class Game extends State {

  constructor() {
    super();
    this.world = new World();
    this.player = new Player();
    this.puddles = [];
    this.nextPuddleIn = 120;
  }

  update(dt, keys) {
    const r = getRenderer();

    for (const puddle of this.puddles) {
      puddle.update(dt, keys)
    }

    if (this.nextPuddleIn === 0 && this.puddles.length < MAX_PUDDLE_COUNT) {
      const yBuffer = GROUND_LINE + GROUND_DEPTH + MAX_PUDDLE_RADIUS + 5;
      this.puddles.push(new Puddle(
        Math.floor(Math.random() * r.width),
        Math.floor(Math.random() * (r.height - yBuffer)) + yBuffer,
        Math.floor(Math.random() * 10) + 5
      ));
      this.nextPuddleIn = PUDDLE_COOLDOWN;
    }
    if(this.nextPuddleIn > 0) this.nextPuddleIn -= 1;
    this.player.update(dt, keys, this.puddles);
    return super.update(dt, keys);
  }

  draw() {
    const r = getRenderer();
    this.world.draw(r)

    for (const puddle of this.puddles) {
      puddle.draw(r);
    }

    this.player.draw(r);
  }
}

module.exports = Game;