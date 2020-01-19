class Board {

  constructor(numberX, numberY) {
    this.numberX = numberX
    this.numberY = numberY
    this.matrix = []
  }

  load(value) {
    for (let x = 0; x < this.numberX; x++) {
      this.matrix[x] = []
      for (let y = 0; y < this.numberY; y++) {
        this.matrix[x][y] = value
      }
    }
  }

  get(x, y) {
    return this.matrix[x][y]
  }

  getMatrix() {
    return this.matrix
  }

  getMidLen() {
    return this.matrix / length
  }

  set(x, y, value) {
    this.matrix[x][y] = value
  }

}