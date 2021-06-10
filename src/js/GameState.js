export default class GameState {
  static from(object) {
    GameState.state = {
      teams: {
        player: object.teams.player,
        computer: object.teams.computer,
        currenGameLevel: object.teams.currenGameLevel,
        currentMap: object.teams.currentMap,
        counterPoint: object.teams.counterPoint,
      },
      goes: object.goes,
      waiting: object.waiting,
      gameOver: object.gameOver,
    };
    return null;
  }
}
