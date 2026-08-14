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
  const [reactionTimes, setReactionTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestReaction, setBestReaction] = useState(null);

  const [lives, setLives] = useState(5);
  const [misses, setMisses] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  const settings = difficultySettings[difficulty];

  // Generate a random position for the target
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

  // Select difficulty
  function selectDifficulty(level) {
    setDifficulty(level);
  }

  // Start or restart the game
  function startGame() {
    setGameState("playing");

    setScore(0);
    setStreak(0);

    setLives(settings.lives);
    setMisses(0);

    setTimeLeft(settings.time);

    setReactionTime(null);
    setReactionTimes([]);
    setBestReaction(null);

    getNewPosition();

    setStartTime(Date.now());
  }

  // Handle successful target click
  function handleHit(event) {
    // Prevent the click from also being treated as a miss
    event.stopPropagation();

    if (gameState !== "playing") {
      return;
    }

    const endTime = Date.now();
    const reaction = endTime - startTime;

    setReactionTime(reaction);

    // Store reaction time
    setReactionTimes((currentTimes) => [
      ...currentTimes,
      reaction,
    ]);

    // Increase score
    setScore((currentScore) => currentScore + 1);

    // Increase streak
    setStreak((currentStreak) => currentStreak + 1);

    // Update best reaction
    if (
      bestReaction === null ||
      reaction < bestReaction
    ) {
      setBestReaction(reaction);
    }

    // Move target
    getNewPosition();

    // Start timing the next target
    setStartTime(Date.now());
  }

  // Handle clicking empty space
  function handleMiss() {
    if (gameState !== "playing") {
      return;
    }

    // Increase misses
    setMisses((currentMisses) => currentMisses + 1);

    // Remove one life
    setLives((currentLives) => {
      const newLives = currentLives - 1;

      if (newLives <= 0) {
        setGameState("gameover");
      }

      return newLives;
    });

    // Reset streak
    setStreak(0);

    // Move target
    getNewPosition();

    // Restart reaction timer
    setStartTime(Date.now());
  }

  // Game countdown
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

    // Cleanup timer
    return () => {
      clearInterval(timer);
    };
  }, [gameState]);

  // Calculate average reaction time
  const averageReaction =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce(
            (total, time) => total + time,
            0
          ) / reactionTimes.length
        )
      : null;

  // Calculate accuracy
  const totalAttempts = score + misses;

  const accuracy =
    totalAttempts > 0
      ? Math.round(
          (score / totalAttempts) * 100
        )
      : 0;

  // Calculate performance rating
  function getRating() {
    if (averageReaction === null) {
      return "No Data";
    }

    if (
      averageReaction < 300 &&
      accuracy >= 90
    ) {
      return "LEGENDARY";
    }

    if (
      averageReaction < 400 &&
      accuracy >= 80
    ) {
      return "EXCELLENT";
    }

    if (
      averageReaction < 500 &&
      accuracy >= 70
    ) {
      return "GREAT";
    }

    if (averageReaction < 700) {
      return "GOOD";
    }

    return "KEEP PRACTICING";
  }

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      {/* READY SCREEN */}
      {gameState === "ready" && (
        <div className="menu">
          <h2>Choose Difficulty</h2>

          <div className="difficulty-buttons">
            <button
              className={
                difficulty === "easy"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                selectDifficulty("easy")
              }
            >
              Easy
            </button>

            <button
              className={
                difficulty === "medium"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                selectDifficulty("medium")
              }
            >
              Medium
            </button>

            <button
              className={
                difficulty === "hard"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                selectDifficulty("hard")
              }
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

      {/* PLAYING SCREEN */}
      {gameState === "playing" && (
        <>
          <div className="stats">
            <p>
              Score: {score}
            </p>

            <p>
              Streak: {streak}
            </p>

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

      {/* GAME OVER / RESULTS SCREEN */}
      {gameState === "gameover" && (
        <div className="menu results">
          <h2>Game Over</h2>

          <p>
            Difficulty:{" "}
            <strong>
              {settings.label}
            </strong>
          </p>

          <div className="result-stats">
            <p>
              Score
              <strong>
                {score}
              </strong>
            </p>

            <p>
              Accuracy
              <strong>
                {accuracy}%
              </strong>
            </p>

            <p>
              Average
              <strong>
                {averageReaction !== null
                  ? `${averageReaction} ms`
                  : "--"}
              </strong>
            </p>

            <p>
              Best
              <strong>
                {bestReaction !== null
                  ? `${bestReaction} ms`
                  : "--"}
              </strong>
            </p>

            <p>
              Hits
              <strong>
                {score}
              </strong>
            </p>

            <p>
              Misses
              <strong>
                {misses}
              </strong>
            </p>
          </div>

          <h3>
            {getRating()}
          </h3>

          <button onClick={startGame}>
            Play Again
          </button>

          <button
            onClick={() =>
              setGameState("ready")
            }
          >
            Change Difficulty
          </button>
        </div>
      )}
    </div>
  );
}

export default App;