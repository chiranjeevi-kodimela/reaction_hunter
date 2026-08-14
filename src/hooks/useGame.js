import { useEffect, useState } from "react";

const difficultySettings = {
  easy: {
    label: "Easy",
    targetSize: 60,
    lives: 5,
    time: 30,
  },

  medium: {
    label: "Medium",
    targetSize: 45,
    lives: 3,
    time: 30,
  },

  hard: {
    label: "Hard",
    targetSize: 30,
    lives: 2,
    time: 30,
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

  const [bestReaction, setBestReaction] = useState(null);

  const [lives, setLives] = useState(5);

  const [misses, setMisses] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  // Feedback state
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const settings = difficultySettings[difficulty];

  function getNewPosition() {
    const targetSize = settings.targetSize;

    const newTop = Math.floor(Math.random() * (500 - targetSize));

    const newLeft = Math.floor(Math.random() * (800 - targetSize));

    setPosition({
      top: newTop,
      left: newLeft,
    });
  }

  function selectDifficulty(level) {
    setDifficulty(level);
  }

  function startGame() {
    setGameState("playing");

    setScore(0);
    setStreak(0);

    setLives(settings.lives);
    setMisses(0);

    setTimeLeft(settings.time);

    setReactionTime(null);
    setReactionTimes([]);
    setBestReaction(null);

    setFeedback({
      type: "",
      message: "",
    });

    getNewPosition();

    setStartTime(Date.now());
  }

  function handleHit(event) {
    event.stopPropagation();

    if (gameState !== "playing") {
      return;
    }

    const reaction = Date.now() - startTime;

    setReactionTime(reaction);

    // SHOW HIT FEEDBACK
    setFeedback({
      type: "hit",
      message: `+1  ${reaction} ms`,
    });

    setReactionTimes((currentTimes) => [...currentTimes, reaction]);

    setScore((currentScore) => currentScore + 1);

    setStreak((currentStreak) => {
      const newStreak = currentStreak + 1;

      if (newStreak % 5 === 0) {
        setFeedback({
          type: "streak",
          message: `${newStreak} HIT STREAK!`,
        });
      }

      return newStreak;
    });
    if (bestReaction === null || reaction < bestReaction) {
      setBestReaction(reaction);
    }

    getNewPosition();

    setStartTime(Date.now());
  }

  function handleMiss() {
    if (gameState !== "playing") {
      return;
    }

    // SHOW MISS FEEDBACK
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

    getNewPosition();

    setStartTime(Date.now());
  }

  // Game timer
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

  // Remove feedback after 1 second
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

  const averageReaction =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((total, time) => total + time, 0) /
            reactionTimes.length,
        )
      : null;

  const totalAttempts = score + misses;

  const accuracy =
    totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

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

  return {
    gameState,
    difficulty,
    settings,

    position,

    score,
    streak,
    lives,
    misses,

    timeLeft,

    reactionTime,
    bestReaction,
    averageReaction,

    accuracy,

    feedback,

    getRating,

    selectDifficulty,
    startGame,
    handleHit,
    handleMiss,

    changeToReady: () => setGameState("ready"),
  };
}

export default useGame;
