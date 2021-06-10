import cursors from './cursors';
import GamePlay from './GamePlay';
import GameState from './GameState';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.teams = new Team(this.gamePlay.boardSize);
    this.initNewGameOrLevel();
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addNewGameListener(() => { if (this.goes === 'player') this.newGame(); });
    this.gamePlay.addSaveGameListener(() => {
      if (this.goes === 'player') {
        GameState.from(this);
        this.stateService.save(GameState.state);
      }
    });
    this.gamePlay.addLoadGameListener(() => { if (this.goes === 'player') this.loadGame(); });
  }

  newGame() {
    this.teams = new Team(this.gamePlay.boardSize);
    this.teams.counterPoint = GameState.state.teams.counterPoint;
    this.initNewGameOrLevel();
  }

  loadGame() {
    try {
      GameState.from(this.stateService.load());
      const loadedObject = GameState.state;
      this.teams.player = loadedObject.teams.player;
      this.teams.computer = loadedObject.teams.computer;
      this.teams.currenGameLevel = loadedObject.teams.currenGameLevel;
      this.teams.currentMap = loadedObject.teams.currentMap;
      this.teams.counterPoint = loadedObject.teams.counterPoint;
      this.goes = loadedObject.goes;
      this.waiting = loadedObject.waiting;
      this.gameOver = loadedObject.gameOver;
      this.initNewGameOrLevel(false);
      if (this.goes === 'computer') {
        this.computerGoes();
      }
    } catch (e) {
      this.gamePlay.showError(e);
    }
  }

  initNewGameOrLevel(noLoadGame = true) {
    if (noLoadGame) {
      this.goes = 'player';
      this.waiting = 'computer';
      this.gameOver = false;
    }
    this.gamePlay.drawUi(this.teams.currentMap);
    this.redrawPositionsController();
    GameState.from(this);
    this.resetValues();
  }

  redrawPositionsController() {
    this.teamsCaracters = this.teams.arrayCharactersOnPlayField();
    this.gamePlay.redrawPositions(this.teamsCaracters);
  }

  nextMove(index) {
    this.redrawPositionsController();
    this.gamePlay.deselectCell(this.selectedCharacterIndex);
    this.deleteVisualAvailableSteps();
    this.gamePlay.deselectCell(index);
    this.resetValues();
    GameState.from(this);
    this.checkGameStatus();
  }

  checkGameStatus() {
    if (this.teams.player.length === 0
      || this.teams.computer.length === 0
      && this.teams.currenGameLevel === 4) {
      this.gameOver = true;
      return;
    } if (this.teams.computer.length === 0) {
      this.teams.levelUp();
      this.initNewGameOrLevel();
      return;
    }
    this.changingTheOrderOfMoving();
  }

  resetValues() {
    this.attackCapability = true;
    this.selectedStepIndex = null;
    this.selectedAttackIndex = null;
    this.selectedCharacter = null;
    this.selectedCharacterIndex = null;
    this.availableSteps = null;
    this.availableAttack = null;
  }

  changingTheOrderOfMoving() {
    if (this.goes === 'player') {
      this.goes = 'computer';
      this.waiting = 'player';
      this.computerGoes();
    } else {
      this.goes = 'player';
      this.waiting = 'computer';
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.goes === 'player' && !this.gameOver) {
      this.selectCharacter(index);
      if (this.attackCapability) {
        this.attack(index);
      }
      this.moving(index);
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.goes === 'player' && !this.gameOver) {
      this.displayBriefInfo(index);
      this.visualSelectOtherCharacter(index);
      this.visualAvailableSteps(index);
      this.visualAvailableAttack(index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.goes === 'player' && !this.gameOver) {
      this.gamePlay.hideCellTooltip(index);
      this.deleteVisualAvailableSteps();
      this.deleteVisualAvailableAttack();
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  // Проверка персонажа на выбранной клетке

  checkPosition(index) {
    return this.teamsCaracters.find((item) => item.position === index) || false;
  }

  // Отображение краткой информации о персонаже

  displayBriefInfo(index) {
    const characterAtPosition = this.checkPosition(index);
    if (characterAtPosition) {
      const { character } = characterAtPosition;
      this.gamePlay.showCellTooltip(`\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`, index);
    }
  }

  // Выбор персонажа и отображение выбранного персонажа

  selectCharacter(index) {
    const characterAtCurrentIndex = this.checkPosition(index);
    if (characterAtCurrentIndex) {
      if (this.teams[this.goes].includes(characterAtCurrentIndex)) {
        if (this.selectedCharacterIndex !== null) {
          this.gamePlay.deselectCell(this.selectedCharacterIndex);
        }
        this.selectedCharacter = characterAtCurrentIndex;
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
    if (this.selectedCharacter !== null
      && this.availableSteps.includes(index)
      && !this.checkPosition(index)) {
      this.selectedStepIndex = index;
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }
  }

  deleteVisualAvailableSteps() {
    if (this.selectedCharacter !== null && this.selectedStepIndex !== null) {
      this.gamePlay.deselectCell(this.selectedStepIndex);
    }
  }

  moving(index) {
    if (this.selectedCharacter !== null
      && this.availableSteps.includes(index)
      && !this.checkPosition(index)) {
      this.selectedCharacter.position = index;
      this.nextMove(index);
    }
  }

  // Визуальное отображение доступной атаки, недоступной атаки, удаление индикатора атаки, атакав

  visualAvailableAttack(index) {
    if (this.selectedCharacter !== null
      && this.checkPosition(index)
      && this.teams[this.waiting].includes(this.checkPosition(index))) {
      if (this.availableAttack.includes(index)) {
        this.selectedAttackIndex = index;
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  deleteVisualAvailableAttack() {
    if (this.selectedCharacter !== null && this.selectedAttackIndex !== null) {
      this.gamePlay.deselectCell(this.selectedAttackIndex);
    }
  }

  attack(index) {
    if (this.selectedCharacter !== null
      && this.teams[this.waiting].includes(this.checkPosition(index))) {
      if (this.availableAttack.includes(index)) {
        this.attackCapability = false;
        (async () => {
          const attacker = this.selectedCharacter.character;
          const target = this.checkPosition(index).character;
          const value = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
          target.health -= value;
          await this.gamePlay.showDamage(index, value).then(() => {
            this.checkDeathCaracters();
            this.nextMove(index);
          });
        })();
      } else {
        GamePlay.showError('Слишком далеко для атаки');
      }
    }
  }

  checkDeathCaracters() {
    const character = this.teamsCaracters.find((item) => item.character.health <= 0);
    if (character) {
      const indexCharacter = this.teams[this.waiting].findIndex((item) => item === character);
      this.teams[this.waiting].splice(indexCharacter, 1);
    }
  }

  // Примитивная логика компьютера

  async computerGoes() {
    await new Promise((resolve) => {
      setTimeout(() => {
        const countCharacters = this.teams[this.goes].length;
        const randomCharacter = this.teams[this.goes][Math.floor(Math.random() * countCharacters)];
        this.selectCharacter(randomCharacter.position);
        resolve();
      }, 1000);
    }).then(() => {
      new Promise((resolve) => {
        setTimeout(() => {
          const playerCharactersAtPosition = this.teams[this.waiting].map((i) => i.position);
          const availableAttackAtPlayer = this.availableAttack.filter((item) => playerCharactersAtPosition.includes(item));
          if (availableAttackAtPlayer.length !== 0) {
            const attackCell = Math.floor(Math.random() * availableAttackAtPlayer.length);
            this.attack(availableAttackAtPlayer[attackCell]);
            resolve();
          } else {
            let randomValue;
            const randomStepCharacter = () => {
              randomValue = this.availableSteps[Math.floor(Math.random() * this.availableSteps.length)];
              if (this.checkPosition(randomValue)) {
                randomStepCharacter();
              }
            };
            randomStepCharacter();
            this.moving(randomValue);
            resolve();
          }
        }, 1000);
      });
    });
  }

  // Вычисление доступных ходов выбранного персонажа

  arrayAvailableSteps() {
    const availableSteps = new Set();
    const gorizont = [];
    const currentPosition = this.selectedCharacter.position;
    const valueOfMovement = this.selectedCharacter.character.movementRange;
    const { boardSize } = this.gamePlay;

    for (let i = 0; i >= 0 - valueOfMovement; i--) {
      const value = currentPosition + i;
      if (value % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    for (let i = 0; i <= valueOfMovement; i++) {
      const value = currentPosition + i;
      if ((value + 1) % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }
    gorizont.sort();

    for (let i = 0 - valueOfMovement; i <= valueOfMovement; i++) {
      const value = currentPosition - i * boardSize;
      if (value < 0 || value >= boardSize ** 2) {
        continue;
      }
      availableSteps.add(value);
    }

    for (const a of gorizont) {
      const value = currentPosition + boardSize * a + a;
      if (value < 0 || value >= boardSize ** 2) {
        continue;
      }
      availableSteps.add(value);
    }

    for (const a of gorizont) {
      const value = currentPosition - boardSize * a + a;
      if (value < 0 || value >= boardSize ** 2) {
        continue;
      }
      availableSteps.add(value);
    }

    gorizont.forEach((item) => availableSteps.add(currentPosition + item));
    return Array.from(availableSteps);
  }

  // вычисление доступных клеток для атаки выбранного персонажа

  arrayAvailableAttack() {
    const attackArr = new Set();
    const gorizont = [];
    const currentPosition = this.selectedCharacter.position;
    const { attackRange } = this.selectedCharacter.character;
    const { boardSize } = this.gamePlay;

    for (let i = 0; i >= 0 - attackRange; i--) {
      const value = currentPosition + i;
      if (value % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    for (let i = 0; i <= attackRange; i++) {
      const value = currentPosition + i;
      if ((value + 1) % boardSize === 0) {
        gorizont.push(i);
        break;
      }
      gorizont.push(i);
    }

    for (let i = 0 - attackRange; i <= attackRange; i++) {
      const startIterationValue = currentPosition + i * boardSize;
      for (const a of gorizont) {
        const value = startIterationValue + a;
        if (value < 0 || value > boardSize ** 2) {
          continue;
        }
        attackArr.add(value);
      }
    }
    return Array.from(attackArr);
  }
}
