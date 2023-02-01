const COLORS = require('../utils/colors');
const {
  ROOT_THICKNESS,
  DEG_2_RAD,
  ROOT_WANDER, ROOT_SPEED,
} = require("../utils/constants");

const {
  distance,
  angleInRadians,
} = require('../utils/calculation')


class Root {
  constructor(x1, y1, x2,y2) {
    this.points = [];
    this.points.push({ x: x2, y: y2 })
    this.x1 = x1;
    this.y1 = y1;
  }

  update(dt, keys, cursor) {
    const start = this.points[this.points.length - 1];

    console.log(angleInRadians(start, cursor));

    if (distance(start, cursor) > 30) {
      const targetAngle = angleInRadians(start, cursor)
      const wiggleAmount = DEG_2_RAD * Math.random() * ROOT_WANDER * (Math.round(Math.random()) ? 1 : -1); // random within ROOT_WANDER degrees of target.
      const direction = targetAngle + wiggleAmount
      console.log(direction)
      const x = start.x + (ROOT_SPEED * Math.cos(direction));
      const y = start.y - (ROOT_SPEED * Math.sin(direction) );
      this.points.push({ x, y });
    }
  }

  draw(renderer) {
    renderer.isolatePath({
      strokeStyle: COLORS.ROOT,
      lineWidth: ROOT_THICKNESS,
    }, () => {
      renderer.moveTo(this.x1, this.y1);
      for(const point of this.points) {
        renderer.lineTo(point.x, point.y);
      }
      renderer.stroke();
    });
  }
}

module.exports = Root;