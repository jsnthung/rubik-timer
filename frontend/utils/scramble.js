const moves = ["R", "L", "U", "D", "F", "B"];
const modifiers = ["", "'", "2"];

export const generateScramble = (length = 20) => {
  const scramble = [];
  let prevMove = null;

  while (scramble.length < length) {
    const move = moves[Math.floor(Math.random() * moves.length)];

    // Prevent same move twice in a row (e.g., R R')
    if (move === prevMove) continue;

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    prevMove = move;
  }

  return scramble.join(" ");
};
