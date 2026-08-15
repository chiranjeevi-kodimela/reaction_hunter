import StartScreen from "./components/StartScreen";
import GameStats from "./components/GameStats";
import GameBoard from "./components/GameBoard";
import ResultsScreen from "./components/ResultsScreen";
import Feedback from "./components/Feedback";
import GameHistory from "./components/GameHistory";
import useGame from "./hooks/useGame";

function App() {
  const game = useGame();

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      {/* START SCREEN */}
      {game.gameState === "ready" && (
        <StartScreen
          difficulty={game.difficulty}
          settings={game.settings}
          onDifficultyChange={game.selectDifficulty}
          onStart={game.startGame}
        />
      )}

      {/*COUNTDOWN*/}
      {game.gameState === "countdown" && (
        <div className="countdown-screen">
          <div className="countdown">
            {game.countdown === 0 ? "GO!" : game.countdown}
          </div>
        </div>
      )}

      {/* GAME SCREEN */}
      {game.gameState === "playing" && (
        <>
          <GameStats
            score={game.score}
            highScore={game.highScore}
            streak={game.streak}
            multiplier={game.multiplier}
            lives={game.lives}
            timeLeft={game.timeLeft}
            bestReaction={game.bestReaction}
            reactionTime={game.reactionTime}
          />

          <Feedback type={game.feedback.type} message={game.feedback.message} />

          <GameBoard
            position={game.position}
            targetSize={game.settings.targetSize}
            targetTime={game.targetTimeLeft}
            onHit={game.handleHit}
            onMiss={game.handleMiss}
          />
        </>
      )}

      {/* RESULTS SCREEN */}
      {game.gameState === "gameover" && (
        <>
        <ResultsScreen
          difficulty={game.settings.label}
          score={game.score}
          highScore={game.highScore}
          accuracy={game.accuracy}
          averageReaction={game.averageReaction}
          bestReaction={game.bestReaction}
          misses={game.misses}
          rating={game.getRating()}
          newHighScore={game.newHighScore}
          onPlayAgain={game.startGame}
          onChangeDifficulty={game.changeToReady}
        />

        <GameHistory history={game.gameHistory} />
      </>
      )}
    </div>
  );
}

export default App;
