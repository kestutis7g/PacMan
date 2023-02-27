class Memento {
  // A container of state
  state: string;
  constructor(state: string) {
    this.state = state;
  }
}

export class Originator {
  // The Object in the application whose state changes

  #state: string;

  constructor() {
    this.#state = '';
  }

  public get state(): string {
    return this.#state;
  }

  public set state(value: string) {
    this.#state = value;
    console.log(`Originator: Set state to '${value}'`);
  }

  public get memento(): Memento {
    console.log('Originator: Providing Memento of state to caretaker.');
    return new Memento(this.#state);
  }

  public set memento(value: Memento) {
    this.#state = value.state;
    console.log(
      `Originator: State after restoring from Memento: '${this.#state}'`
    );
  }
}

export class CareTaker {
  // Guardian. Provides a narrow interface to the mementos

  #originator: Originator;
  #mementos: Memento[];

  constructor(originator: Originator) {
    this.#originator = originator;
    this.#mementos = [];
  }

  create() {
    // Store a new Memento of the Originators current state
    console.log('CareTaker: Getting a copy of Originators current state');
    const memento = this.#originator.memento;
    this.#mementos.push(memento);
  }

  restore(index: number) {
    // Replace the Originators current state with the state stored in the saved Memento
    console.log('CareTaker: Restoring Originators state from Memento');
    const memento = this.#mementos[index];
    this.#originator.memento = memento;
  }
}
