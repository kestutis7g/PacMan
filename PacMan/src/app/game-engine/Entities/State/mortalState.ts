import { ImmortalState } from "./immortalState";
import { PlayerState } from "./playerState";
export class MortalState implements PlayerState{
  flag;
  constructor(){
    this.flag =true;
  }
  public getState(){
    return this.flag;
  }
  public changeState() {
    return new ImmortalState()
  }

}
