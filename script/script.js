let attemptCount = 0;

function rollDice() {
  const diceEl = document.getElementById('dice');
  const winMessage = document.getElementById('win-message');
  const attemptsEl = document.getElementById('attempts');
  const sound = document.getElementById('diceSound');

  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  const roll1 = Math.floor(Math.random() * 6) + 1;
  const roll2 = Math.floor(Math.random() * 6) + 1;
  const sum = roll1 + roll2;

  diceEl.textContent = `${diceFaces[roll1 - 1]} ${diceFaces[roll2 - 1]}`;
  attemptCount++;
  attemptsEl.textContent = `Attempts: ${attemptCount}`;

  if (sum === 10) {
    winMessage.textContent = "🎉 You got 10! You win!";
  } else {
    winMessage.textContent = "";
  }

  sound.currentTime = 0;
  sound.play();
}

