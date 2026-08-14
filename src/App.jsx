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

  function moveTarget() {
    const endTime = Date.now();

    const reaction = endTime - startTime;

    setReactionTime(reaction);

    // Increase score
    setScore((currentScore) => currentScore + 1);

    // Increase streak
    setStreak((currentStreak) => currentStreak + 1);

    // Update best reaction time
    if (bestReaction === null || reaction < bestReaction) {
      setBestReaction(reaction);
    }

    // Generate new target position
    const newTop = Math.floor(Math.random() * 440);
    const newLeft = Math.floor(Math.random() * 740);

    setPosition({
      top: newTop,
      left: newLeft,
    });

    // Start timer for the next target
    setStartTime(Date.now());
  }

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      <div className="stats">
        <p>Score: {score}</p>
        <p>Streak: {streak}</p>
        <p>
          Best: {bestReaction !== null ? `${bestReaction} ms` : "--"}
        </p>
        <p>
          Reaction:{" "}
          {reactionTime !== null ? `${reactionTime} ms` : "Ready..."}
        </p>
      </div>

      <div className="game-area">
        <div
          className="target"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          onClick={moveTarget}
        ></div>
      </div>
    </div>
  );
}

export default App;