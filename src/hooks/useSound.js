import { useCallback, useRef, useState } from "react";

function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioContextRef = useRef(null);

  function getAudioContext() {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        return null;
      }

      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  }

  const playTone = useCallback(
    (frequency, duration = 0.1, type = "sine", volume = 0.08) => {
      if (!soundEnabled) {
        return;
      }

      const context = getAudioContext();

      if (!context) {
        return;
      }

      if (context.state === "suspended") {
        context.resume();
      }

      const oscillator = context.createOscillator();

      const gain = context.createGain();

      oscillator.type = type;

      oscillator.frequency.setValueAtTime(frequency, context.currentTime);

      gain.gain.setValueAtTime(volume, context.currentTime);

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + duration,
      );

      oscillator.connect(gain);

      gain.connect(context.destination);

      oscillator.start();

      oscillator.stop(context.currentTime + duration);
    },
    [soundEnabled],
  );

  const hitSound = useCallback(() => {
    playTone(700, 0.08, "sine", 0.08);
  }, [playTone]);

  const missSound = useCallback(() => {
    playTone(180, 0.15, "square", 0.06);
  }, [playTone]);

  const timeoutSound = useCallback(() => {
    playTone(250, 0.15, "sawtooth", 0.05);
  }, [playTone]);

  const countdownSound = useCallback(() => {
    playTone(500, 0.08, "sine", 0.06);
  }, [playTone]);

  const goSound = useCallback(() => {
    playTone(900, 0.2, "sine", 0.08);
  }, [playTone]);

  const newRecordSound = useCallback(() => {
    playTone(600, 0.1);

    setTimeout(() => {
      playTone(800, 0.1);
    }, 100);

    setTimeout(() => {
      playTone(1000, 0.2);
    }, 200);
  }, [playTone]);

  function toggleSound() {
    setSoundEnabled((enabled) => !enabled);
  }

  return {
    soundEnabled,
    toggleSound,

    hitSound,
    missSound,
    timeoutSound,
    countdownSound,
    goSound,
    newRecordSound,
  };
}

export default useSound;
