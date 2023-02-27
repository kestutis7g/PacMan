import { randomGridPosition } from '..//../gameboard-grid.util';
import { Wall } from '../../Environment/Decorator';
import { Player } from '../../Entities/player';
import { FacadeService } from 'src/app/core/services/facade.service';
import { GameObject } from 'src/app/models/game.types';

export interface IPowerUp {
  update(): void;
  draw(gameBoard: any): void;
  getRandomPowerUpPosition(): void;
  effect(): void;
}

export class PowerUp1 implements IPowerUp {
  public powerup: any;
  name: string;
  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  public player;

  constructor(
    player: any,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.powerup = this.getRandomPowerUpPosition();

    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.powerup.x,
      y: this.powerup.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update() {
    if (this.player.onPlayer(this.powerup)) {
      this.effect();

      this.oldPosition = this.powerup;
      this.powerup = { x: -1, y: -1 };
      const newPosition: any = this.getRandomPowerUpPosition();

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
        this.powerup = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  getRandomPowerUpPosition() {
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
}

export class PowerUp2 implements IPowerUp {
  public powerup: any;
  name: string;
  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  public player;

  constructor(
    player: any,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.powerup = this.getRandomPowerUpPosition();

    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.powerup.x,
      y: this.powerup.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update() {
    if (this.player.onPlayer(this.powerup)) {
      this.effect();

      this.oldPosition = this.powerup;
      this.powerup = { x: -1, y: -1 };
      const newPosition: any = this.getRandomPowerUpPosition();

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
        this.powerup = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  getRandomPowerUpPosition() {
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
      console.log('Immortal efektas beigesi po 10 sekundziu');
    }, 10000);
  }
}

export class PowerUp3 implements IPowerUp {
  public powerup: any;
  name: string;
  gameObjects: string = '';
  oldPosition = { x: -1, y: -1 };

  public player;

  constructor(
    player: any,
    public walls: Wall,
    name: string,
    private facadeService: FacadeService
  ) {
    this.player = player;
    this.powerup = this.getRandomPowerUpPosition();

    this.name = name;
    var gameObject: GameObject = {
      name: name,
      lobbyId: sessionStorage.getItem('lobbyId')!,
      x: this.powerup.x,
      y: this.powerup.y,
    };
    facadeService.mediatorService.createGameObject(gameObject);

    this.facadeService.mediatorService.gameObjects.subscribe((gameObjects) => {
      this.gameObjects = gameObjects;
    });
  }

  update() {
    if (this.player.onPlayer(this.powerup)) {
      this.effect();

      this.oldPosition = this.powerup;
      this.powerup = { x: -1, y: -1 };
      const newPosition: any = this.getRandomPowerUpPosition();

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
        this.powerup = { x: parseInt(data[1]), y: parseInt(data[2]) };
      }
    });
  }

  getRandomPowerUpPosition() {
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
      console.log('Immortal efektas beigesi po 5 sekundziu');
    }, 5000);
  }
}
