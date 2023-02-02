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
  constructor(start, target = null) {
    this.start = start;
    this.points = [];
    this.target = target;
    this.active = target != null;
  }

  setTarget(target) {
    this.target = target;
    this.active = true;
  }

  findNearestPoint(target) {
    let min = distance(this.start, target);
    let point = this.start;
    this.points.forEach(p => {
      const d = distance(p, target);
      if (d < min) {
        min = d;
        point = p;
      }
    });
    return [point, min];
  }

  doneGrowing() {
    return this.target && !this.active;
  }

  tip() {
    return this.points[this.points.length - 1];
  }

  update() {
    if (!this.active) return;

    if (this.points.length === 0) {
      this.points.push(this.start);
    }
    const start = this.tip();
    if (distance(start, this.target) > 10) {
      const targetAngle = angleInRadians(start, this.target)
      const wiggleAmount = DEG_2_RAD * Math.random() * ROOT_WANDER * (Math.round(Math.random()) ? 1 : -1); // random within ROOT_WANDER degrees of target.
      const direction = targetAngle + wiggleAmount;
      const x = start.x + (ROOT_SPEED * Math.cos(direction));
      const y = start.y - (ROOT_SPEED * Math.sin(direction) );
      this.points.push({ x, y });
    } else {
      this.active = false;
    }
  }

  drawOutline(renderer) {
    if (this.points.length < 2) {
      return;
    }

    renderer.isolatePath({
      strokeStyle: '#000',
      lineWidth: ROOT_THICKNESS + 3,
    }, () => {
      const {x, y} = this.points[0];
      renderer.moveTo(x, y);
      for(const point of this.points) {
        renderer.lineTo(point.x, point.y);
      }
      renderer.stroke();
    });
  }

  draw(renderer) {
    if (this.points.length < 2) {
      if (!this.active) {
        renderer.isolatePath({
          strokeStyle: COLORS.PLANT,
          lineWidth: 2,
        }, () => {
          renderer.strokeCircle(this.start.x, this.start.y, 10);
        });
      }
      return;
    }

    renderer.isolatePath({
      strokeStyle: COLORS.ROOT,
      lineWidth: ROOT_THICKNESS,
    }, () => {
      const {x, y} = this.points[0];
      renderer.moveTo(x, y);
      for(const point of this.points) {
        renderer.lineTo(point.x, point.y);
      }
      renderer.stroke();
    });
  }
}

module.exports = Root;