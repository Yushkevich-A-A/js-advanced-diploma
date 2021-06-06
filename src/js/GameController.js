import cursors from './cursors';
import GamePlay from './GamePlay';
import Team from './Team';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.goes = 'player';
    this.waiting = 'computer';
  }

  init() {
    this.gamePlay.drawUi(`prairie`);
    this.teams = new Team(this.gamePlay.boardSize)
    this.teamsCaracters = this.teams.arrayCharactersOnPlayField();
    this.gamePlay.redrawPositions(this.teamsCaracters);
    this.gamePlay.addCellClickListener( index => this.onCellClick(index) );
    this.gamePlay.addCellEnterListener( index => this.onCellEnter(index) );
    this.gamePlay.addCellLeaveListener( index => this.onCellLeave(index) );
    this.resetValues()
  }
  
  changingTheOrderOfMoving() {
    this.deleteVisualAvailableSteps();
    this.resetValues();
    if (this.goes === 'player') {
      this.goes = 'computer';
      this.waiting = 'player';
      this.computerGoes()
    } else {
      this.goes = 'player';
      this.waiting = 'computer';
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.goes === 'player') {
        this.selectCharacter(index);
        this.attack(index);
        this.moving(index);
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.goes === 'player') {
      this.displayBriefInfo(index);
      this.visualSelectOtherCharacter(index);
      this.visualAvailableSteps(index);
      this.visualAvailableAttack(index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.goes === 'player') {
      this.gamePlay.hideCellTooltip(index);
      this.deleteVisualAvailableSteps();
      this.deleteVisualAvailableAttack();
      this.gamePlay.setCursor(cursors.auto);
    }
  }

   resetValues() {
    this.selectedStepIndex = null;    
    this.selectedAttackIndex = null 
    this.selectedCharacter = null;
    this.selectedCharacterIndex = null;
    this.availableSteps = null;
    this.availableAttack = null;
   }
  
  // Проверка персонажа на выбранной клетке

  checkPosition(index){
    return this.teamsCaracters.find( item => item.position === index ) || false;
  }
  
  // Отображение краткой информации о персонаже

  displayBriefInfo(index) {
    const characterAtPosition = this.checkPosition(index);
    if (characterAtPosition) {
      const character = characterAtPosition.character;
      this.gamePlay.showCellTooltip(`\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`, index);
    }
  }

  // Выбор персонажа и отображение выбранного персонажа

  selectCharacter(index) {
    const characterAtPosition = this.checkPosition(index);
    if (characterAtPosition) {
      if (this.teams[this.goes].includes(characterAtPosition)) {
        if(this.selectedCharacterIndex !== null) {
          this.gamePlay.deselectCell(this.selectedCharacterIndex);
        }
        this.selectedCharacter = characterAtPosition;
        this.selectedCharacterIndex = index;
        this.gamePlay.selectCell(index);
        this.availableSteps = this.arrayAvailableSteps();
        this.availableAttack = this.arrayAvailableAttack();
      } else if (!this.selectedCharacter) {
        GamePlay.showError('Для хода нельзя выбирать персонажей оппонента');
      }
    }
  }

  visualSelectOtherCharacter(index) {
    if (this.teams[this.goes].includes(this.checkPosition(index))) {
      this.gamePlay.setCursor(cursors.pointer);
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  // Визуальное отображение доступных ходов, удаление индикации доступного хода, совершение хода

  visualAvailableSteps(index) {
    if (this.selectedCharacter !== null && this.availableSteps.includes(index) && !this.checkPosition(index)) {
      this.selectedStepIndex = index;
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell( index, 'green');
    }
  }

  deleteVisualAvailableSteps() {
    if (this.selectedCharacter !== null && this.selectedStepIndex !== null ) {
      this.gamePlay.deselectCell(this.selectedStepIndex);
    }
  }

  moving(index) {
    if (this.selectedCharacter !== null && this.availableSteps.includes(index) && !this.checkPosition(index)) {
      this.selectedCharacter.position = index;
      this.gamePlay.deselectCell(this.selectedCharacterIndex);
      this.gamePlay.deselectCell(index);
      this.changingTheOrderOfMoving();
      this.gamePlay.redrawPositions(this.teamsCaracters);
    }
  }

  // Визуальное отображение доступной атаки, недоступной атаки, удаление индикатора атаки, атакав 

  visualAvailableAttack(index) {
    if (this.selectedCharacter !== null && this.checkPosition(index) && this.teams[this.waiting].includes(this.checkPosition(index))) {
      if (this.availableAttack.includes(index)) {
        this.selectedAttackIndex = index;
        this.gamePlay.setCursor(cursors.crosshair);        
        this.gamePlay.selectCell( index, 'red');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  deleteVisualAvailableAttack() {
    if (this.selectedCharacter !== null && this.selectedAttackIndex !== null ) {
      this.gamePlay.deselectCell(this.selectedAttackIndex);
    }
  }

  attack(index) {
    if (this.selectedCharacter !== null && this.teams[this.waiting].includes(this.checkPosition(index))) {
      if (this.availableAttack.includes(index)) {
        ( async () => {
          const attacker = this.selectedCharacter.character;
          const target = this.checkPosition(index).character;
          const value = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
          target.health -= value;
          await this.gamePlay.showDamage(index, value).then(() => {
            this.checkDeathCaracters();
            this.gamePlay.redrawPositions(this.teamsCaracters);
          });
        })();
        this.gamePlay.deselectCell(this.selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.changingTheOrderOfMoving();
      } else {
        GamePlay.showError('Слишком далеко для атаки');
      }
    }
  }

  checkDeathCaracters() {
    const character = this.teamsCaracters.find(item => item.character.health <= 0);
    if (character) {
      const indexDeathCharacter = this.teamsCaracters.findIndex(item => item.position === character.position);
      const indexCharacter = this.teams[this.waiting].findIndex(item => item === character);
      this.teamsCaracters.splice(indexDeathCharacter, 1);
      this.teams[this.waiting].splice(indexCharacter, 1);
      console.log(this.teams[this.waiting]);
    }
  }

  // Примитивная логика компьютера

  computerGoes() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const countCharacters = this.teams[this.goes].length;
        const randomChoiseCharacter = this.teams[this.goes][Math.floor(Math.random() * countCharacters)];
        console.log(this.teams[this.goes]);
        this.selectCharacter(randomChoiseCharacter.position);
        resolve()
      }, 500);
    }).then( () => {
        return new Promise((resolve) => {
        setTimeout(() => {
          const playerCharactersAtPosition = this.teams[this.waiting].map(i => i.position);
          const availableAttackAtPlayer = this.availableAttack.filter(item => { return playerCharactersAtPosition.includes(item) });
          if (availableAttackAtPlayer.length !== 0) {
            const attackCell = Math.floor(Math.random() * availableAttackAtPlayer.length);
            this.attack(availableAttackAtPlayer[attackCell]);
          } else {
            let randomValue;
            const randomStepCharacter = () => {
              randomValue = this.availableSteps[Math.floor(Math.random() * this.availableSteps.length)];
              if (this.checkPosition(randomValue)) {
                randomStepCharacter();
              }
            }
            randomStepCharacter()
            this.moving(randomValue);
          }
          resolve();
        }, 500)
      })
    })
  }

  // Вычисление доступных ходов выбранного персонажа

  arrayAvailableSteps() {
    let availableSteps = new Set();
    let gorizont = [];
    const currentPosition = this.selectedCharacter.position;
    const valueOfMovement = this.selectedCharacter.character.movementRange;
    const boardSize = this.gamePlay.boardSize;

    for (let i = 0; i >= 0 - valueOfMovement; i--) {
      let value = currentPosition + i;
      if ( value % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    for (let i = 0; i <= valueOfMovement; i++) {
      let value = currentPosition + i;
      if ( (value + 1) % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }
    gorizont.sort()

    for (let i = 0 - valueOfMovement; i <= valueOfMovement ; i++) {
      let value = currentPosition - i * boardSize;
      if ( value < 0 || value >= boardSize ** 2) {
        continue;
      }
      availableSteps.add(value);
    }

    for (let a of gorizont) {
      let value = currentPosition + boardSize * a + a;
      if (value < 0 || value >= boardSize ** 2) {
        continue;
      }
      availableSteps.add(value);
    }

    for (let a of gorizont) {
      let value = currentPosition - boardSize * a + a;
      if (value < 0 || value >= boardSize ** 2) {
        continue;
      }
      availableSteps.add(value);
    }
    

  gorizont.forEach(item => availableSteps.add(currentPosition + item));
  return Array.from(availableSteps);
  }

  // вычисление доступных клеток для атаки выбранного персонажа

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

    for (let i = 0; i <= attackRange; i++) {
      let value = currentPosition + i;
      if ( (value + 1) % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    for (let i = 0 - attackRange; i <= attackRange; i++) {
      let startIterationValue = currentPosition + i * boardSize;
      for (let a of gorizont) {
        let value = startIterationValue + a;
        if ( value < 0 || value > boardSize ** 2) {
          continue;
        }
        attackArr.add(value);
      }
    }
    return Array.from(attackArr);
  }
}