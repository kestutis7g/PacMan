import { FacadeService } from 'src/app/core/services/facade.service';
import { Visitor } from 'src/app/game-engine/visitor';
import { GameObject } from 'src/app/models/game.types';
import { Wall } from '../../../Environment/Decorator';
import { randomGridPosition } from '../../../gameboard-grid.util';
import { Player } from '../../player';

export class Blob {
  public color = '';
  public type = '';
  public name?: string;
  public blobBody = { x: 0, y: 0 };
  lastRenderTime = 0;
  movetime = 5;

  gameObjects: string = '';
  mapId: string;

  constructor(
    public walls: Wall,
    private facadeService: FacadeService,
    mapId: string
  ) {
    this.mapId = mapId;
  }
  public accept(visitor: Visitor, time: number): void {
    visitor.visitConcreteComponentB(this, time);
  }
  draw(gameBoard: any) {
    const playerElement = document.createElement('div');
    playerElement.style.gridRowStart = this.blobBody.y.toString();
    playerElement.style.gridColumnStart = this.blobBody.x.toString();
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/bokehlicia/captiva/32/games-icon.png')"
    if (this.color == 'red')
      playerElement.style.backgroundImage =
        "url('https://i.imgur.com/aAOhJxn.png')";
    if (this.color == 'blue')
      //playerElement.style.backgroundImage = "url('https://imgur.com/j2rczNm.png')";
      playerElement.style.backgroundImage =
        "url('https://icons.iconarchive.com/icons/mad-science/arcade-saturdays/32/Edible-Ghost-icon.png')";

    if (this.color == 'pink')
      playerElement.style.backgroundImage =
        "url('https://icons.iconarchive.com/icons/mad-science/arcade-saturdays/32/Speedy-Pinky-icon.png')";
    if (this.color == 'yellow')
      playerElement.style.backgroundImage =
        "url('https://icons.iconarchive.com/icons/mad-science/arcade-saturdays/32/Pokey-Clyde-icon.png')";
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/ph03nyx/super-mario/32/Retro-Mushroom-Super-3-icon.png')"
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
        this.blobBody = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
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
    this.blobBody = newPosition;
  }
  start() {
    this.update();

    var gameObject: GameObject = {
      name: this.name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.blobBody.x,
      y: this.blobBody.y,
      parameters: this.mapId,
    };
    this.facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  randomIntBinary(max: number) {
    return Math.floor(Math.random() * max);
  }

  public blobRage(time: number): void {
    this.movetime = 200;

    setTimeout(() => {
      this.movetime = 5;
    }, time);
  }
  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
      () => console.log('fired')
    );
  }
}
