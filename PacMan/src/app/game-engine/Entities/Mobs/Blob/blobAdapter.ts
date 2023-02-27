import { Wall } from '../../../Environment/Decorator';
import { randomGridPosition } from '../../../gameboard-grid.util';
import { Blob } from './blobEntity.model';
import { iGhostMegaEntity } from './ghostMegaEntity.model';
import { Player } from '../../player';
import { FacadeService } from 'src/app/core/services/facade.service';
import { GameObject } from 'src/app/models/game.types';
import { Visitor } from 'src/app/game-engine/visitor';

export class BlobAdapter implements iGhostMegaEntity {
  blob?: Blob;

  constructor(
    blob: Blob,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService,
    mapId: string
  ) {
    this.blob = blob;
    this.mapId = mapId;
    this.name = name;
  }
  public color = '';
  public type = '';
  name: string;
  public ghostBody = { x: 0, y: 0 };

  gameObjects: string = '';
  mapId: string;

  backGroundImage =
    "url('https://icons.iconarchive.com/icons/mad-science/arcade-saturdays/32/Edible-Ghost-icon.png')";
  lastRenderTime = 0;
  newSegments = 0;
  movetime = 5;

  getBackgroundImage(url: string): string {
    return url;
  }
  public accept(visitor: Visitor, time: number): void {
    visitor.visitConcreteComponentB(this.blob!, time);
  }
  draw(gameBoard: any) {
    const playerElement = document.createElement('div');
    playerElement.style.gridRowStart = this.ghostBody.y.toString();
    playerElement.style.gridColumnStart = this.ghostBody.x.toString();
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/bokehlicia/captiva/32/games-icon.png')"
    playerElement.style.backgroundImage = this.backGroundImage;
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

    var gameObject: GameObject = {
      name: this.name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.ghostBody.x,
      y: this.ghostBody.y,
      parameters: this.mapId,
    };
    this.facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
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
    this.ghostBody = newPosition;
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  randomIntBinary(max: number) {
    return Math.floor(Math.random() * max);
  }

  ghostRage(time: number, gameBoard: any): void {
    this.backGroundImage = "url('https://imgur.com/6r4Qclw.png')";
    this.movetime = 1000;

    setTimeout(() => {
      this.movetime = 5;
      this.backGroundImage =
        "url('https://icons.iconarchive.com/icons/mad-science/arcade-saturdays/32/Edible-Ghost-icon.png')";
    }, time);
  }
}
