import { MortalState } from "./mortalState";

export interface PlayerState{
  flag:boolean;
  getState():any;
  changeState():any;
}
