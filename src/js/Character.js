export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"
    this.checkClass(new.target.name);
  }

  checkClass (value) {
    if (value === 'Character') {
      throw new Error('класс Character может только наследоваться');
    }
  }
}
