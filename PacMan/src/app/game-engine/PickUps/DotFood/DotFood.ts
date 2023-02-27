import { compileDeclareDirectiveFromMetadata } from "@angular/compiler";
import { Wall } from "../../Environment/Decorator";
import { randomGridPosition } from "../../gameboard-grid.util";


export class DotFood {
  EXPANSION_RATE = 1;
  score = 0;
  private food: any[][];
  snake;
  constructor(snake: any, public walls: Wall) {
    this.snake = snake;
    this.food = [];
    for(var i: number = 0; i < 32; i++)
    {
      this.food[i] = [];
      for(var j: number = 0; j < 32; j++)
      {
        //var foodPos = {x: i+1, y: j+1};
        //if (this.walls.onObject({foodPos}))
          this.food[i][j] = {x: i, y: j};
      }
    }
  }

  update() {
    for(let x = 0; x < 32; x++)
    {
      for(let y = 0; y < 32; y++)
      if (this.snake.onPlayer(this.food[x][y])) {
        this.addScore = 1;
        this.food[x][y] = this.deleteDot();
      }
    }
  }

  draw(gameBoard: any) {
    for(let x = 0; x < 32; x++)
    {
      for(let y = 0; y < 32; y++)
 {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.food[x][y].y;
    foodElement.style.gridColumnStart = this.food[x][y].x;
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/rokey/fantastic-dream/32/disc-red-cane-icon.png')"
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/mozco/kitchen/32/Beer-2-icon.png')"
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/mozco/kitchen/32/Beer-1-icon.png')"
    foodElement.style.backgroundImage =
      "url('https://imgur.com/uRLT3ON.png')";
    foodElement.style.backgroundSize = 'cover';
    foodElement.classList.add('foodas');
    gameBoard.appendChild(foodElement);
    }
  }
  }
  deleteDot()
  {
    return {
      x: 500,
      y: 500,
    };
  }
  getRandomFoodPosition() {
    let newFoodPosition;
    while (
      newFoodPosition == null ||
      this.snake.onPlayer(newFoodPosition) ||
      this.walls.onObject(newFoodPosition)
    ) {
      newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
  }

  set addScore(val: number) {
    this.snake.score += val;
  }
}
