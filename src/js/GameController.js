import GamePlay from './GamePlay';
import Team from './Team';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(`prairie`);
    this.teams = new Team(this.gamePlay.boardSize)
    this.teamsCaracters = this.teams.arrayCharactersOnPlayField();
    this.gamePlay.redrawPositions(this.teamsCaracters);

    this.listenerInformation();

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  listenerInformation() {
    this.gamePlay.addCellClickListener( index => this.onCellClick(index) );
    this.gamePlay.addCellEnterListener( index => this.onCellEnter(index) );
    this.gamePlay.addCellLeaveListener( index => this.onCellLeave(index) );
  }
  
  // changingTheOrderOfMoving() {
  //   if (this.turn === 'player') {
  //     this.turn = 'computer';
  //   } else {
  //     this.turn = 'player';
  //   }
  // }

  onCellClick(index) {
    // TODO: react to click
    this.selectCharacter(index);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.displayBriefInfo(index);
    this.visualAvailableSteps(index)
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.deleteVisualAvailableSteps();
  }
  
  checkPosition(index){
    return this.teamsCaracters.find( item => item.position === index ) || false;
  }

  displayBriefInfo(index) {
    const characterAtPosition = this.checkPosition(index);
    if (characterAtPosition) {
      const character = characterAtPosition.character;
      this.gamePlay.showCellTooltip(`\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`, index);
    }
  }

  selectCharacter(index) {
    const characterAtPosition = this.checkPosition(index);
    if (characterAtPosition) {
      if (this.teams.player.includes(characterAtPosition)) {
        if(this.selectedCharacterIndex >= 0) {
          this.gamePlay.deselectCell(this.selectedCharacterIndex);
        }
        this.gamePlay.selectCell(index);
        this.selectedCharacter = characterAtPosition;
        this.selectedCharacterIndex = index;
        this.availableSteps = this.arrayAvailableSteps();
        this.availableAttack = this.arrayAvailableAttack();
      } else {
        GamePlay.showError('это персонаж противника');
      }
    }
  }

  visualAvailableSteps(index) {
    if (this.selectedCharacter && this.availableSteps.includes(index) && !this.checkPosition(index)) {
      this.selectedStepIndex = index;
      this.gamePlay.selectCell( index, 'green');
    }
  }

  deleteVisualAvailableSteps() {
    if (this.selectedCharacter && this.selectedStepIndex >= 0 ) {
      this.gamePlay.deselectCell(this.selectedStepIndex);
    }
  }

  arrayAvailableSteps() {
    let availableSteps = new Set();
    let gorizont = [];
    const currentPosition = this.selectedCharacter.position;
    const valueOfMovement = this.selectedCharacter.character.movementRange;
    const boardSize = this.gamePlay.boardSize;

    // горизонтальные линии
    for (let i = 0; i >= 0 - valueOfMovement; i--) {
      let value = currentPosition + i;
      if ( value % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    for (let i = 1; i <= valueOfMovement; i++) {
      let value = currentPosition + i;
      if ( value - (boardSize - 1) % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    // вертикальные линии

    for (let i = 0; i >= 0 - valueOfMovement; i--) {
      let value = currentPosition + i * boardSize;
      if ( value < 0) {
        break;
      }
      availableSteps.add(value);
    }

    for (let i = 1; i <= valueOfMovement; i++) {
      let value = currentPosition + i * boardSize;
      if ( value > boardSize ** 2) {
        break;
      }
      availableSteps.add(value);
    }

    // дигонали

    for (let a of gorizont) {
      let value = currentPosition - boardSize * a + a;
      if (value < 0) {
        break;
      }
      availableSteps.add(value);
    }

    for (let a of gorizont) {
      let value = currentPosition + boardSize * a + a;
      if (value > boardSize ** 2) {
        break;
      }
      availableSteps.add(value);
    }

  gorizont.forEach(item => availableSteps.add(currentPosition + item));
  return Array.from(availableSteps);
  }

  arrayAvailableAttack() {
    let attackArr = new Set();
    let gorizont = [];
    const currentPosition = this.selectedCharacter.position;
    const attackRange = this.selectedCharacter.character.attackRange;
    const boardSize = this.gamePlay.boardSize;
    
    for (let i = 0; i >= 0 - attackRange; i--) {
      let value = currentPosition + i;
      if ( value % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    for (let i = 1; i <= attackRange; i++) {
      let value = currentPosition + i;
      if ( value - (boardSize - 1) % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }


    for (let i = 0 - attackRange; i <= attackRange; i++) {
      let startIterationValue = currentPosition + i * boardSize;
      if ( startIterationValue < 0 || startIterationValue > boardSize ** 2) {
        break;
      }
      console.log(startIterationValue);
      for (let a of gorizont) {
        let value = startIterationValue + a;
        attackArr.add(value);
      }

    }
    return Array.from(attackArr);
  }
   
}