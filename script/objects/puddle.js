const COLORS = require("../utils/colors");

const MAX_PUDDLE_RADIUS = 50;
const GROWTH_RATE = 0.1;

class Puddle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.totalGrowth = radius;
  }

  drain() {
    this.radius -= 1;
    if (this.radius < 0) this.radius = 0;
  }

  update(dt, keys) {
    if (this.totalGrowth < MAX_PUDDLE_RADIUS) {
      this.radius += GROWTH_RATE;
      this.totalGrowth += GROWTH_RATE;
    }
  }

  draw(renderer) {
    renderer.isolatePath({
      fillStyle: COLORS.WATER,
    }, () => {
      renderer.fillCircle(this.x, this.y, this.radius);
    });
  }
}

module.exports = Puddle;