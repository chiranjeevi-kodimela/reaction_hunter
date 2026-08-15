function GameStats({
  score,
  highScore,
  streak,
  multiplier,
  lives,
  timeLeft,
  bestReaction,
  reactionTime,
}) {
  return (
    <div className="stats">
      <p>Score: {score}</p>

      <p>Best Score: {highScore}</p>

      <p>Streak: {streak}</p>

      <p className="multiplier">Multiplier: ×{multiplier}</p>

      <p>Lives: {"♥".repeat(lives)}</p>

      <p>Time: {timeLeft}s</p>

      <p>Best: {bestReaction !== null ? `${bestReaction} ms` : "-"}</p>

      <p>Reaction: {reactionTime !== null ? `${reactionTime} ms` : "-"}</p>
    </div>
  );
}

export default GameStats;
