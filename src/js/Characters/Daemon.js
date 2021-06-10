import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');

    this.attack = 20;
    this.defence = 30;
    this.movementRange = 1;
    this.attackRange = 4;
  }
}
