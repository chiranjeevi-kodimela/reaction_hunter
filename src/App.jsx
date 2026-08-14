import StartScreen from "./components/StartScreen";
import GameStats from "./components/GameStats";
import GameBoard from "./components/GameBoard";
import ResultsScreen from "./components/ResultsScreen";
import Feedback from "./components/Feedback";

import useGame from "./hooks/useGame";

function App() {
  const game = useGame();

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      {game.gameState === "ready" && (
        <StartScreen
          difficulty={game.difficulty}
          settings={game.settings}
          onDifficultyChange={game.selectDifficulty}
          onStart={game.startGame}
        />
      )}

      {game.gameState === "playing" && (
        <>
          <GameStats
            score={game.score}
            streak={game.streak}
            lives={game.lives}
            timeLeft={game.timeLeft}
            bestReaction={game.bestReaction}
            reactionTime={game.reactionTime}
          />

          <Feedback
            type={game.feedback.type}
            message={game.feedback.message}
          />

          <GameBoard
            position={game.position}
            targetSize={game.settings.targetSize}
            onHit={game.handleHit}
            onMiss={game.handleMiss}
          />
        </>
      )}

      {game.gameState === "gameover" && (
        <ResultsScreen
          difficulty={game.settings.label}
          score={game.score}
          accuracy={game.accuracy}
          averageReaction={game.averageReaction}
          bestReaction={game.bestReaction}
          misses={game.misses}
          rating={game.getRating()}
          onPlayAgain={game.startGame}
          onChangeDifficulty={game.changeToReady}
        />
      )}
    </div>
  );
}

export default App;