import { useEffect, useState } from "react";

const difficultySettings = {
  easy: {
    label: "Easy",
    targetSize: 60,
    lives: 5,
    time: 30,
  },

  medium: {
    label: "Medium",
    targetSize: 45,
    lives: 3,
    time: 30,
  },

  hard: {
    label: "Hard",
    targetSize: 30,
    lives: 2,
    time: 30,
  },
};

function App() {
  const [gameState, setGameState] = useState("ready");

  const [difficulty, setDifficulty] = useState("easy");

  const [position, setPosition] = useState({
    top: 200,
    left: 350,
  });

  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestReaction, setBestReaction] = useState(null);

  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30);

  const settings = difficultySettings[difficulty];

  function getNewPosition() {
    const targetSize = settings.targetSize;

    const newTop = Math.floor(
      Math.random() * (500 - targetSize)
    );

    const newLeft = Math.floor(
      Math.random() * (800 - targetSize)
    );

    setPosition({
      top: newTop,
      left: newLeft,
    });
  }

  function selectDifficulty(level) {
    setDifficulty(level);
  }

  function startGame() {
    setGameState("playing");

    setScore(0);
    setStreak(0);

    setLives(settings.lives);
    setTimeLeft(settings.time);

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

    if (
      bestReaction === null ||
      reaction < bestReaction
    ) {
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

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setGameState("gameover");

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [gameState]);

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      {gameState === "ready" && (
        <div className="menu">
          <h2>Choose Difficulty</h2>

          <div className="difficulty-buttons">
            <button
              className={difficulty === "easy" ? "selected" : ""}
              onClick={() => selectDifficulty("easy")}
            >
              Easy
            </button>

            <button
              className={difficulty === "medium" ? "selected" : ""}
              onClick={() => selectDifficulty("medium")}
            >
              Medium
            </button>

            <button
              className={difficulty === "hard" ? "selected" : ""}
              onClick={() => selectDifficulty("hard")}
            >
              Hard
            </button>
          </div>

          <p>
            Target: {settings.targetSize}px
          </p>

          <p>
            Lives: {settings.lives}
          </p>

          <p>
            Time: {settings.time}s
          </p>

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
              Time: {timeLeft}s
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
                width: `${settings.targetSize}px`,
                height: `${settings.targetSize}px`,
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
            Difficulty:{" "}
            <strong>{settings.label}</strong>
          </p>

          <p>
            Final Score:{" "}
            <strong>{score}</strong>
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

          <button
            onClick={() => setGameState("ready")}
          >
            Change Difficulty
          </button>
        </div>
      )}
    </div>
  );
}

export default App;