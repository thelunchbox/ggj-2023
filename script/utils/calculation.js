

function distance(p1, p2) {
  return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y))
}

function angleInRadians(p1, p2){
  // returns the angle between 2 points in radians
  return Math.atan2(p1.y - p2.y, p2.x - p1.x);
}
module.exports = {
  distance,
  angleInRadians,
}