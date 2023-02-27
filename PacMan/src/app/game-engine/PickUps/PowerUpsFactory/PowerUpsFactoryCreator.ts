import { Wall } from '../../Environment/Decorator';
import { IPowerUp, PowerUp1, PowerUp2, PowerUp3 } from './PowerUps';
import {
  IHeal,
  HealMapOne,
  HealMapTwo,
  HealMapThree,
} from '../Heals-Factory/Heal';
import { FacadeService } from 'src/app/core/services/facade.service';

export abstract class PickUpsFactory {
  public player;
  public wall;
  constructor(player: any, wall: Wall) {
    this.player = player;
    this.wall = wall;
  }
  public createPowerUp(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ) {
    return;
  }
  public createHeal(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ) {
    return;
  }
}
export class PickUpsFactoryMap1 extends PickUpsFactory {
  public override createPowerUp(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ): IPowerUp {
    return new PowerUp1(player, wall, name, facadeService);
  }
  public override createHeal(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ): IHeal {
    return new HealMapOne(player, wall, name, facadeService);
  }
}

export class PickUpsFactoryMap2 extends PickUpsFactory {
  public override createPowerUp(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ): IPowerUp {
    return new PowerUp2(player, wall, name, facadeService);
  }
  public override createHeal(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ): IHeal {
    return new HealMapTwo(player, wall, name, facadeService);
  }
}

export class PickUpsFactoryMap3 extends PickUpsFactory {
  public override createPowerUp(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ): IPowerUp {
    return new PowerUp3(player, wall, name, facadeService);
  }
  public override createHeal(
    player: any,
    wall: any,
    name: string,
    facadeService: FacadeService
  ): IHeal {
    return new HealMapThree(player, wall, name, facadeService);
  }
}
