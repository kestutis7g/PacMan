import { Wall } from 'src/app/game-engine/Environment/Decorator';
import { Blob } from 'src/app/game-engine/Entities/Mobs/Blob/blobEntity.model';
import { Player } from 'src/app/game-engine/Entities/player';
import BlobBuilder from '../Blob/BlobBuilder';
import { FacadeService } from 'src/app/core/services/facade.service';

// generuos standartinius blobus tik leis pasirinkt ju spalva.
export class StandartBob {
  blob?: Blob;
  wall: Wall;
  player: Player;
  mapId: string;

  constructor(
    wall: Wall,
    player: Player,
    private facadeService: FacadeService,
    mapId: string
  ) {
    this.wall = wall;
    this.player = player;
    this.mapId = mapId;
  }
  generateRedBlob() {
    this.blob = new BlobBuilder(this.wall, this.facadeService, this.mapId)
      .setColor('red')
      .setCoordinates(this.player, this.wall)
      .setType('default')
      .getResult();
    this.blob.name = 'GhostRed';
    return this.blob;
  }
  generateBlueBlob() {
    this.blob = new BlobBuilder(this.wall, this.facadeService, this.mapId)
      .setColor('blue')
      .setCoordinates(this.player, this.wall)
      .setType('default')
      .getResult();
    this.blob.name = 'GhostBlue';
    return this.blob;
  }

  generatePinkBlob() {
    this.blob = new BlobBuilder(this.wall, this.facadeService, this.mapId)
      .setColor('pink')
      .setCoordinates(this.player, this.wall)
      .setType('default')
      .getResult();
    this.blob.name = 'GhostPink';
    return this.blob;
  }
  generateYellowBlob() {
    this.blob = new BlobBuilder(this.wall, this.facadeService, this.mapId)
      .setColor('yellow')
      .setCoordinates(this.player, this.wall)
      .setType('default')
      .getResult();
    this.blob.name = 'GhostYellow';
    return this.blob;
  }
}
/*
  this.blob2 = new BlobBuilder(wall)
      .setColor('blue')
      .setCoordinates(this.player, wall)
      .setType('default')
      .getResult();
    this.blob3 = new BlobBuilder(wall)
      .setColor('pink')
      .setCoordinates(this.player, wall)
      .setType('default')
      .getResult();
    this.blob4 = new BlobBuilder(wall)
      .setColor('yellow')
      .setCoordinates(this.player, wall)
      .setType('default')
      .getResult();
      */
