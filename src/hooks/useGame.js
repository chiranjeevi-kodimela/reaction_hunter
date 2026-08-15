import { useEffect, useState } from "react";

const difficultySettings = {
  easy: {
    label: "Easy",
    targetSize: 60,
    lives: 5,
    time: 30,
    targetTime: 2500,
    points: 1,
  },

  medium: {
    label: "Medium",
    targetSize: 50,
    lives: 3,
    time: 30,
    targetTime: 2000,
    points: 2,
  },

  hard: {
    label: "Hard",
    targetSize: 40,
    lives: 2,
    time: 30,
    targetTime: 1500,
    points: 3,
  },
};

function useGame() {
  const [gameState, setGameState] = useState("ready");

  const [difficulty, setDifficulty] = useState("easy");

  const [position, setPosition] = useState({
    top: 200,
    left: 350,
  });

  const [reactionTime, setReactionTime] = useState(null);

  const [reactionTimes, setReactionTimes] = useState([]);

  const [startTime, setStartTime] = useState(null);

  const [score, setScore] = useState(0);

  // Number of successful target hits
  const [hits, setHits] = useState(0);

  const [streak, setStreak] = useState(0);

  const [bestStreak, setBestStreak] = useState(0);

  const [multiplier, setMultiplier] = useState(1);

  const [bestReaction, setBestReaction] = useState(null);

  const [lives, setLives] = useState(5);

  const [misses, setMisses] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  const [targetTimeLeft, setTargetTimeLeft] = useState(0);

  const [targetKey, setTargetKey] = useState(0);

  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const [countdown, setCountdown] = useState(null);

  // -----------------------------------
  // High scores
  // -----------------------------------

  const [highScores, setHighScores] = useState(() => {
    const savedScores = localStorage.getItem("reactionHunterHighScores");

    return savedScores
      ? JSON.parse(savedScores)
      : {
          easy: 0,
          medium: 0,
          hard: 0,
        };
  });

  const [newHighScore, setNewHighScore] = useState(false);

  const settings = difficultySettings[difficulty];

  const highScore = highScores[difficulty];

  // -----------------------------------
  // Game history
  // -----------------------------------

  const [resultSaved, setResultSaved] = useState(false);

  const [gameHistory, setGameHistory] = useState(() => {
    const savedHistory = localStorage.getItem("reactionHunterGameHistory");

    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // -----------------------------------
  // Generate new target position
  // -----------------------------------

  function getNewPosition() {
    const targetSize = settings.targetSize;

    const gameWidth = 800;
    const gameHeight = 500;

    const minDistance = 150;

    let newTop;
    let newLeft;

    let attempts = 0;

    do {
      newTop = Math.floor(Math.random() * (gameHeight - targetSize));

      newLeft = Math.floor(Math.random() * (gameWidth - targetSize));

      attempts++;

      const distance = Math.sqrt(
        Math.pow(newLeft - position.left, 2) +
          Math.pow(newTop - position.top, 2),
      );

      if (distance >= minDistance || attempts >= 20) {
        break;
      }
    } while (true);

    setPosition({
      top: newTop,
      left: newLeft,
    });
  }

  // -----------------------------------
  // Difficulty
  // -----------------------------------

  function selectDifficulty(level) {
    setDifficulty(level);
  }

  // -----------------------------------
  // Start game
  // -----------------------------------

  function startGame() {
    setScore(0);

    setHits(0);

    setStreak(0);

    setBestStreak(0);

    setMultiplier(1);

    setLives(settings.lives);

    setMisses(0);

    setTimeLeft(settings.time);

    setReactionTime(null);

    setReactionTimes([]);

    setBestReaction(null);

    setTargetTimeLeft(settings.targetTime);

    setTargetKey(0);

    setFeedback({
      type: "",
      message: "",
    });

    setNewHighScore(false);

    setResultSaved(false);

    getNewPosition();

    setCountdown(3);

    setGameState("countdown");
  }

  // -----------------------------------
  // Target HIT
  // -----------------------------------

  function handleHit(event) {
    event.stopPropagation();

    if (gameState !== "playing") {
      return;
    }

    const reaction = Date.now() - startTime;

    setReactionTime(reaction);

    setReactionTimes((currentTimes) => [...currentTimes, reaction]);

    // Count successful hit
    setHits((currentHits) => currentHits + 1);

    // Calculate score
    setScore((currentScore) => {
      const pointsEarned = settings.points * multiplier;

      const newScore = currentScore + pointsEarned;

      if (newScore > highScore) {
        const updatedHighScores = {
          ...highScores,
          [difficulty]: newScore,
        };

        setHighScores(updatedHighScores);

        setNewHighScore(true);

        localStorage.setItem(
          "reactionHunterHighScores",
          JSON.stringify(updatedHighScores),
        );
      }

      return newScore;
    });

    // Update streak
    setStreak((currentStreak) => {
      const newStreak = currentStreak + 1;

      // Track best streak
      setBestStreak((currentBest) => Math.max(currentBest, newStreak));

      let newMultiplier = 1;

      if (newStreak >= 15) {
        newMultiplier = 4;
      } else if (newStreak >= 10) {
        newMultiplier = 3;
      } else if (newStreak >= 5) {
        newMultiplier = 2;
      }

      setMultiplier(newMultiplier);

      if (newStreak % 5 === 0) {
        setFeedback({
          type: "streak",
          message: `${newStreak} HIT STREAK! ×${newMultiplier}`,
        });
      } else {
        const pointsEarned = settings.points * multiplier;

        setFeedback({
          type: "hit",
          message: `+${pointsEarned}  ${reaction} ms`,
        });
      }

      return newStreak;
    });

    // Best reaction
    if (bestReaction === null || reaction < bestReaction) {
      setBestReaction(reaction);
    }

    // Generate next target
    getNewPosition();

    setTargetKey((currentKey) => currentKey + 1);

    setTargetTimeLeft(settings.targetTime);

    setStartTime(Date.now());
  }

  // -----------------------------------
  // Target MISS
  // -----------------------------------

  function handleMiss() {
    if (gameState !== "playing") {
      return;
    }

    setFeedback({
      type: "miss",
      message: "MISS!",
    });

    setMisses((currentMisses) => currentMisses + 1);

    setLives((currentLives) => {
      const newLives = currentLives - 1;

      if (newLives <= 0) {
        setGameState("gameover");
      }

      return newLives;
    });

    setStreak(0);

    setMultiplier(1);

    getNewPosition();

    setTargetKey((currentKey) => currentKey + 1);

    setTargetTimeLeft(settings.targetTime);

    setStartTime(Date.now());
  }

  // -----------------------------------
  // Target TIMEOUT
  // -----------------------------------

  function handleTargetTimeout() {
    if (gameState !== "playing") {
      return;
    }

    setFeedback({
      type: "timeout",
      message: "TIME OUT!",
    });

    setMisses((currentMisses) => currentMisses + 1);

    setLives((currentLives) => {
      const newLives = currentLives - 1;

      if (newLives <= 0) {
        setGameState("gameover");
      }

      return newLives;
    });

    setStreak(0);

    setMultiplier(1);

    getNewPosition();

    setTargetKey((currentKey) => currentKey + 1);

    setTargetTimeLeft(settings.targetTime);

    setStartTime(Date.now());
  }

  // -----------------------------------
  // Average reaction
  // -----------------------------------

  const averageReaction =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((total, time) => total + time, 0) /
            reactionTimes.length,
        )
      : null;

  // -----------------------------------
  // Accuracy
  // -----------------------------------

  const totalAttempts = hits + misses;

  const accuracy =
    totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 0;

  // -----------------------------------
  // Rating
  // -----------------------------------

  function getRating() {
    if (averageReaction === null) {
      return "No Data";
    }

    if (averageReaction < 300 && accuracy >= 90) {
      return "LEGENDARY";
    }

    if (averageReaction < 400 && accuracy >= 80) {
      return "EXCELLENT";
    }

    if (averageReaction < 500 && accuracy >= 70) {
      return "GREAT";
    }

    if (averageReaction < 700) {
      return "GOOD";
    }

    return "KEEP PRACTICING";
  }

  // -----------------------------------
  // Save completed game
  // -----------------------------------

  function saveGameResult() {
    const result = {
      id: Date.now(),

      difficulty: settings.label,

      score,

      hits,

      misses,

      accuracy,

      averageReaction,

      bestReaction,

      bestStreak,

      rating: getRating(),
    };

    setGameHistory((currentHistory) => {
      const updatedHistory = [result, ...currentHistory].slice(0, 5);

      localStorage.setItem(
        "reactionHunterGameHistory",
        JSON.stringify(updatedHistory),
      );

      return updatedHistory;
    });
  }

  // -----------------------------------
  // Overall statistics
  // -----------------------------------

  const statistics = {
    gamesPlayed: gameHistory.length,

    totalHits: gameHistory.reduce((total, game) => total + (game.hits || 0), 0),

    totalMisses: gameHistory.reduce(
      (total, game) => total + (game.misses || 0),
      0,
    ),

    bestScore:
      gameHistory.length > 0
        ? Math.max(...gameHistory.map((game) => game.score || 0))
        : 0,

    bestStreak:
      gameHistory.length > 0
        ? Math.max(...gameHistory.map((game) => game.bestStreak || 0))
        : 0,

    bestReaction:
      gameHistory.length > 0
        ? (() => {
            const reactions = gameHistory
              .map((game) => game.bestReaction)
              .filter((value) => value !== null && value !== undefined);

            return reactions.length > 0 ? Math.min(...reactions) : null;
          })()
        : null,

    averageReaction:
      gameHistory.length > 0
        ? Math.round(
            gameHistory.reduce(
              (total, game) => total + (game.averageReaction || 0),
              0,
            ) / gameHistory.length,
          )
        : null,

    averageAccuracy:
      gameHistory.length > 0
        ? Math.round(
            gameHistory.reduce(
              (total, game) => total + (game.accuracy || 0),
              0,
            ) / gameHistory.length,
          )
        : 0,
  };

  // -----------------------------------
  // Overall game timer
  // -----------------------------------

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setGameState("gameover");

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [gameState]);

  // -----------------------------------
  // Target timeout timer
  // -----------------------------------

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const timer = setTimeout(() => {
      handleTargetTimeout();
    }, settings.targetTime);

    return () => {
      clearTimeout(timer);
    };
  }, [gameState, targetKey, difficulty]);

  // -----------------------------------
  // Visual target countdown
  // -----------------------------------

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    setTargetTimeLeft(settings.targetTime);

    const countdownTimer = setInterval(() => {
      setTargetTimeLeft((currentTime) => {
        if (currentTime <= 100) {
          return 0;
        }

        return currentTime - 100;
      });
    }, 100);

    return () => {
      clearInterval(countdownTimer);
    };
  }, [gameState, targetKey, difficulty]);

  // -----------------------------------
  // Feedback timer
  // -----------------------------------

  useEffect(() => {
    if (!feedback.message) {
      return;
    }

    const timeout = setTimeout(() => {
      setFeedback({
        type: "",
        message: "",
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [feedback]);

  // -----------------------------------
  // Start countdown
  // -----------------------------------

  useEffect(() => {
    if (gameState !== "countdown") {
      return;
    }

    if (countdown === null) {
      return;
    }

    if (countdown === 0) {
      setGameState("playing");

      setTimeLeft(settings.time);

      setTargetTimeLeft(settings.targetTime);

      setStartTime(Date.now());

      return;
    }

    const timer = setTimeout(() => {
      setCountdown((currentCountdown) => {
        if (currentCountdown === 1) {
          return 0;
        }

        return currentCountdown - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [gameState, countdown, settings.time, settings.targetTime]);

  // -----------------------------------
  // Save result when game ends
  // -----------------------------------

  useEffect(() => {
    if (gameState === "gameover" && !resultSaved) {
      saveGameResult();

      setResultSaved(true);
    }
  }, [gameState, resultSaved]);

  // -----------------------------------
  // Return game data
  // -----------------------------------

  return {
    gameState,

    gameHistory,

    statistics,

    difficulty,

    settings,

    position,

    targetTimeLeft,

    score,

    hits,

    highScore,

    highScores,

    newHighScore,

    streak,

    bestStreak,

    multiplier,

    lives,

    misses,

    timeLeft,

    reactionTime,

    bestReaction,

    averageReaction,

    countdown,

    accuracy,

    feedback,

    getRating,

    selectDifficulty,

    startGame,

    handleHit,

    handleMiss,

    handleTargetTimeout,

    changeToReady: () => {
      setGameState("ready");
    },
  };
}

export default useGame;
