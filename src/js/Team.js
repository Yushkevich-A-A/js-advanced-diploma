import Swordsman from './Characters/Swordsman';
import Magician from './Characters/Magician';
import Bowman from './Characters/Bowman';
import Daemon from './Characters/Daemon';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';

export default class Team {
  constructor(fieldSize) {
    this.fielsSize = fieldSize;
    this.playerAllowedTypes = [Swordsman, Magician, Bowman];
    this.computerAllowedTypes = [Daemon, Undead, Vampire];
    this.counterPoint = 0;
    this.player = [];
    this.computer = [];
    this.collectionCellsOccured = new Set();
    this.currenGameLevel = 1;
    this.paramLevel = [
      { levelGame: 1, playerLevel: 1, amountPlayer: 2 },
      { levelGame: 2, playerLevel: 1, amountPlayer: 1 },
      { levelGame: 3, playerLevel: 2, amountPlayer: 2 },
      { levelGame: 4, playerLevel: 3, amountPlayer: 2 },
    ];
    this.createLevel();
  }

  levelUp() {
    this.currenGameLevel += 1;
    this.counterPoint += this.player.reduce((acc, cur) => acc + cur.character.health, 0);
    for (const a of this.player) {
      this.upgradeCharacter(a.character, a.character.level, this.currenGameLevel);
    }

    this.createLevel();
  }

  upgradeCharacter(character, from, to) {
    for (let i = from; i < to; i++) {
      character.health = (character.health + 80 > 100) ? 100 : character.health + 80;
      character.attack = Math.round(character.attack * 1.3);
    }
    character.level = to;
  }

  createLevel() {
    this.player.forEach((item) => item.position = this.choisePosition(this.collectionCellsOccured));
    this.currentMap = Object.values(themes)[this.currenGameLevel - 1];
    const currentLevel = this.paramLevel.find((item) => item.levelGame === this.currenGameLevel);

    for (const i of generateTeam(this.playerAllowedTypes, currentLevel.playerLevel, currentLevel.amountPlayer)) {
      this.upgradeCharacter(i, 1, i.level);
      this.player.push(new PositionedCharacter(i, this.choisePosition(this.collectionCellsOccured)));
    }

    for (const i of generateTeam(this.computerAllowedTypes, this.currenGameLevel, this.player.length)) {
      this.upgradeCharacter(i, 1, i.level);
      this.computer.push(new PositionedCharacter(i, this.choisePosition(this.collectionCellsOccured, this.fielsSize - 2)));
    }

    this.collectionCellsOccured.clear();
  }

  randomiserIndexPosition() {
    return Math.floor(Math.random() * 2) + Math.floor(Math.random() * this.fielsSize) * this.fielsSize;
  }

  choisePosition(setCollection, offset = 0) {
    let value;
    do {
      value = this.randomiserIndexPosition() + offset;
    } while (setCollection.has(value));
    setCollection.add(value);
    return value;
  }

  arrayCharactersOnPlayField() {
    return [...this.player, ...this.computer];
  }
}
