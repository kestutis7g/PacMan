import { Blob } from 'src/app/game-engine/Entities/Mobs/Blob/blobEntity.model';
import { Wall } from 'src/app/game-engine/Environment/Decorator';
import { Player } from 'src/app/game-engine/Entities/player';

export interface IBlobBuilder {
  blob: Blob;
  setColor(color: string): this;
  setType(type: string): this;
  setCoordinates(player: Player, wall: Wall): this;
  getResult(): Blob;
}
