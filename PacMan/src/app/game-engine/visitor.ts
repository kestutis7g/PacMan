import { Blob } from './Entities/Mobs/Blob/blobEntity.model';
import {
  Ghost,
  iGhostMegaEntity,
} from './Entities/Mobs/Blob/ghostMegaEntity.model';

export interface Component {
  accept(visitor: Visitor): void;
}

export interface Visitor {
  visitConcreteComponentA(element: Ghost, time: number, gameBoard: any): void;

  visitConcreteComponentB(element: Blob, time: number): void;
}
export class ConcreteVisitor1 implements Visitor {
  public visitConcreteComponentA(
    element: Ghost,
    time: number,
    gameBoard: any
  ): void {
    element.ghostRage(time, gameBoard);
  }

  public visitConcreteComponentB(element: Blob, time: number): void {
    element.blobRage(time);
  }
}

export class ConcreteVisitor2 implements Visitor {
  public visitConcreteComponentA(
    element: Ghost,
    time: number,
    gameBoard: any
  ): void {
    element.ghostRage(time, gameBoard);
  }
  public visitConcreteComponentB(element: Blob, time: number): void {
    element.blobRage(time);
  }
}
