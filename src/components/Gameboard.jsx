function GameBoard({
  position,
  targetSize,
  onHit,
  onMiss,
}) {
  return (
    <div
      className="game-area"
      onClick={onMiss}
    >
      <div
        className="target"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${targetSize}px`,
          height: `${targetSize}px`,
        }}
        onClick={onHit}
      ></div>
    </div>
  );
}

export default GameBoard;