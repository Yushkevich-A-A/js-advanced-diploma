import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

test('тестируем корректное возвращенное значение из localStorage', () => {
  const received = '{"string":"Hello World!"}';
  localStorage.setItem('state', received);
  const gameStateService = new GameStateService(global.localStorage);
  expect(gameStateService.load()).toEqual({ string: 'Hello World!' });
  expect(() => { gameStateService.load(); }).not.toThrow();
});

test('некорректное значение возвращенное из localStorage про брфсывает ошибку', () => {
  const received = '{"string":"Hello World!}';
  localStorage.setItem('state', received);
  const gameStateService = new GameStateService(global.localStorage);
  expect(() => { gameStateService.load(); }).toThrowError();
});

test('при некорректном ответе ошибка пробрасывается и вызывается метод showError отображающий ошибку в alert', () => {
  const received = '{"string":"Hello World!}';
  localStorage.setItem('state', received);
  const gameStateService = new GameStateService(global.localStorage);
  const gamePlay = new GamePlay();
  gamePlay.showError = jest.fn();
  const gameController = new GameController(gamePlay, gameStateService);
  gameController.loadGame();
  expect(gamePlay.showError).toHaveBeenCalledTimes(1);
});
