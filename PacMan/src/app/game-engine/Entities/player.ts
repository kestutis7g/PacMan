import { FacadeService } from 'src/app/core/services/facade.service';
import { ChatMessage } from 'src/app/models/chatMessage.model';
import { GameObject } from 'src/app/models/game.types';
import { Wall } from '../Environment/Decorator';
import { fixOutsidePosition, outsideGrid } from '../gameboard-grid.util';
import { IMoveAlgorithm } from '../MoveAlgorithm/IMoveAlgorithm';
import { IHeal } from '../PickUps/Heals-Factory/Heal';
import { MortalState } from './State/mortalState';
import { PlayerState } from './State/playerState';

export abstract class AbstractPlayer {
  constructor(public facadeService: FacadeService, public progressMap: string) {
    this.state = new MortalState();
  }

  body = { x: 13, y: 16 };
  score = 0;
  state?: PlayerState;

  changeMovement(moveAlgorithm: IMoveAlgorithm) {}
}

export class Player extends AbstractPlayer {
  constructor(
    override facadeService: FacadeService,
    override progressMap: string,
    public walls: Wall,
    movealgorithm: IMoveAlgorithm,
    name: string
  ) {
    super(facadeService, progressMap);
    this.moveAlgorithm = movealgorithm;
    this.name = name;

    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.body.x,
      y: this.body.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);
  }

  name: string;
  moveAlgorithm: IMoveAlgorithm;
  update() {
    const inputDirection = this.moveAlgorithm.getInputDirection();
    this.moveAlgorithm.resetDirection();

    //Collision
    if (
      !this.walls.onObject({
        x: this.body.x + inputDirection.x,
        y: this.body.y + inputDirection.y,
      })
    ) {
      this.body.x += inputDirection.x;
      this.body.y += inputDirection.y;
    }

    if (outsideGrid(this.body)) {
      this.body = fixOutsidePosition(this.body);
    }

    this.sendPosition(this.body.x.toString() + ' ' + this.body.y.toString());

    // let lobbyId = sessionStorage.getItem('lobbyId')!;
    // this.facadeService.mediatorService.updateGameObject(lobbyId, {
    //   name: this.name,
    //   x: this.body.x,
    //   y: this.body.y,
    // });

    //console.log(inputDirection);
  }

  draw(gameBoard: any) {
    const playerElement = document.createElement('div');
    playerElement.style.gridRowStart = this.body.y.toString();
    playerElement.style.gridColumnStart = this.body.x.toString();
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/bokehlicia/captiva/32/games-icon.png')"
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/ph03nyx/super-mario/32/Retro-Mario-2-icon.png')";
    playerElement.style.backgroundImage =
      "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/dee38e10-db68-462d-9df7-46b87d4c7876/ddxh2po-85a87439-ac1f-49d7-a828-6b78d768b403.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2RlZTM4ZTEwLWRiNjgtNDYyZC05ZGY3LTQ2Yjg3ZDRjNzg3NlwvZGR4aDJwby04NWE4NzQzOS1hYzFmLTQ5ZDctYTgyOC02Yjc4ZDc2OGI0MDMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TGsrcvN8-1L5EmrOSnRRtcffJfUkkdFtLzztr_mjy5Q')";
    //playerElement.style.backgroundImage = "url('https://uploads.scratch.mit.edu/users/avatars/62496627.png')";
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/ph03nyx/super-mario/32/Retro-Mushroom-Super-3-icon.png')"
    playerElement.style.backgroundSize = 'cover';

    playerElement.classList.add('playeras');
    gameBoard.appendChild(playerElement);
  }

  get currentScore() {
    return this.score;
  }

  changePlayerState() {
    this.state = this.state?.changeState();
  }

  override changeMovement(moveAlgorithm: IMoveAlgorithm) {
    this.moveAlgorithm = moveAlgorithm;
    this.moveAlgorithm.resetDirection();
    //this.update();
  }
  getPlayer() {
    return this.body;
  }

  onPlayer(position: any) {
    return this.equalPositions(this.body, position);
  }

  equalPositions(pos1: any, pos2: any) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  sendPosition(direction: string) {
    this.facadeService.signalRService.sendCoordinates(
      new ChatMessage(
        sessionStorage.getItem('lobbyId') +
          ' ' +
          sessionStorage.getItem('playerName') +
          ' ' +
          this.progressMap +
          ' ' +
          direction
      )
    );
  }

  checkblob(
    blob1?: any,
    blob2?: any,
    blob3?: any,
    blob4?: any,
    heal?: IHeal,
    healClone?: IHeal
  ) {
    //console.log(this.state?.getState())
    if (this.state?.getState()) {
      if (
        (this.body.x == blob1.x && this.body.y == blob1.y) ||
        (this.body.x == blob2.x && this.body.y == blob2.y) ||
        (this.body.x == blob3.x && this.body.y == blob3.y) ||
        (this.body.x == blob4.x && this.body.y == blob4.y)
      ) {
        if (heal != null && healClone != null) {
          heal.minusHealth = 1;
          //console.log('numinusavo');
          this.changePlayerState();
          setTimeout(() => {
            this.changePlayerState();
            console.log('Immortal efektas beigesi po 2 sekundziu');
          }, 2000);
        }
      }
    }
  }
}
