interface ICommand {
  execute(): void;
  undo(): void;
}

export class CommandUp implements ICommand {
  #receiver: Receiver;
  constructor(receiver: Receiver) {
    this.#receiver = receiver;
  }
  execute() {
    this.#receiver.Up();
  }
  undo() {
    this.#receiver.Down();
  }
}
export class CommandDown implements ICommand {
  #receiver: Receiver;
  constructor(receiver: Receiver) {
    this.#receiver = receiver;
  }
  execute() {
    this.#receiver.Down();
  }
  undo() {
    this.#receiver.Up();
  }
}
export class CommandLeft implements ICommand {
  #receiver: Receiver;
  constructor(receiver: Receiver) {
    this.#receiver = receiver;
  }
  execute() {
    this.#receiver.Left();
  }
  undo() {
    this.#receiver.Right();
  }
}
export class CommandRight implements ICommand {
  #receiver: Receiver;
  constructor(receiver: Receiver) {
    this.#receiver = receiver;
  }
  execute() {
    this.#receiver.Right();
  }
  undo() {
    this.#receiver.Left();
  }
}

export class Invoker {
  #commands: { [id: string]: ICommand };
  constructor() {
    this.#commands = {};
  }
  register(commandName: string, command: ICommand) {
    this.#commands[commandName] = command;
  }
  execute(commandName: string) {
    if (commandName in this.#commands) {
      this.#commands[commandName].execute();
    } else {
      console.log(`Command [${commandName}] not recognised`);
    }
  }
  undo(commandName: string) {
    if (commandName in this.#commands) {
      this.#commands[commandName].undo();
    } else {
      console.log(`Command [${commandName}] not recognised`);
    }
  }
}
export class Receiver {
  inputDirection = { x: 0, y: 0 };

  Up() {
    this.inputDirection = { x: 0, y: -1 };
  }
  Down() {
    this.inputDirection = { x: 0, y: 1 };
  }
  Left() {
    this.inputDirection = { x: -1, y: 0 };
  }
  Right() {
    this.inputDirection = { x: 1, y: 0 };
  }
}
