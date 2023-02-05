
const TREE = {
  sprout: {
    frames: [
      [0, 0, 8],
      [0, 1, 7],
      [0, 2, 6],
      [0, 3, 7],
      [0, 4, 7],
    ],
    next: 'sprout',
  },
  twig: {
    frames: [
      [1, 0, 8],
      [1, 1, 7],
      [1, 2, 6],
      [1, 3, 7],
      [1, 4, 7],
    ],
    next: 'twig',
  },
  bush: {
    frames: [
      [2, 0, 8],
      [2, 1, 7],
      [2, 2, 6],
      [2, 3, 7],
      [2, 4, 7],
    ],
    next: 'bush',
  },
  tree: {
    frames: [
      [3, 0, 8],
      [3, 1, 7],
      [3, 2, 6],
      [3, 3, 7],
      [3, 4, 7],
    ],
    next: 'tree',
  },
};

const CURSOR = {
  normal: {
    frames: [
      [0, 0, 35],
      [0, 1, 5],
    ],
    next: 'normal',
  },
};

const METER = {
  normal: {
    frames: [
      [0, 0, 1000],
    ],
    next: 'normal',
  },
};

module.exports = {
  TREE,
  CURSOR,
  METER,
}