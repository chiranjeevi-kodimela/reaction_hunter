function GameBoard({ position, targetSize, targetTime, onHit, onMiss }) {
  return (
    <div className="game-area" onClick={onMiss}>
      <div
        className="target"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${targetSize}px`,
          height: `${targetSize}px`,
        }}
        onClick={onHit}
      >
        <span>{(targetTime / 1000).toFixed(1)}</span>
      </div>
    </div>
  );
}

export default GameBoard;
