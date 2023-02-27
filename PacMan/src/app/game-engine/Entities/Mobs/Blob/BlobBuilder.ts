import { IBlobBuilder } from 'src/app/game-engine/Entities/Mobs/Blob/IBlobBuilder';
import { Blob } from 'src/app/game-engine/Entities/Mobs/Blob/blobEntity.model';
import { Wall } from 'src/app/game-engine/Environment/Decorator';
import { Player } from 'src/app/game-engine/Entities/player';
import { FacadeService } from 'src/app/core/services/facade.service';
export default class BlobBuilder implements IBlobBuilder {
  blob: Blob;
  constructor(wall: Wall, private facadeService: FacadeService, mapId: string) {
    this.blob = new Blob(wall, facadeService, mapId);
  }
  setColor(color: string): this {
    this.blob.color = color;
    return this;
  }
  setType(type: string): this {
    this.blob.type = type;
    return this;
  }
  setCoordinates(player: Player, walls: Wall): this {
    this.blob.setRandomPosition(player, walls);
    return this;
  }
  getResult(): Blob {
    return this.blob;
  }
}
