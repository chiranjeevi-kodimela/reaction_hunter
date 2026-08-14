import { useState } from "react";

function App() {
  const [position, setPosition] = useState({
    top: 200,
    left: 350,
  });

  const [reactionTime, setReactionTime] = useState(null);

  const [startTime, setStartTime] = useState(Date.now());

  function moveTarget() {
    const endTime = Date.now();

    const reaction = endTime - startTime;

    setReactionTime(reaction);

    const newTop = Math.floor(Math.random() * 440);
    const newLeft = Math.floor(Math.random() * 740);

    setPosition({
      top: newTop,
      left: newLeft,
    });

    setStartTime(Date.now());
  }

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      <p>
        Reaction Time:{" "}
        {reactionTime !== null ? `${reactionTime} ms` : "Ready..."}
      </p>

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