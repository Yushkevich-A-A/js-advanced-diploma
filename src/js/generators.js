/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
    while(true) {
      const randomLevel = Math.ceil(Math.random() * maxLevel);
      const randomCharacter = Math.floor(Math.random() * allowedTypes.length)
      yield new allowedTypes[randomCharacter](randomLevel);
    }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let arr = [];
  const randomGeneratorCharacter = characterGenerator(allowedTypes, maxLevel)
  for (let a = 0; a < characterCount; a++ ) {
    arr.push(randomGeneratorCharacter.next().value);
  }
  return arr;
}