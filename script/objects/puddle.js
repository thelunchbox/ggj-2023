const COLORS = require("../utils/colors");

const MAX_PUDDLE_RADIUS = 50;

class Puddle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  update(dt, keys) {
    if (this.radius < MAX_PUDDLE_RADIUS) {
      this.radius += 0.1;
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