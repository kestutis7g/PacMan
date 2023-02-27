import { randomGridPosition } from 'src/app/game-engine/gameboard-grid.util';
import { Wall } from 'src/app/game-engine/Environment/Decorator';
import { IMoveAlgorithm } from 'src/app/game-engine/MoveAlgorithm/IMoveAlgorithm';
import { Implementation } from './Bridge';
import { FacadeService } from 'src/app/core/services/facade.service';
import { GameObject } from 'src/app/models/game.types';

export class AntidoteFood implements Implementation {
  EXPANSION_RATE = 1;
  AntidoteFood: any;
  name: string;
  player;
  correctInput?: IMoveAlgorithm;

  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  constructor(
    player: any,
    public walls: Wall,
    correctInput: IMoveAlgorithm,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.AntidoteFood = this.getRandomFoodPosition();
    this.correctInput = correctInput;
    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.AntidoteFood.x,
      y: this.AntidoteFood.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update(blob1?: any, ghostBlob?: any, blob3?: any, blob4?: any) {
    if (this.player.onPlayer(this.AntidoteFood)) {
      this.player.changeMovement(this.correctInput);
      //setTimeout(() => { console.log('hello'); }, 10000)
      //this.player.changeMovement(new CorrectInput);

      this.oldPosition = this.AntidoteFood;
      this.AntidoteFood = { x: -1, y: -1 };
      const newPosition: any = this.getRandomFoodPosition();

      let lobbyId = sessionStorage.getItem('lobbyId')!;
      this.facadeService.mediatorService.updateGameObject(lobbyId, {
        name: this.name,
        x: newPosition.x,
        y: newPosition.y,
      });
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
        this.AntidoteFood = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  draw(gameBoard: any) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.AntidoteFood.y;
    foodElement.style.gridColumnStart = this.AntidoteFood.x;
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/iconfactory/kidcons/32/Medicine-icon.png')";
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/yusuke-kamiyamane/fugue/16/poison-green-icon.png')"
    foodElement.style.backgroundSize = 'cover';

    foodElement.classList.add('antidotefoodas');
    gameBoard.appendChild(foodElement);
  }

  getRandomFoodPosition() {
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

  getPosition() {
    return this.AntidoteFood;
  }
}
