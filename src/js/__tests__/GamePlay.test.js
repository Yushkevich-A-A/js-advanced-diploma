import cursors from '../cursors';
import GamePlay from '../GamePlay';

test('тестирование информации передаваемой в title выбранной ячейки методом showCellTooltip', () => {
  const received = new GamePlay();
  const message = 'hello world!';
  received.cells[0] = document.createElement('div');
  received.showCellTooltip(message, 0);

  expect(received.cells[0].title).toBe(message);
});

test('тестирование отображения курсорa auto', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.auto);
  expect(received.boardEl.style.cursor).toBe(cursors.auto);
});

test('тестирование отображения курсорa pointer', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.pointer);
  expect(received.boardEl.style.cursor).toBe('pointer');
});

test('тестирование отображения курсорa crosshair', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.crosshair);
  expect(received.boardEl.style.cursor).toBe('crosshair');
});

test('тестирование отображения курсорa notallowed', () => {
  const received = new GamePlay();
  received.boardEl = document.createElement('div');
  received.setCursor(cursors.notallowed);
  expect(received.boardEl.style.cursor).toBe('not-allowed');
});

test('присвоение выбранному полю класса для отображения подсветки выбора персонажа', () => {
  const received = new GamePlay();
  received.cells[0] = document.createElement('div');
  received.selectCell(0);

  expect(Array.from(received.cells[0].classList)).toEqual(['selected', 'selected-yellow']);
});

test('присвоение выбранному полю класса для отображения подсветки атаки персонажа', () => {
  const received = new GamePlay();
  received.cells[0] = document.createElement('div');
  received.selectCell(0, 'red');

  expect(Array.from(received.cells[0].classList)).toEqual(['selected', 'selected-red']);
});

test('присвоение выбранному полю класса для отображения подсветки хода персонажа', () => {
  const received = new GamePlay();
  received.cells[0] = document.createElement('div');
  received.selectCell(0, 'green');

  expect(Array.from(received.cells[0].classList)).toEqual(['selected', 'selected-green']);
});
