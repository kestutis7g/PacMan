export class ChemicalsAbstraction {
  implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public drawDifferently(gameBoard: any) {
    const foodElement = document.createElement('div');
    let position = this.implementation.getPosition();
    foodElement.style.gridRowStart = position.y.toString();
    foodElement.style.gridColumnStart = position.x.toString();
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/iconfactory/kidcons/32/Medicine-icon.png')";
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/mozco/symbolic-objects/32/Poison-icon.png')";
    foodElement.style.backgroundSize = 'cover';
    foodElement.style.backgroundColor = 'rgba(189, 46, 46, 0.47)';
    foodElement.style.borderRadius = '50%';

    foodElement.classList.add('antidotefoodas');
    gameBoard.appendChild(foodElement);
  }

  public drawDifferentlyGood(gameBoard: any) {
    const foodElement = document.createElement('div');
    let position = this.implementation.getPosition();
    foodElement.style.gridRowStart = position.y.toString();
    foodElement.style.gridColumnStart = position.x.toString();
    //foodElement.style.backgroundImage = "url('https://icons.iconarchive.com/icons/iconfactory/kidcons/32/Medicine-icon.png')";
    foodElement.style.backgroundImage =
      "url('https://icons.iconarchive.com/icons/iconfactory/kidcons/32/Medicine-icon.png')";
    foodElement.style.backgroundSize = 'cover';
    foodElement.style.backgroundColor = 'rgba(46, 189, 58, 0.47)';
    foodElement.style.borderRadius = '50%';

    foodElement.classList.add('antidotefoodas');
    gameBoard.appendChild(foodElement);
  }
}

export interface Implementation {
  update(blob1?: any, ghostBlob?: any, blob3?: any, blob4?: any): void;
  draw(gameBoard: any): void;
  getRandomFoodPosition(): { x: number; y: number };
  getPosition(): { x: number; y: number };
}
