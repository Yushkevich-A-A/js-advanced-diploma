import Swordsman from './Characters/Swordsman';
import Magician from './Characters/Magician';
import Bowman from './Characters/Bowman';
import Daemon from './Characters/Daemon';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import { characterGenerator, generateTeam } from "./generators";
import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor(fieldSize) {
    this.fielsSize = fieldSize;
    this.playerAllowedTypes = [Swordsman, Magician, Bowman];
    this.computerAllowedTypes = [Daemon, Undead, Vampire];
    this.collectionCellsOccured = new Set();
    this.level1();
  }

    randomiserIndexPosition() {
      return Math.floor( Math.random() * 2 ) + Math.floor( Math.random() * this.fielsSize ) * this.fielsSize;
    }

    changeToPositionedCharacterArray( item, setCollection, offset = 0 ) {
      let value;
      do {
        value = this.randomiserIndexPosition() + offset;
      } while ( setCollection.has( value ) )
      setCollection.add( value );
       return new PositionedCharacter( item, value );
    }

    arrayCharactersOnPlayField() {
      return [ ...this.player, ...this.computer ];
    }

    level1() {
      this.player = generateTeam( this.playerAllowedTypes, 1, 2 )
      .map( item => {return this.changeToPositionedCharacterArray( item, this.collectionCellsOccured ) } );
      this.computer = generateTeam( this.computerAllowedTypes, 1, 2 )
      .map( item => {return this.changeToPositionedCharacterArray( item, this.collectionCellsOccured, this.fielsSize - 2 ) } );
      this.collectionCellsOccured.clear();
    }
}
