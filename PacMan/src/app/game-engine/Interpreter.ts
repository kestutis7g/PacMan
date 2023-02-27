import { GameBoardComponent } from '../game-board/game-board.component';
import { AbstractPlayer, Player } from './Entities/player';
import { ClumsyInput } from './MoveAlgorithm/ClumsyInput';
import { CorrectInput } from './MoveAlgorithm/CorrectInput';

// export class Context {
//   x: number;
//   y: number;
//   immortal = false;
//   player: Player;

//   constructor(x: number, y: number, player: Player) {
//     this.x = x;
//     this.y = y;
//     this.player = player
//   }
// }

export interface IExpression {
  Interpret(): any;
}

export class GiveExpresion implements IExpression {
  constructor(
    player: AbstractPlayer,
    correctInput: CorrectInput,
    clumsyInput: ClumsyInput,
    token: string[]
  ) {
    this.player = player;
    this.token = token;
    this.correctInput = correctInput;
    this.clumsyInput = clumsyInput;
  }
  player: AbstractPlayer;
  token: string[];
  correctInput: CorrectInput;
  clumsyInput: ClumsyInput;

  Interpret(): any {
    if (
      this.token[0] == 'correct_movement' ||
      this.token[0] == 'correct_input'
    ) {
      this.player.changeMovement(this.correctInput);
    } else if (
      this.token[0] == 'clumsy_movement' ||
      this.token[0] == 'clumsy_input'
    ) {
      this.player.changeMovement(this.clumsyInput);
    } else if (this.token[0] == 'points') {
      if (parseInt(this.token[1])) {
        this.player.score += parseInt(this.token[1]);
      } else {
        return 'invalid give points command';
      }
    } else if (this.token[0] == 'health') {
      if (parseInt(this.token[1])) {
        //this.gameBoard.player!.moveAlgorithm.moveAlgorithm('ArrowUp');
        return 'not implamented';
      } else if (this.token[1] == 'max') {
        return 'not implamented';
      } else {
        return 'invalid give health command';
      }
    } else {
      return 'invalid give command';
    }
  }
}
export class RemoveExpresion implements IExpression {
  constructor(
    player: AbstractPlayer,
    correctInput: CorrectInput,
    clumsyInput: ClumsyInput,
    token: string[]
  ) {
    this.player = player;
    this.token = token;
    this.correctInput = correctInput;
    this.clumsyInput = clumsyInput;
  }
  player: AbstractPlayer;
  token: string[];
  correctInput: CorrectInput;
  clumsyInput: ClumsyInput;

  Interpret(): any {
    if (
      this.token[0] == 'correct_movement' ||
      this.token[0] == 'correct_input'
    ) {
      this.player.changeMovement(this.clumsyInput);
    } else if (
      this.token[0] == 'clumsy_movement' ||
      this.token[0] == 'clumsy_input'
    ) {
      this.player.changeMovement(this.correctInput);
    } else if (this.token[0] == 'points') {
      if (parseInt(this.token[1])) {
        this.player.score -= parseInt(this.token[1]);
      } else {
        return 'invalid remove points command';
      }
    } else if (this.token[0] == 'health') {
      if (parseInt(this.token[1])) {
        return 'not implamented';
      } else {
        return 'invalid remove health command';
      }
    } else {
      return 'invalid remove command';
    }
  }
}
export class TeleportExpresion implements IExpression {
  constructor(player: AbstractPlayer, token: string[]) {
    this.player = player;
    this.token = token;
  }
  player: AbstractPlayer;
  token: string[];

  Interpret(): any {
    if (parseInt(this.token[0]) && parseInt(this.token[1])) {
      this.player.body.x = parseInt(this.token[0]);
      this.player.body.y = parseInt(this.token[1]);
    } else {
      return 'invalid tp command';
    }
  }
}
export class MoveExpresion implements IExpression {
  constructor(player: AbstractPlayer, token: string[]) {
    this.player = player;
    this.token = token;
  }
  player: AbstractPlayer;
  token: string[];

  Interpret(): any {
    if (this.token[0] == 'up') {
      this.player.body.y -= 1;
    } else if (this.token[0] == 'down') {
      this.player.body.y += 1;
    } else if (this.token[0] == 'left') {
      this.player.body.x -= 1;
    } else if (this.token[0] == 'right') {
      this.player.body.x += 1;
    } else {
      return 'invalid move command';
    }
  }
}

export class PlayerExpresion implements IExpression {
  constructor(
    player: AbstractPlayer,
    correctInput: CorrectInput,
    clumsyInput: ClumsyInput,
    token: string[]
  ) {
    this.player = player;
    this.token = token;
    this.correctInput = correctInput;
    this.clumsyInput = clumsyInput;
  }
  player: AbstractPlayer;
  token: string[];
  correctInput: CorrectInput;
  clumsyInput: ClumsyInput;

  Interpret(): any {
    let expression;

    if (this.token[0] == 'tp') {
      this.token.splice(0, 1);
      expression = new TeleportExpresion(this.player, this.token);
      return expression.Interpret();
    } else if (this.token[0] == 'move') {
      this.token.splice(0, 1);
      expression = new MoveExpresion(this.player, this.token);
      return expression.Interpret();
    } else if (this.token[0] == 'give') {
      this.token.splice(0, 1);
      expression = new GiveExpresion(
        this.player,
        this.correctInput,
        this.clumsyInput,
        this.token
      );
      return expression.Interpret();
    } else if (this.token[0] == 'remove') {
      this.token.splice(0, 1);
      expression = new RemoveExpresion(
        this.player,
        this.correctInput,
        this.clumsyInput,
        this.token
      );
      return expression.Interpret();
    } else {
      return 'invalid player command';
    }
  }
}

export class ExpressionParser {
  constructor(
    player: AbstractPlayer,
    opponent: AbstractPlayer,
    correctInput: CorrectInput,
    clumsyInput: ClumsyInput
  ) {
    this.player = player;
    this.opponent = opponent;
    this.correctInput = correctInput;
    this.clumsyInput = clumsyInput;
  }
  player: AbstractPlayer;
  opponent: AbstractPlayer;
  correctInput: CorrectInput;
  clumsyInput: ClumsyInput;

  parse(command: string): any {
    let token: string[] = command.split(' ');
    for (let i = 0; i < token.length; i++) {
      if (token[i] == '') {
        token.splice(i, 1);
        i--;
      }
    }

    let expression;

    if (token[0] == 'player') {
      token.splice(0, 1);
      expression = new PlayerExpresion(
        this.player,
        this.correctInput,
        this.clumsyInput,
        token
      );
      return expression.Interpret();
    } else if (token[0] == 'opponent') {
      token.splice(0, 1);
      expression = new PlayerExpresion(
        this.opponent,
        this.correctInput,
        this.clumsyInput,
        token
      );
      return expression.Interpret();
    } else {
      return 'invalid command';
    }
  }
}
