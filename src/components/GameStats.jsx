function GameStats({
  score,
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

      <p>Streak: {streak}</p>
      <p>Multiplier: ×{multiplier}</p>
      <p>Lives: {"♥".repeat(lives)}</p>

      <p>Time: {timeLeft}s</p>

      <p>Best: {bestReaction !== null ? `${bestReaction} ms` : "--"}</p>

      <p>
        Reaction: {reactionTime !== null ? `${reactionTime} ms` : "Ready..."}
      </p>
    </div>
  );
}

export default GameStats;
