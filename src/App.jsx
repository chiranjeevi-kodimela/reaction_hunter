import { useState } from "react";

function App() {
  const [position, setPosition] = useState({
    top: 200,
    left: 350,
  });

  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestReaction, setBestReaction] = useState(null);

  const [lives, setLives] = useState(3);

  function getNewPosition() {
    const newTop = Math.floor(Math.random() * 440);
    const newLeft = Math.floor(Math.random() * 740);

    setPosition({
      top: newTop,
      left: newLeft,
    });

    setStartTime(Date.now());
  }

  function handleHit(event) {
    // Prevent the game area's click event from firing
    event.stopPropagation();

    const endTime = Date.now();
    const reaction = endTime - startTime;

    setReactionTime(reaction);

    setScore((currentScore) => currentScore + 1);

    setStreak((currentStreak) => currentStreak + 1);

    if (bestReaction === null || reaction < bestReaction) {
      setBestReaction(reaction);
    }

    getNewPosition();
  }

  function handleMiss() {
    setLives((currentLives) => currentLives - 1);

    setStreak(0);

    getNewPosition();
  }

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      <div className="stats">
        <p>Score: {score}</p>
        <p>Streak: {streak}</p>
        <p>Lives: {"♥".repeat(lives)}</p>

        <p>
          Best: {bestReaction !== null ? `${bestReaction} ms` : "--"}
        </p>

        <p>
          Reaction:{" "}
          {reactionTime !== null ? `${reactionTime} ms` : "Ready..."}
        </p>
      </div>

      <div className="game-area" onClick={handleMiss}>
        <div
          className="target"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          onClick={handleHit}
        ></div>
      </div>
    </div>
  );
}

export default App;