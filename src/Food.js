class Food {

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  getPos() {
    return {
      x: this.x,
      y: this.y
    }
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }

}