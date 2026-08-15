import { useEffect, useState } from "react";

const difficultySettings = {
  easy: {
    label: "Easy",
    targetSize: 60,
    lives: 5,
    time: 30,
    targetTime: 2500,
  },

  medium: {
    label: "Medium",
    targetSize: 50,
    lives: 3,
    time: 30,
    targetTime: 2000,
  },

  hard: {
    label: "Hard",
    targetSize: 40,
    lives: 2,
    time: 30,
    targetTime: 1500,
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

  const [streak, setStreak] = useState(0);

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

  // High score
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

  // Whether the current game created a new record
  const [newHighScore, setNewHighScore] = useState(false);

  const settings = difficultySettings[difficulty];

  const highScore = highScores[difficulty];

  // -----------------------------------
  // Generate a new target position
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
    newTop = Math.floor(
      Math.random() *
        (gameHeight - targetSize)
    );

    newLeft = Math.floor(
      Math.random() *
        (gameWidth - targetSize)
    );

    attempts++;

    const distance = Math.sqrt(
      Math.pow(newLeft - position.left, 2) +
        Math.pow(newTop - position.top, 2)
    );

    if (
      distance >= minDistance ||
      attempts >= 20
    ) {
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
    setStreak(0);
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

    // Prepare target but don't start the game yet
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

    // Calculate score using current multiplier
    setScore((currentScore) => {
      const newScore = currentScore + multiplier;

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

    // Update streak and multiplier
    setStreak((currentStreak) => {
      const newStreak = currentStreak + 1;

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
        setFeedback({
          type: "hit",
          message: `+${multiplier}  ${reaction} ms`,
        });
      }

      return newStreak;
    });

    // Best reaction time
    if (bestReaction === null || reaction < bestReaction) {
      setBestReaction(reaction);
    }

    // New target
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

    const countdown = setInterval(() => {
      setTargetTimeLeft((currentTime) => {
        if (currentTime <= 100) {
          return 0;
        }

        return currentTime - 100;
      });
    }, 100);

    return () => {
      clearInterval(countdown);
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

  const totalAttempts = score + misses;

  const accuracy =
    totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

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
  // Return game data
  // -----------------------------------

  return {
    gameState,

    difficulty,

    settings,

    position,

    targetTimeLeft,

    score,

    highScore,

    highScores,

    newHighScore,

    streak,

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

    changeToReady: () => {
      setGameState("ready");
    },
  };
}

export default useGame;
