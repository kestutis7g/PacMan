import { randomGridPosition } from '../gameboard-grid.util';
import { Wall } from '../Environment/Decorator';
import { FacadeService } from 'src/app/core/services/facade.service';
import { GameObject } from 'src/app/models/game.types';

export abstract class AbstractFood {
  constructor(
    player: any,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.food = this.getRandomFoodPosition();
    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.food.x,
      y: this.food.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  food: any;
  name: string;
  player;

  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  public templateMethod(gameBoard: any): void {
    this.update();
    this.draw(gameBoard);
    if (this.hook()) {
      this.extra();
    }
  }

  protected update(): void {
    if (this.player.onPlayer(this.food)) {
      this.oldPosition = this.food;
      this.food = { x: -1, y: -1 };
      const newPosition: any = this.getRandomFoodPosition();

      let lobbyId = sessionStorage.getItem('lobbyId')!;
      this.facadeService.mediatorService.updateGameObject(lobbyId, {
        name: this.name,
        x: newPosition.x,
        y: newPosition.y,
      });
      this.addScore = 1;
    }

    var objects = this.gameObjects.split(';');
    objects.forEach((object) => {
      var data = object.split(' ');
      if (
        data[0] == this.name &&
        data[1] != undefined &&
        data[2] != undefined &&
        (parseInt(data[1]) != this.oldPosition.x ||
          parseInt(data[2]) != this.oldPosition.y)
      ) {
        this.food = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  protected getRandomFoodPosition() {
    let newFoodPosition;
    while (
      newFoodPosition == null ||
      this.player.onPlayer(newFoodPosition) ||
      this.walls.onObject(newFoodPosition)
    ) {
      newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
  }

  set addScore(val: number) {
    this.player.score += val;
  }

  protected abstract draw(gameBoard: any): void;

  protected abstract extra(): void;

  protected hook(): boolean {
    return false;
  }
}

export class Food extends AbstractFood {
  protected draw(gameBoard: any) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.food.y;
    foodElement.style.gridColumnStart = this.food.x;
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/rokey/fantastic-dream/32/disc-red-cane-icon.png')"
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/mozco/kitchen/32/Beer-2-icon.png')"
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/mozco/kitchen/32/Beer-1-icon.png')";
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/jeanette-foshee/simpsons-09/32/Food-Duff-beer-icon.png')";
    foodElement.style.backgroundSize = 'cover';
    foodElement.classList.add('foodas');
    gameBoard.appendChild(foodElement);
  }

  protected extra(): void {}
}

export class SuperFood extends AbstractFood {
  protected draw(gameBoard: any) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.food.y;
    foodElement.style.gridColumnStart = this.food.x;
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/rokey/fantastic-dream/32/disc-red-cane-icon.png')"
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/mozco/kitchen/32/Beer-2-icon.png')";
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/mozco/kitchen/32/Beer-1-icon.png')"
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/jeanette-foshee/simpsons-09/32/Food-Duff-beer-icon.png')";
    foodElement.style.backgroundSize = 'cover';
    foodElement.classList.add('foodas');
    gameBoard.appendChild(foodElement);
  }

  protected extra(): void {
    //console.log('ConcreteClass2 says: Implemented Operation1');
  }

  protected override hook(): boolean {
    //console.log('ConcreteClass2 says: Overridden Hook1');
    return true;
  }
}
