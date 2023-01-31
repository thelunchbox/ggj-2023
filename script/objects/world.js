const {
  GROUND_LINE,
  GROUND_DEPTH,
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
      renderer.fillRect(0, GROUND_LINE + GROUND_DEPTH, renderer.width, renderer.height - GROUND_LINE - GROUND_DEPTH);
    });
    renderer.isolatePath({
      fillStyle: COLORS.PLANT,
    }, () => {
      renderer.fillRect(0, GROUND_LINE, renderer.width, GROUND_DEPTH);
    });
    renderer.isolatePath({
      fillStyle: COLORS.SKY,
    }, () => {
      renderer.fillRect(0, 0, renderer.width, GROUND_LINE);
    });
  }
}

module.exports = World;