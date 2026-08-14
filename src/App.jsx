import { useState } from "react";

function App() {
  const [gameState, setGameState] = useState("ready");

  const [position, setPosition] = useState({
    top: 200,
    left: 350,
  });

  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

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
  }

  function startGame() {
    setGameState("playing");

    setScore(0);
    setStreak(0);
    setLives(3);
    setReactionTime(null);
    setBestReaction(null);

    getNewPosition();

    setStartTime(Date.now());
  }

  function handleHit(event) {
    event.stopPropagation();

    if (gameState !== "playing") {
      return;
    }

    const endTime = Date.now();
    const reaction = endTime - startTime;

    setReactionTime(reaction);

    setScore((currentScore) => currentScore + 1);

    setStreak((currentStreak) => currentStreak + 1);

    if (bestReaction === null || reaction < bestReaction) {
      setBestReaction(reaction);
    }

    getNewPosition();

    setStartTime(Date.now());
  }

  function handleMiss() {
    if (gameState !== "playing") {
      return;
    }

    setLives((currentLives) => {
      const newLives = currentLives - 1;

      if (newLives <= 0) {
        setGameState("gameover");
      }

      return newLives;
    });

    setStreak(0);

    getNewPosition();

    setStartTime(Date.now());
  }

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      {gameState === "ready" && (
        <div className="menu">
          <h2>Ready?</h2>
          <p>Click the target as fast as you can.</p>

          <button onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="stats">
            <p>Score: {score}</p>

            <p>Streak: {streak}</p>

            <p>
              Lives: {"♥".repeat(lives)}
            </p>

            <p>
              Best:{" "}
              {bestReaction !== null
                ? `${bestReaction} ms`
                : "--"}
            </p>

            <p>
              Reaction:{" "}
              {reactionTime !== null
                ? `${reactionTime} ms`
                : "Ready..."}
            </p>
          </div>

          <div
            className="game-area"
            onClick={handleMiss}
          >
            <div
              className="target"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
              }}
              onClick={handleHit}
            ></div>
          </div>
        </>
      )}

      {gameState === "gameover" && (
        <div className="menu">
          <h2>Game Over</h2>

          <p>
            Final Score: <strong>{score}</strong>
          </p>

          <p>
            Best Reaction:{" "}
            <strong>
              {bestReaction !== null
                ? `${bestReaction} ms`
                : "--"}
            </strong>
          </p>

          <button onClick={startGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;