function StartScreen({ difficulty, settings, onDifficultyChange, onStart }) {
  return (
    <div className="menu">
      <h2>Choose Difficulty</h2>

      <div className="difficulty-buttons">
        <button
          className={difficulty === "easy" ? "selected" : ""}
          onClick={() => onDifficultyChange("easy")}
        >
          Easy
        </button>

        <button
          className={difficulty === "medium" ? "selected" : ""}
          onClick={() => onDifficultyChange("medium")}
        >
          Medium
        </button>

        <button
          className={difficulty === "hard" ? "selected" : ""}
          onClick={() => onDifficultyChange("hard")}
        >
          Hard
        </button>
      </div>

      <p>Target: {settings.targetSize}px</p>
      <p>Lives: {settings.lives}</p>
      <p>Time: {settings.time}s</p>
      <p>Reaction Window: {settings.targetTime / 1000}s</p>

      <button onClick={onStart}>Start Game</button>
    </div>
  );
}

export default StartScreen;
