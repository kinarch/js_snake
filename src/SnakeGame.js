class SnakeGame {

  constructor(canvas) {

    //  canvas
    this.canvas = canvas

    //  canvas context
    this.ctx = canvas.getContext("2d")

    //  animation speed
    this.speedAnimation = 100

    //  menu size (score / level screen)
    this.menuSize = 50

    //  points by food
    this.pointsByFood = 50

    //  resize the canvas
    canvas.height = Tiles.numberY * Tiles.size + this.menuSize
    canvas.width = Tiles.numberX * Tiles.size

    // A CHANGER DE PLACE ??
    addEventListener('keydown', (ev) => {
      switch (ev.key) {
        case "ArrowLeft":
          if (this.currentDirection !== "right") this.nextDirection = "left"
          break
        case "ArrowRight":
          if (this.currentDirection !== "left") this.nextDirection = "right"
          break
        case "ArrowUp":
          if (this.currentDirection !== "down") this.nextDirection = "up"
          break
        case "ArrowDown":
          if (this.currentDirection !== "up") this.nextDirection = "down"
          break
        case "Enter":
          this.init()
          break
        case " ":
          this.pause()
          break
      }
    })

    this.init()
  }


  getLevel() {
    return this.snake.getBody().slice(1).length - 1
  }

  increaseScore() {
    this.score += this.pointsByFood * this.getLevel()
  }


  /*
    ====  ====  ====  ====
    # Game over
  */

  snakeIsOutOfBoard(snakeHeadPos) {
    return (
      snakeHeadPos.x >= Tiles.numberX ||
      snakeHeadPos.x < 0 ||
      snakeHeadPos.y >= Tiles.numberY ||
      snakeHeadPos.y < 0
    )
  }

  snakeIsInHisBodyTile(snakeHeadPos) {
    return (
      this.board.get(snakeHeadPos.x, snakeHeadPos.y) === Tiles.types.snake
    )
  }

  /*
    ====  ====  ====  ====
    # Game Objects
  */

  addGameObjectsInBoard() {
    this.snake.getBody().forEach(element => this.board.set(element.x, element.y, Tiles.types.snake))
    this.board.set(this.food.getX(), this.food.getY(), Tiles.types.food)
  }

  generateFood() {

    let randomX = 0
    let randomY = 0

    do {
      randomX = Math.floor(Math.random() * Tiles.numberX)
      randomY = Math.floor(Math.random() * Tiles.numberY)
    } while (
      this.board.get(randomX, randomY) !== Tiles.types.empty
    )

    this.food = new Food(randomX, randomY)
  }

  snakeIsInFoodTile(snakeHeadPos) {
    return (
      this.board.get(snakeHeadPos.x, snakeHeadPos.y) === Tiles.types.food
    )
  }

  /*
    ====  ====  ====  ====
    # Game Life Cycle

    ## init : init the game variables
    ## update: update the data in the board
    ## draw: draw the rect game object from the board
    ## tic: loop the update & the draw
    ## pause: pause or resume the game
    ## stop: stop the game
  */

  init() {

    this.stop()

    //  variables
    this.nextDirection = "up"
    this.currentDirection = ""
    this.gameOver = false
    this.score = 0

    //  board
    this.board = new Board(Tiles.numberX, Tiles.numberY)
    this.board.load(Tiles.types.empty)

    //  snake
    const midX = Math.floor(Tiles.numberX / 2)
    const midY = Math.floor(Tiles.numberY / 2)
    this.snake = new Snake(midX, midY)

    //  food
    this.generateFood()

    //  game tic
    this.update()
    this.draw()
    this.tic()
  }

  update() {

    const snakeHead = this.snake.getHead()
    const nextHeadPosition = {
      x: snakeHead.x,
      y: snakeHead.y
    }
    
    this.currentDirection = this.nextDirection

    //  move the next head position
    switch (this.currentDirection) {
      case "left":
        nextHeadPosition.x--
        break
      case "right":
        nextHeadPosition.x++
        break
      case "up":
        nextHeadPosition.y--
        break
      case "down":
        nextHeadPosition.y++
        break;
    }

    //  snake add new pos
    this.snake.addPos(nextHeadPosition)
    
    // gameover : next head position is out of border or in snake body 
    if (this.snakeIsOutOfBoard(nextHeadPosition) || this.snakeIsInHisBodyTile(nextHeadPosition)) {
      this.gameOver = true
      return
    }

    //  check snake reach food
    if (this.snakeIsInFoodTile(nextHeadPosition)) {
      //  food : keep the last position and generate new food
      this.generateFood()
      this.increaseScore()
    } else {
      //  no food : remove the last position
      this.snake.removeLastPos()
    }

    //  reload the board and add game object
    this.board.load(Tiles.types.empty)
    this.addGameObjectsInBoard()

    // console.clear()
    // console.table(this.board.getMatrix())
  }

  draw() {

    const { board, ctx, gameOver, menuSize, score } = this
    const { width, height } = this.canvas

    ctx.beginPath()
    ctx.font = '16px Arial';

    if (gameOver) {
      ctx.textAlign = "center";
      ctx.fillText('GAME OVER', width / 2, height / 2 + menuSize / 2);
      ctx.fillStyle = "#fff"
    } else {
      ctx.clearRect(0, 0, width, height);
      board.getMatrix().forEach((row, x) => row.forEach((item, y) => {

        switch (item) {
          case Tiles.types.empty:
            ctx.fillStyle = "#000"
            break
          case Tiles.types.snake:
            ctx.fillStyle = "#F00"
            break
          case Tiles.types.food:
            ctx.fillStyle = "#0FF"
            break
        }

        ctx.fillRect(
          (x * Tiles.size),
          (y * Tiles.size) + menuSize,
          Tiles.size,
          Tiles.size
        )
      }
      )
      )
      ctx.fillStyle = "#000"
      ctx.fillText('Level ' + this.getLevel(), 10, 20)
      ctx.fillText('Score ' + score, 10, 40)
    }

    ctx.closePath()
  }

  pause() {
    if (this.interval) {
      this.stop()
    } else {
      this.tic()
    }
  }

  stop() {
    clearInterval(this.interval)
    this.interval = null
  }

  tic() {
    this.interval = setInterval(() => {
      if (this.gameOver) {
        this.stop()
      }
      this.update()
      this.draw()
    }, this.speedAnimation)
  }

}