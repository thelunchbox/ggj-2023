const COLORS = require("../utils/colors");

const MAX_PUDDLE_RADIUS = 50;
const GROWTH_RATE = 0.1;
const FRAME_CYCLE = 60;

class Puddle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.totalGrowth = radius;
    this.frame = 0;
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
    this.frame = (this.frame + 1) % FRAME_CYCLE;
  }

  draw(renderer) {
    renderer.isolatePath({
      fillStyle: COLORS.WATER,
    }, () => {
      renderer.fillCircle(this.x, this.y, this.radius);
      const count = 3;
      const delta = FRAME_CYCLE / count;
      let frameCalc = this.frame;
      for (let i = 0; i < count; i += 1) {
        frameCalc = (frameCalc + delta) % FRAME_CYCLE;
        const adjust = 2 * Math.PI * frameCalc / FRAME_CYCLE;
        renderer.isolatePath({
          fillStyle: COLORS.WATER,
        }, () => {
          renderer.translate(this.x, this.y);
          renderer.rotate(adjust);
          // renderer.path({
          //   strokeStyle: '#f00',
          //   lineWidth: 2,
          // }, () => {
          //   renderer.strokePath([
          //     { x: 0, y: 0 },
          //     { x: this.radius * (0.75 + Math.cos(frameCalc / 20)), y: 0 }
          //   ], { close: false });
          // })
          // renderer.scale(1.3, 0);
          renderer.fillCircle(this.radius * 0.6, 0, this.radius / 2);
        });
      }
    });
  }
}

module.exports = Puddle;