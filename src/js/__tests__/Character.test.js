import Character from '../Character';
import Bowman from '../Characters/Bowman';

test('создание персонажа наследуемого от Character', () => {
  const received = new Bowman(1);

  expect(() => received).not.toThrow();
});

test('создание персонажа наследуемого от Character', () => {
  expect(() => new Character(1)).toThrow();
});
