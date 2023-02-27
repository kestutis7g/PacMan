import {
  Receiver,
  CommandUp,
  CommandDown,
  CommandLeft,
  CommandRight,
  Invoker,
} from './Command';
import { IMoveAlgorithm } from './IMoveAlgorithm';

export class CorrectInput implements IMoveAlgorithm {
  constructor() {
    this.Invoker.register('up', this.CommandUp);
    this.Invoker.register('down', this.CommandDown);
    this.Invoker.register('left', this.CommandLeft);
    this.Invoker.register('right', this.CommandRight);
    this.getInputs();
  }
  Receiver = new Receiver();
  CommandUp = new CommandUp(this.Receiver);
  CommandDown = new CommandDown(this.Receiver);
  CommandLeft = new CommandLeft(this.Receiver);
  CommandRight = new CommandRight(this.Receiver);

  Invoker = new Invoker();

  getInputs() {
    window.addEventListener('keydown', (e) => {
      this.moveAlgorithm(e.key);
    });
  }

  moveAlgorithm(direction: String) {
    switch (direction) {
      case 'ArrowUp':
        this.Invoker.execute('up');
        break;
      case 'ArrowDown':
        this.Invoker.execute('down');
        break;
      case 'ArrowLeft':
        this.Invoker.execute('left');
        break;
      case 'ArrowRight':
        this.Invoker.execute('right');
        break;
    }
  }

  getInputDirection() {
    return this.Receiver.inputDirection;
  }

  resetDirection() {
    this.Receiver.inputDirection = { x: 0, y: 0 };
  }
}
