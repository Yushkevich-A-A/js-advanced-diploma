import { calcTileType } from '../utils';

const boardSize = 8;

test('тестирование функции utils возвращает строку "top-left" для начальной ячейки', () => {
  const received = calcTileType(0, boardSize);
  expect(received).toBe('top-left');
});

test('тестирование функции utils возвращает строку "top-right" для начальной ячейки', () => {
  const received = calcTileType(7, boardSize);
  expect(received).toBe('top-right');
});

test('тестирование функции utils возвращает строку "top" для начальной ячейки', () => {
  const received = calcTileType(4, boardSize);
  expect(received).toBe('top');
});

test('тестирование функции utils возвращает строку "bottom-left" для начальной ячейки', () => {
  const received = calcTileType(56, boardSize);
  expect(received).toBe('bottom-left');
});

test('тестирование функции utils возвращает строку "bottom-right" для начальной ячейки', () => {
  const received = calcTileType(63, boardSize);
  expect(received).toBe('bottom-right');
});

test('тестирование функции utils возвращает строку "bottom" для начальной ячейки', () => {
  const received = calcTileType(60, boardSize);
  expect(received).toBe('bottom');
});

test('тестирование функции utils возвращает строку "right" для начальной ячейки', () => {
  const received = calcTileType(15, boardSize);
  expect(received).toBe('right');
});

test('тестирование функции utils возвращает строку "left" для начальной ячейки', () => {
  const received = calcTileType(24, boardSize);
  expect(received).toBe('left');
});
