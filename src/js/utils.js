export function calcTileType(index, boardSize) {
  const amountOfCells = boardSize ** 2;
  const topLeftCell = 0;
  const topRightCell = boardSize - 1;
  const bottomLeftCell = amountOfCells - boardSize;
  const bottomRightCell = amountOfCells - 1;

  // TODO: write logic here
  return (index === topLeftCell) ? 'top-left':
        (index === topRightCell) ? 'top-right':
        (index > topLeftCell && index < topRightCell) ? 'top':
        (index === bottomLeftCell) ? 'bottom-left':
        (index === bottomRightCell) ? 'bottom-right':
        (index > bottomLeftCell && index < bottomRightCell) ? 'bottom':
        (index % boardSize - topRightCell === 0) ? 'right':
        (index % boardSize === 0) ? 'left':
        'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
