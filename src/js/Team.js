import { generateTeam } from "./generators";

export default class Team {
  constructor(allowedTypes, maxLevel, characterCount) {
    this.team = generateTeam(allowedTypes, maxLevel, characterCount);
    this.allowedTypes = allowedTypes;
  }

  addCharacterToTeam(maxLevel, characterCount) {
    for(let a of generateTeam(this.allowedTypes, maxLevel, characterCount)) {
      this.team.push(a);
    }
  }
}
