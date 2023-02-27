import { Map } from 'src/app/models/game.types';

interface IObject {
  update(): void;
  generateElements(map: Map): void;
  draw(gameBoard: any): void;
  onObject(position: any): boolean;
  equalPositions(pos1: any, pos2: any): boolean;
}

export class Wall implements IObject {
  wall = [{ x: -1, y: -1 }];
  wallElements: HTMLElement[] = [];

  update() {}

  generateElements(map: Map) {
    let lines = map!.map.split('\n                        ');
    this.wall.pop();
    for (let y = 0; y < lines.length; y++) {
      let elements = lines[y].split(' ');

      for (let x = 0; x < elements.length; x++) {
        if (elements[x] == '1') {
          this.wall.push({ x: x + 1, y: y + 1 });

          const wallElement = document.createElement('divas');
          wallElement.style.gridRowStart = (y + 1).toString();
          wallElement.style.gridColumnStart = (x + 1).toString();
          wallElement.style.backgroundColor = '#1a1a1a';
          this.wallElements.push(wallElement);
        }
      }
    }
  }

  draw(gameBoard: any) {
    this.wallElements.forEach((segment) => {
      gameBoard.appendChild(segment);
    });
  }

  onObject(position: any) {
    return this.wall.some((segment) => {
      return this.equalPositions(segment, position);
    });
  }

  equalPositions(pos1: any, pos2: any) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }
}

export class Door implements IObject {
  door = [{ x: 1, y: 1 }];
  doorElements: HTMLElement[] = [];

  update() {}

  generateElements(map: Map) {
    let lines = map!.map.split('\n                        ');
    this.door.pop();
    for (let y = 0; y < lines.length; y++) {
      let elements = lines[y].split(' ');

      for (let x = 0; x < elements.length; x++) {
        if (elements[x] == '2') {
          this.door.push({ x: x + 1, y: y + 1 });

          const doorElement = document.createElement('div');
          doorElement.style.gridRowStart = (y + 1).toString();
          doorElement.style.gridColumnStart = (x + 1).toString();
          doorElement.style.backgroundColor = '#48342b';
          this.doorElements.push(doorElement);
        }
      }
    }
  }

  draw(gameBoard: any) {
    this.doorElements.forEach((segment) => {
      gameBoard.appendChild(segment);
    });
  }

  onObject(position: any) {
    return this.door.some((segment) => {
      return this.equalPositions(segment, position);
    });
  }

  equalPositions(pos1: any, pos2: any) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  generateRandomWall() {
    for (let i = 0; i < 40; i++) {
      this.door.push({
        x: this.getRandomInt(1, 21),
        y: this.getRandomInt(1, 21),
      });
    }
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    // The maximum is exclusive and the minimum is inclusive
  }
}

export abstract class Decorator implements IObject {
  protected object: IObject;

  constructor(object: IObject) {
    this.object = object;
  }

  public update(): void {
    this.object.update();
  }
  public generateElements(map: Map): void {
    this.object.generateElements(map);
  }
  public draw(gameBoard: any): void {
    this.object.draw(gameBoard);
  }
  public onObject(position: any): boolean {
    return this.object.onObject(position);
  }
  public equalPositions(pos1: any, pos2: any): boolean {
    return this.object.equalPositions(pos1, pos2);
  }
}

export class BlackBorderWallDecorator extends Decorator {
  wallElements: HTMLElement[] = [];
  constructor(public wall: Wall) {
    super(wall);
    this.wallElements = wall.wallElements;
  }

  addBorder() {
    this.wallElements.forEach((segment) => {
      segment.style.border = '0.5vmin solid black';
    });
  }
}

export class PurpleBorderWallDecorator extends Decorator {
  wallElements: HTMLElement[] = [];
  constructor(public wall: Wall) {
    super(wall);
    this.wallElements = wall.wallElements;
  }

  addBorder() {
    this.wallElements.forEach((segment) => {
      segment.style.border = '0.5vmin solid #5b277f';
    });
  }
}

export class YellowBorderWallDecorator extends Decorator {
  wallElements: HTMLElement[] = [];
  constructor(public wall: Wall) {
    super(wall);
    this.wallElements = wall.wallElements;
  }

  addBorder() {
    this.wallElements.forEach((segment) => {
      segment.style.border = '0.5vmin solid #b99015';
    });
  }
}

//##################################################################################

export class BrownBorderDoorDecorator extends Decorator {
  doorElements: HTMLElement[] = [];
  constructor(public door: Door) {
    super(door);
    this.doorElements = door.doorElements;
  }

  addBorder() {
    this.doorElements.forEach((segment) => {
      segment.style.border = '0.5vmin solid #34271f';
    });
  }
}

export class PurpleBorderDoorDecorator extends Decorator {
  doorElements: HTMLElement[] = [];
  constructor(public door: Door) {
    super(door);
    this.doorElements = door.doorElements;
  }

  addBorder() {
    this.doorElements.forEach((segment) => {
      segment.style.border = '0.5vmin solid #61063e';
    });
  }
}

export class YellowBorderDoorDecorator extends Decorator {
  doorElements: HTMLElement[] = [];
  constructor(public door: Door) {
    super(door);
    this.doorElements = door.doorElements;
  }

  addBorder() {
    this.doorElements.forEach((segment) => {
      segment.style.border = '0.5vmin solid #d6610e';
    });
  }
}
