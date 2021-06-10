import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');

    this.attack = 30;
    this.defence = 20;
    this.movementRange = 4;
    this.attackRange = 1;
  }
}
