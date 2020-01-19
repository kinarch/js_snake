class Snake {


  constructor(x, y) {
    this.body =
      [
        {
          x: x,
          y: y
        },
        {
          x: x,
          y: y
        },
      ]
  }

  getHead() {
    return this.body[0]
  }

  getBody() {
    return this.body
  }

  getLength() {
    return this.body.length
  }

  addPos(pos) {
    this.body.unshift(pos)
  }

  removeLastPos() {
    this.body.pop()
  }

}