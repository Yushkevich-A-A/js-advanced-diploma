import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');

    this.attack = 20;
    this.defence = 30;
    this.movementRange = 1;
    this.attackRange = 4;
  }
}
