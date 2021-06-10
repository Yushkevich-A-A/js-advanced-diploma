import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');

    this.attack = 30;
    this.defence = 20;
    this.movementRange = 4;
    this.attackRange = 1;
  }
}
