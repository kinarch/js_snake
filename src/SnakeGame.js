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

    //  game state
    this.board = null
    this.food = null
    this.snake = null
    this.interval = null
    this.currentDirection = ""
    this.nextDirection = ""
    this.gameOver = false
    this.score = 0

    // A CHANGER DE PLACE ??
    window.addEventListener('keydown', (ev) => {
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

  /*
    ====  ====  ====  ====
    # Score and Level
  */

  getLevel() {
    return this.snake.getBody().length - 1
  }

  increaseScore() {
    this.score += this.pointsByFood * this.getLevel()
  }


  /*
    ====  ====  ====  ====
    # Game over
  */

  snakeIsOutOfBoard(nextSnakePos) {
    return (
      nextSnakePos.x >= Tiles.numberX ||
      nextSnakePos.x < 0 ||
      nextSnakePos.y >= Tiles.numberY ||
      nextSnakePos.y < 0
    )
  }

  snakeIsInHisBodyTile(nextSnakePos) {
    return (
      this.board.get(nextSnakePos.x, nextSnakePos.y) === Tiles.types.snake
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

  snakeIsOnFoodTile(snakeHeadPos) {
    return (
      this.board.get(snakeHeadPos.x, snakeHeadPos.y) === Tiles.types.food
    )
  }

  /*
    ====  ====  ====  ====
    # Game

    ## init : initialise le jeu
    ## update: la logique du jeu
    ## draw: le rendu du jeu
    ## tic: la boucle update + draw
    ## pause: arrête ou relance le jeu
    ## stop: arrête le jeu
  */

  init() {

    if (this.interval) this.stop()

    const midX = Math.floor(Tiles.numberX / 2)
    const midY = Math.floor(Tiles.numberY / 2)

    this.nextDirection = "up"
    this.gameOver = false
    this.score = 0
    this.board = new Board(Tiles.numberX, Tiles.numberY)
    this.board.load(Tiles.types.empty)
    this.snake = new Snake(midX, midY)
    this.generateFood()
    this.update()
    this.draw()
    this.tic()
  }

  update() {

    //  je récupère la position de la tête du serpent
    const snakeHead = this.snake.getHead()
    const nextHeadPosition = {
      x: snakeHead.x,
      y: snakeHead.y
    }

    //  je récupère la direction
    this.currentDirection = this.nextDirection

    //  je teste la direction
    //  je deplace la position de la tête du serpent
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

    //  gameover :
    //  je teste la nouvelle position de la tête du serpent sur les bords et sur son corps
    if (this.snakeIsOutOfBoard(nextHeadPosition) || this.snakeIsInHisBodyTile(nextHeadPosition)) {
      this.gameOver = true
      return
    }

    //  je teste la nouvelle position de la tête du serpent avec la position de la nourriture
    //  si nourriture, le seprent garde sa dernière position et grandit
    //  je génère une nouvelle nourriture
    //  sinon le serpent perds sa dernière position et ne grandit pas
    if (this.snakeIsOnFoodTile(nextHeadPosition)) {
      this.generateFood()
      this.increaseScore()
    } else {
      this.snake.removeLastPos()
    }

    //  j'ajoute la nouvelle position de la tête du serpent au corps du serpent
    this.snake.addPos(nextHeadPosition)

    //  le board recharge les cases
    //  j'ajoute les objects du jeux (serpent et nourriture) au board
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
      //  j'efface le jeu
      //  je dessine le board
      ctx.clearRect(0, 0, width, height);
      board.getMatrix().forEach((row, x) => row.forEach((item, y) => {

        switch (item) {
          case Tiles.types.empty:
            ctx.fillStyle = Tiles.color.empty
            break
          case Tiles.types.snake:
            ctx.fillStyle = Tiles.color.snake
            break
          case Tiles.types.food:
            ctx.fillStyle = Tiles.color.food
            break
        }

        ctx.fillRect(
          (x * Tiles.size),
          (y * Tiles.size) + menuSize,
          Tiles.size,
          Tiles.size
        )
      }))
      ctx.textAlign = "left";
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