import { FacadeService } from 'src/app/core/services/facade.service';
import { AbstractPlayer } from './player';

export class Opponent extends AbstractPlayer {
  override body = { x: -1, y: -1 };

  update() {
    this.getPosition();
  }

  draw(gameBoard: any) {
    const playerElement = document.createElement('div');
    playerElement.style.gridRowStart = this.body.y.toString();
    playerElement.style.gridColumnStart = this.body.x.toString();
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/ph03nyx/super-mario/32/Retro-Mushroom-Super-3-icon.png')"
    //playerElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/ph03nyx/super-mario/32/Retro-Mushroom-1UP-3-icon.png')";
    //playerElement.style.backgroundImage = "url('../../assets/icons/luigi.png')";
    playerElement.style.backgroundImage =
      "url('https://i.pinimg.com/originals/f5/75/2c/f5752c7c9f03832209f0bb8b57214281.gif')";
    playerElement.style.backgroundSize = 'cover';
    playerElement.classList.add('opponentas');
    gameBoard.appendChild(playerElement);
  }

  getOpponentBody() {
    return this.body;
  }

  onPlayer(position: any) {
    return this.equalPositions(this.body, position);
  }

  equalPositions(pos1: any, pos2: any) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  getPosition() {
    this.facadeService.signalRService.coordinatesReceived.subscribe(
      (message) => {
        var data = message.message.split(' ');
        if (
          data[0] == sessionStorage.getItem('lobbyId') &&
          data[1] != sessionStorage.getItem('playerName') &&
          data[2] == this.progressMap.toString()
        ) {
          this.body.x = Number(data[3]);
          this.body.y = Number(data[4]);
        }
        if (
          data[0] == sessionStorage.getItem('lobbyId') &&
          data[1] != sessionStorage.getItem('playerName') &&
          data[2] != this.progressMap.toString()
        ) {
          this.body.x = -1;
          this.body.y = -1;
        }
      }
    );
  }
}
