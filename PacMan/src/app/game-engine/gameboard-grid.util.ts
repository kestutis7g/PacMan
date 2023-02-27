const GRID_SIZE = 30;

export function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
}

export function outsideGrid(position: any) {
  return (
    position.x < 1 ||
    position.x > GRID_SIZE ||
    position.y < 1 ||
    position.y > GRID_SIZE
  );
}

export function fixOutsidePosition(position: any) {
  if (position.x < 1) position.x = GRID_SIZE;
  if (position.x > GRID_SIZE) position.x = 1;
  if (position.y < 1) position.y = GRID_SIZE;
  if (position.y > GRID_SIZE) position.y = 1;

  return position;
}
