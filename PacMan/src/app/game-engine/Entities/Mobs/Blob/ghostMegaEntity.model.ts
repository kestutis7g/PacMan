import { FacadeService } from 'src/app/core/services/facade.service';
import { GameBoardComponent } from 'src/app/game-board/game-board.component';
import { Visitor } from 'src/app/game-engine/visitor';
import { GameObject } from 'src/app/models/game.types';
import { Wall } from '../../../Environment/Decorator';
import { randomGridPosition } from '../../../gameboard-grid.util';
import { Player } from '../../player';

export interface iGhostMegaEntity {
  color: any;
  type: any;
  name: string;
  ghostBody: { x: number; y: number };
  //ghostRage(time: number): void;

  gameObjects: string;
  mapId: string;
}

export class Ghost implements iGhostMegaEntity {
  public color = '';
  public type = '';
  name: string;
  public ghostBody = { x: 0, y: 0 };
  lastRenderTime = 0;
  newSegments = 0;
  movetime = 5;

  gameObjects: string = '';
  mapId: string;

  constructor(public walls: Wall, name: string, mapId: string) {
    this.mapId = mapId;
    this.name = name;
  }
  public accept(visitor: Visitor, time: number, gameBoard: any): void {
    visitor.visitConcreteComponentA(this, time, gameBoard);
  }
  draw(gameBoard: any) {
    const playerElement = document.createElement('div');
    playerElement.style.gridRowStart = this.ghostBody.y.toString();
    playerElement.style.gridColumnStart = this.ghostBody.x.toString();
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/bokehlicia/captiva/32/games-icon.png')"
    playerElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/mad-science/arcade-saturdays/32/Edible-Ghost-icon.png')";
    playerElement.style.backgroundSize = 'cover';

    playerElement.classList.add('playeras');
    gameBoard.appendChild(playerElement);
  }

  update() {
    var objects = this.gameObjects.split(';');
    objects.forEach((object) => {
      var data = object.split(' ');
      if (
        data[0] == this.name &&
        data[1] != undefined &&
        data[2] != undefined
      ) {
        this.ghostBody = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  start(player: Player, walls: Wall) {
    this.setRandomPosition(player, walls);
    this.update();
  }

  setRandomPosition(player: Player, walls: Wall) {
    let newPosition;
    while (
      newPosition == null ||
      player.onPlayer(newPosition) ||
      walls.onObject(newPosition)
    ) {
      newPosition = randomGridPosition();
    }
    this.ghostBody = newPosition;
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  randomIntBinary(max: number) {
    return Math.floor(Math.random() * max);
  }
  public ghostRage(time: number, gameBoard: any): void {
    const playerElement = document.createElement('div');
    playerElement.style.backgroundImage =
      "url('https://i.imgur.com/DRHOMaP.png')";

    playerElement.classList.add('playeras');
    gameBoard.appendChild(playerElement);

    this.movetime = 1000;

    setTimeout(() => {
      this.movetime = 5;

      const playerElement = document.createElement('div');
      playerElement.style.backgroundImage =
        "url('https://icons.iconarchive.com/icons/mad-science/arcade-saturdays/32/Edible-Ghost-icon.png')";

      playerElement.classList.add('playeras');
      gameBoard.appendChild(playerElement);
    }, time);
  }
}
