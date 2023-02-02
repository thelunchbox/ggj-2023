const State = require('../state');
const STATES = require('../states');
const { getRenderer } = require('../renderer');
const COLORS = require('../utils/colors');

class Title extends State {

  constructor() {
    super();
  }

  update(dt, keys) {
    if (keys.length > 0) {
      this.next = STATES.GAME;
    }
    return super.update(dt, keys);
  }

  draw() {
    const r = getRenderer();
    r.isolatePath({
      font: '72pt Arial',
      fillStyle: COLORS.PLANT,
      strokeStyle: COLORS.DIRT,
      lineWidth: 10,
      lineJoin: 'round',
      textAlign: 'center',
      textBaseline: 'middle',
    }, () => {
      r.strokeAndFillText('I AM GROOT!', r.center.x, r.center.y);
      r.isolatePath({ fontSize: 26, fillStyle: '#fff' }, () => {
      r.fillText('WASD to move cursor, J to grow roots, K to set root origin (optional)', r.center.x, r.center.y + 150);
      });
    });
  }
}

module.exports = Title;