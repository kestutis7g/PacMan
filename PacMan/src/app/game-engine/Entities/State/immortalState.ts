import { MortalState } from "./mortalState";
import { PlayerState } from "./playerState";
export class ImmortalState implements PlayerState{
  flag;
  constructor(){
    this.flag =false;
  }

  public getState(){
    return this.flag;
  }

  public changeState() {
    return new MortalState();
  }
}
