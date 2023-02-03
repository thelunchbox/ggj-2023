const COLORS = require("../utils/colors");

const MAX_PUDDLE_RADIUS = 50;
const GROWTH_RATE = 0.1;
const FRAME_CYCLE = 180;

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
      renderer.translate(this.x, this.y);
      renderer.fillCircle(0, 0, this.radius);
      const framePercent = this.frame / FRAME_CYCLE;
      const altFramePercent = ((this.frame + FRAME_CYCLE / 2) % FRAME_CYCLE) / FRAME_CYCLE;
      const cx = this.radius * Math.cos(framePercent * 2 * Math.PI);
      const cy = this.radius * Math.sin(framePercent * 2 * Math.PI);
      const cxAlt = this.radius * Math.cos(altFramePercent * 2 * Math.PI);
      const cyAlt = this.radius * Math.sin(altFramePercent * 2 * Math.PI);

      const cx1 = 0.8 * this.radius + 0.3 * cx;
      const cy1 = -this.radius; // - 1.2  * this.radius - 0.3 * cy;
      const cx2 = this.radius; // 1.2 * this.radius + 0.3 * cx;
      const cy2 = -0.8 * this.radius - 0.3 * cy;
      renderer.moveTo(0, -this.radius);
      renderer.bezierCurveTo(
        cx1, cy1, // control point 1
        cx2, cy2, // * Math.sin(this.frame / 100) + 0.5, // control point 2
        this.radius, 0 // end point
      );
      renderer.bezierCurveTo(
        this.radius, 0.8 * this.radius + 0.3 * cyAlt, // control point 1
        0.8 * this.radius + 0.3 * cxAlt, this.radius, // * Math.sin(this.frame / 100) + 0.5, // control point 2
        0, this.radius // end point
      );
      renderer.bezierCurveTo(
        -cx1, -cy1, // control point 1
        -cx2, -cy2, // * Math.sin(this.frame / 100) + 0.5, // control point 2
        -this.radius, 0 // end point
      );
      renderer.bezierCurveTo(
        -this.radius, -(0.8 * this.radius + 0.3 * cyAlt), // control point 1
        -(0.8 * this.radius + 0.3 * cxAlt), -this.radius, // * Math.sin(this.frame / 100) + 0.5, // control point 2
        0, -this.radius // end point
      );
      // renderer.fillCircle(cx1, cy1, 3);
      // renderer.fillCircle(cx2, cy2  , 3);
      // renderer.strokeStyle = '#f00';
      renderer.fill();
    });
  }
}

module.exports = Puddle;