import { randomGridPosition } from '../../gameboard-grid.util';
import { Wall } from '../../Environment/Decorator';
import { IMoveAlgorithm } from '../../MoveAlgorithm/IMoveAlgorithm';
import { Implementation } from './Bridge';
import { FacadeService } from 'src/app/core/services/facade.service';
import { GameObject } from 'src/app/models/game.types';

export class ClumsyFood implements Implementation {
  EXPANSION_RATE = 1;
  ClumsyFood: any;
  name: string;
  player;
  clumsyInput?: IMoveAlgorithm;

  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  constructor(
    player: any,
    public walls: Wall,
    clumsyInput: IMoveAlgorithm,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.ClumsyFood = this.getRandomFoodPosition();
    this.clumsyInput = clumsyInput;
    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.ClumsyFood.x,
      y: this.ClumsyFood.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update(blob1?: any, ghostBlob?: any, blob3?: any, blob4?: any) {
    if (this.player.onPlayer(this.ClumsyFood)) {
      this.player.changeMovement(this.clumsyInput);
      //setTimeout(() => { console.log('hello'); }, 10000)
      //this.player.changeMovement(new CorrectInput);

      blob1.blobRage(10000);
      ghostBlob.ghostRage(10000);
      blob3.blobRage(10000);
      blob4.blobRage(10000);

      this.oldPosition = this.ClumsyFood;
      this.ClumsyFood = { x: -1, y: -1 };
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
        this.ClumsyFood = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  draw(gameBoard: any) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.ClumsyFood.y;
    foodElement.style.gridColumnStart = this.ClumsyFood.x;
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/mozco/symbolic-objects/32/Poison-icon.png')";
    foodElement.style.backgroundSize = 'cover';
    foodElement.classList.add('clumsyfoodas');
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
    return this.ClumsyFood;
  }
}
