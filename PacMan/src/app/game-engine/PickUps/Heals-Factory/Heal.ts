import { randomGridPosition } from '../../gameboard-grid.util';
import { Wall } from '../../Environment/Decorator';
import { FacadeService } from 'src/app/core/services/facade.service';
import { GameObject } from 'src/app/models/game.types';

export interface IHeal {
  update(): void;
  draw(gameBoard: any): void;
  getRandomHealPosition(): void;
  clone(): IHeal;
  set addHealth(val: number);
  get currentHealth(): number;
  set minusHealth(val: number);
}

export class HealMapOne implements IHeal {
  public heal: any;
  name: string;
  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  public player;
  health = 5;

  constructor(
    player: any,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.heal = this.getRandomHealPosition();

    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.heal.x,
      y: this.heal.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update() {
    if (this.player.onPlayer(this.heal)) {
      this.addHealth = 1;

      this.oldPosition = this.heal;
      this.heal = { x: -1, y: -1 };
      const newPosition: any = this.getRandomHealPosition();

      let lobbyId = sessionStorage.getItem('lobbyId')!;
      this.facadeService.mediatorService.updateGameObject(lobbyId, {
        name: this.name,
        x: newPosition.x,
        y: newPosition.y,
      });
    }

    var objects = this.gameObjects.split(';');
    objects.forEach((object) => {
      var data = object.split(' ');
      if (
        data[0] == this.name &&
        data[1] != undefined &&
        data[2] != undefined &&
        (parseInt(data[1]) != this.oldPosition.x ||
          parseInt(data[2]) != this.oldPosition.y)
      ) {
        this.heal = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  clone(): IHeal {
    return new HealMapOne(
      this.player,
      this.walls,
      this.name + 'Clone',
      this.facadeService
    );
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

  getRandomHealPosition() {
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
}

//###################################################################

export class HealMapTwo implements IHeal {
  public heal: any;
  name: string;
  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  public player;
  health = 4;

  constructor(
    player: any,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.heal = this.getRandomHealPosition();

    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.heal.x,
      y: this.heal.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update() {
    if (this.player.onPlayer(this.heal)) {
      this.addHealth = 1;

      this.oldPosition = this.heal;
      this.heal = { x: -1, y: -1 };
      const newPosition: any = this.getRandomHealPosition();

      let lobbyId = sessionStorage.getItem('lobbyId')!;
      this.facadeService.mediatorService.updateGameObject(lobbyId, {
        name: this.name,
        x: newPosition.x,
        y: newPosition.y,
      });
    }

    var objects = this.gameObjects.split(';');
    objects.forEach((object) => {
      var data = object.split(' ');
      if (
        data[0] == this.name &&
        data[1] != undefined &&
        data[2] != undefined &&
        (parseInt(data[1]) != this.oldPosition.x ||
          parseInt(data[2]) != this.oldPosition.y)
      ) {
        this.heal = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  clone(): IHeal {
    return new HealMapTwo(
      this.player,
      this.walls,
      this.name + 'Clone',
      this.facadeService
    );
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

  getRandomHealPosition() {
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
    if (this.health < 4) {
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
}

//###################################################################

export class HealMapThree implements IHeal {
  public heal: any;
  name: string;
  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  public player;
  health = 3;

  constructor(
    player: any,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.heal = this.getRandomHealPosition();

    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.heal.x,
      y: this.heal.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update() {
    if (this.player.onPlayer(this.heal)) {
      this.addHealth = 1;

      this.oldPosition = this.heal;
      this.heal = { x: -1, y: -1 };
      const newPosition: any = this.getRandomHealPosition();

      let lobbyId = sessionStorage.getItem('lobbyId')!;
      this.facadeService.mediatorService.updateGameObject(lobbyId, {
        name: this.name,
        x: newPosition.x,
        y: newPosition.y,
      });
    }

    var objects = this.gameObjects.split(';');
    objects.forEach((object) => {
      var data = object.split(' ');
      if (
        data[0] == this.name &&
        data[1] != undefined &&
        data[2] != undefined &&
        (parseInt(data[1]) != this.oldPosition.x ||
          parseInt(data[2]) != this.oldPosition.y)
      ) {
        this.heal = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  clone(): IHeal {
    return new HealMapThree(
      this.player,
      this.walls,
      this.name + 'Clone',
      this.facadeService
    );
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

  getRandomHealPosition() {
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
    if (this.health < 3) {
      this.health += val;
    }
  }
  get currentHealth() {
    return this.health;
  }

  set minusHealth(val: number) {
    if (this.health > 0) {
      this.health -= val;
      //console.log('numinusavo');
    }
  }
}
