const {
  GROUND_LINE,
  GROUND_DEPTH,
  GROUND_LEFT_BOUND,
} = require('../utils/constants')
const COLORS = require('../utils/colors');


class World {
  constructor() {
  }
  update(dt, keys) {
  }
  draw(renderer) {
    renderer.isolatePath({
      fillStyle: COLORS.DIRT,
    }, () => {
      renderer.fillRect(GROUND_LEFT_BOUND, GROUND_LINE + GROUND_DEPTH, renderer.width, renderer.height - GROUND_LINE - GROUND_DEPTH);
    });
    renderer.isolatePath({
      fillStyle: COLORS.PLANT,
    }, () => {
      renderer.fillRect(GROUND_LEFT_BOUND, GROUND_LINE, renderer.width, GROUND_DEPTH);
    });
    renderer.isolatePath({
      fillStyle: COLORS.SKY,
    }, () => {
      renderer.fillRect(GROUND_LEFT_BOUND, 0, renderer.width, GROUND_LINE);
    });
  }
}

module.exports = World;