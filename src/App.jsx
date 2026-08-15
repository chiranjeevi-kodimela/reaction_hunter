import StartScreen from "./components/StartScreen";
import GameStats from "./components/GameStats";
import GameBoard from "./components/GameBoard";
import ResultsScreen from "./components/ResultsScreen";
import Feedback from "./components/Feedback";
import GameHistory from "./components/GameHistory";
import useGame from "./hooks/useGame";
import useSound from "./hooks/useSound";
import { useEffect } from "react";
import Statistics from "./components/Statistics";
import DifficultyStats from "./components/DifficultyStats";

function App() {
  const game = useGame();
  const sound = useSound();

  useEffect(() => {
    if (game.gameState === "countdown" && game.countdown !== null) {
      if (game.countdown === 0) {
        sound.goSound();
      } else {
        sound.countdownSound();
      }
    }
  }, [game.gameState, game.countdown]);

  useEffect(() => {
    if (game.feedback.type === "timeout") {
      sound.timeoutSound();
    }
  }, [game.feedback.type]);

  useEffect(() => {
    if (game.newHighScore) {
      sound.newRecordSound();
    }
  }, [game.newHighScore]);

  return (
    <div className="game">
      <h1>Reaction Hunter</h1>

      <button className="sound-button" onClick={sound.toggleSound}>
        {sound.soundEnabled ? "🔊 Sound" : "🔇 Muted"}
      </button>

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
            onHit={(event) => {
              sound.hitSound();
              game.handleHit(event);
            }}
            onMiss={() => {
              sound.missSound();
              game.handleMiss();
            }}
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

          <Statistics statistics={game.statistics} />
          
          <DifficultyStats difficultyStatistics={game.difficultyStatistics} />
        </>
      )}
    </div>
  );
}

export default App;
