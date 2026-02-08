import { Random } from "../random.js";

export function rollDice(
  amount: number,
  diceSides: number,
  seed: number,
): number[] {
  const random = new Random(seed);

  const rolls: number[] = [];
  for (let i = 0; i < amount; i++) {
    const roll = Math.floor(random.getFloat() * diceSides) + 1;
    rolls.push(roll);
  }

  return rolls;
}

export function getRollText(rolls: number[]): string {
  if (rolls.length === 1 && rolls[0]) {
    return rolls[0].toString();
  }
  return `[ ${rolls.join(", ")}] `;
}

export function getRollHtml(rolls: number[], diceSides: number): string {
  let texts = [];
  for (const roll of rolls) {
    if (roll === 1) {
      texts.push(`<span class="nerthus-dice-min">${roll}</span>`);
    } else if (roll === diceSides) {
      texts.push(`<span  class="nerthus-dice-max">${roll}</span>`);
    } else {
      texts.push(roll);
    }
  }
  if (texts.length === 1 && texts[0]) {
    return texts[0].toString();
  }
  return `[ ${texts.join(", ")} ]`;
}
