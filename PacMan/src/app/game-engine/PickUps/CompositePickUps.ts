import { randomGridPosition } from '../gameboard-grid.util';
import { Wall } from '../Environment/Decorator';
import { IMoveAlgorithm } from 'src/app/game-engine/MoveAlgorithm/IMoveAlgorithm';
import {
  IPowerUp,
  PowerUp1,
  PowerUp2,
  PowerUp3,
} from 'src/app/game-engine/PickUps/PowerUpsFactory/PowerUps';
import {
  IHeal,
  HealMapOne,
  HealMapTwo,
  HealMapThree,
} from 'src/app/game-engine/PickUps/Heals-Factory/Heal';
import { PickUpsFactory } from 'src/app/game-engine/PickUps/PowerUpsFactory/PowerUpsFactoryCreator';
import {
  Component,
  ConcreteVisitor1,
  ConcreteVisitor2,
  Visitor,
} from '../visitor';

export abstract class PickUp {
  protected parent!: PickUp | null;
  name!: string;

  /**
   * Optionally, the base Component can declare an interface for setting and
   * accessing a parent of the component in a tree structure. It can also
   * provide some default implementation for these methods.
   */
  public setParent(parent: PickUp | null) {
    this.parent = parent;
  }

  public getParent(): PickUp | null {
    return this.parent;
  }

  /**
   * In some cases, it would be beneficial to define the child-management
   * operations right in the base Component class. This way, you won't need to
   * expose any concrete component classes to the client code, even during the
   * object tree assembly. The downside is that these methods will be empty
   * for the leaf-level components.
   */
  public add(component: PickUp): void {}

  public remove(component: PickUp): void {}

  /**
   * You can provide a method that lets the client code figure out whether a
   * component can bear children.
   */
  public isComposite(): boolean {
    return false;
  }

  /**
   * The base Component may implement some default behavior or leave it to
   * concrete classes (by declaring the method containing the behavior as
   * "abstract").
   */
  public operation(): string {
    return this.name;
  }
}

/**
 * Leaf #1
 */
export class PowerUp1Leaf extends PickUp {
  public powerup: any;
  public player;
  constructor(player: any, public walls: Wall) {
    super();
    this.player = player;
    this.powerup = this.getRandomPosition();
  }

  update() {
    if (
      this.player.onPlayer(this.powerup) ||
      this.walls.onObject(this.powerup)
    ) {
      this.powerup = this.getRandomPosition();
      this.effect();
    }
  }

  getRandomPosition() {
    let newFoodPosition;
    while (
      newFoodPosition == null ||
      this.player.onPlayer(newFoodPosition) ||
      this.walls.onObject(newFoodPosition)
    ) {
      newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
  }

  draw(gameBoard: any) {
    const powerupelement = document.createElement('div');
    powerupelement.style.gridRowStart = this.powerup.y;
    powerupelement.style.gridColumnStart = this.powerup.x;
    powerupelement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/ph03nyx/super-mario/128/Retro-P-Wing-icon.png')";
    powerupelement.style.backgroundSize = 'cover';
    powerupelement.classList.add('powerups');
    gameBoard.appendChild(powerupelement);
  }

  effect() {
    this.player.changePlayerState();
    setTimeout(() => {
      this.player.changePlayerState();
      console.log('Immortal efektas beigesi po 15 sekundziu');
    }, 15000);
  }

  public override operation(): string {
    return 'PowerUp Leaf ';
  }
}

/**
 * Leaf #2
 */
export class HealMapOneLeaf extends PickUp {
  public heal: any;
  public player;
  health = 5;

  constructor(player: any, public walls: Wall) {
    super();
    this.player = player;
    this.heal = this.getRanomHealPosition();
  }

  update() {
    if (this.player.onPlayer(this.heal)) {
      this.heal = this.getRanomHealPosition();
      this.addHealth = 1;
    }
  }

  draw(gameBoard: any) {
    const healElement = document.createElement('div');
    healElement.style.gridRowStart = this.heal.y;
    healElement.style.gridColumnStart = this.heal.x;
    healElement.style.backgroundImage =
      "url('https://cdn.pixabay.com/photo/2017/09/23/16/33/pixel-heart-2779422_1280.png')";
    healElement.style.backgroundSize = 'cover';
    healElement.classList.add('heal');
    gameBoard.appendChild(healElement);
  }

  getRanomHealPosition() {
    let newFoodPosition;
    while (
      newFoodPosition == null ||
      this.player.onPlayer(newFoodPosition) ||
      this.walls.onObject(newFoodPosition)
    ) {
      newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
  }
  set addHealth(val: number) {
    if (this.health < 5) {
      this.health += val;
    }
  }
  get currentHealth() {
    return this.health;
  }

  set minusHealth(val: number) {
    if (this.health > 0) {
      this.health -= val;
    }
  }
  public override operation(): string {
    return 'Heal Leaf ';
  }
}

/**
 * Leaf #3
 */
export class AntidoteFoodLeaf extends PickUp {
  EXPANSION_RATE = 1;
  AntidoteFood: any;
  player;
  correctInput?: IMoveAlgorithm;
  constructor(player: any, public walls: Wall, correctInput: IMoveAlgorithm) {
    super();
    this.player = player;
    this.AntidoteFood = this.getRandomFoodPosition();
    this.correctInput = correctInput;
  }

  update(blob1?: any, ghostBlob?: any, blob3?: any, blob4?: any) {
    if (this.player.onPlayer(this.AntidoteFood)) {
      this.player.changeMovement(this.correctInput);
      //setTimeout(() => { console.log('hello'); }, 10000)
      //this.player.changeMovement(new CorrectInput);
      this.AntidoteFood = this.getRandomFoodPosition();
    }
    if (this.walls.onObject(this.AntidoteFood)) {
      this.AntidoteFood = this.getRandomFoodPosition();
    }
  }

  draw(gameBoard: any) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.AntidoteFood.y;
    foodElement.style.gridColumnStart = this.AntidoteFood.x;
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/iconfactory/kidcons/32/Medicine-icon.png')";
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/yusuke-kamiyamane/fugue/16/poison-green-icon.png')"
    foodElement.style.backgroundSize = 'cover';

    foodElement.classList.add('antidotefoodas');
    gameBoard.appendChild(foodElement);
  }

  getRandomFoodPosition() {
    let newFoodPosition;
    while (
      newFoodPosition == null ||
      this.player.onPlayer(newFoodPosition) ||
      this.walls.onObject(newFoodPosition)
    ) {
      newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
  }

  getPosition() {
    return this.AntidoteFood;
  }

  public override operation(): string {
    return 'Antidote Leaf';
  }
}

export class PickUpsFactoryMap1Leaf extends PickUpsFactory {
  public override createPowerUp(player: any, wall: any): PickUp {
    return new PowerUp1Leaf(player, wall);
  }
  public override createHeal(player: any, wall: any): PickUp {
    return new HealMapOneLeaf(player, wall);
  }
}

/**
 * Leaf #4 (2.1)
 */
export class ClumsyFoodLeaf extends PickUp {
  EXPANSION_RATE = 1;
  ClumsyFood: any;
  player;
  clumsyInput?: IMoveAlgorithm;

  visitor1 = new ConcreteVisitor1();
  visitor2 = new ConcreteVisitor2();

  constructor(player: any, public walls: Wall, clumsyInput: IMoveAlgorithm) {
    super();
    this.player = player;
    this.ClumsyFood = this.getRandomFoodPosition();
    this.clumsyInput = clumsyInput;
  }

  update(blob1?: any, ghostBlob?: any, blob3?: any, blob4?: any) {
    const components = [blob1, ghostBlob, blob3, blob4];
    if (this.player.onPlayer(this.ClumsyFood)) {
      this.player.changeMovement(this.clumsyInput);
      //setTimeout(() => { console.log('hello'); }, 10000)
      //this.player.changeMovement(new CorrectInput);
      this.ClumsyFood = this.getRandomFoodPosition();

      // blob1.blobRage(10000);
      // ghostBlob.ghostRage(10000);
      // blob3.blobRage(10000);
      // blob4.blobRage(10000);
      this.rageController(components, this.visitor2);
    }
    if (this.walls.onObject(this.ClumsyFood)) {
      this.ClumsyFood = this.getRandomFoodPosition();
    }
  }
  rageController(components: Component[], visitor: Visitor) {
    // ...
    for (const component of components) {
      component.accept(visitor);
    }
  }
  draw(gameBoard: any) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = this.ClumsyFood.y;
    foodElement.style.gridColumnStart = this.ClumsyFood.x;
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/mozco/symbolic-objects/32/Poison-icon.png')";
    foodElement.style.backgroundSize = 'cover';
    foodElement.classList.add('clumsyfoodas');
    gameBoard.appendChild(foodElement);
  }

  getRandomFoodPosition() {
    let newFoodPosition;
    while (
      newFoodPosition == null ||
      this.player.onPlayer(newFoodPosition) ||
      this.walls.onObject(newFoodPosition)
    ) {
      newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
  }

  getPosition() {
    return this.ClumsyFood;
  }
  public override operation(): string {
    return 'Clumsy food (poison) Leaf';
  }
}

/**
 * The Composite class represents the complex components that may have children.
 * Usually, the Composite objects delegate the actual work to their children and
 * then "sum-up" the result.
 */
export class PickUpComposite extends PickUp {
  protected children: PickUp[] = [];

  /**
   * A composite object can add or remove other components (both simple or
   * complex) to or from its child list.
   */
  public override add(component: PickUp): void {
    this.children.push(component);
    component.setParent(this);
  }

  public override remove(component: PickUp): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);

    component.setParent(null);
  }

  public override isComposite(): boolean {
    return true;
  }

  /**
   * The Composite executes its primary logic in a particular way. It
   * traverses recursively through all its children, collecting and summing
   * their results. Since the composite's children pass these calls to their
   * children and so forth, the whole object tree is traversed as a result.
   */
  public override operation(): string {
    const results = [];
    for (const child of this.children) {
      results.push(child.operation());
    }

    return `Branch(${results.join('+')})`;
  }
}
