function generateScramble333(length = 20) {
  const sides = ["R", "U", "F", "L", "D", "B"];
  const postfixes = ["", "'", "2"];

  const scramble = [];

  for (let i = 0; i < length; i++) {
    let filteredSides;
    if (
      scramble.length > 1 &&
      sides.indexOf(scramble[scramble.length - 2]) % 3 ===
        sides.indexOf(scramble[scramble.length - 1]) % 3
    ) {
      filteredSides = sides.filter(
        (side) =>
          side !== scramble[scramble.length - 1] &&
          side !== scramble[scramble.length - 2]
      );
    } else {
      filteredSides = sides.filter(
        (side) => side !== scramble[scramble.length - 1]
      );
    }

    scramble.push(
      filteredSides[Math.floor(Math.random() * filteredSides.length)]
    );
  }

  for (let i = 0; i < scramble.length; i++) {
    scramble[i] += postfixes[Math.floor(Math.random() * postfixes.length)];
  }

  return scramble.join(" ");
}

console.log(generateScramble333());
