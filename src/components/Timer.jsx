import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";

const Timer = () => {
  const [time, setTime] = useState({ min: 0, sec: 0, ms: 0 });
  const [action, setAction] = useState("");
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const savedTime = JSON.parse(localStorage.getItem("timer"));
    const savedAction = localStorage.getItem("timerAction");
    const savedLaps = JSON.parse(localStorage.getItem("laps"));

    if (savedTime) setTime(savedTime);
    if (savedAction) setAction(savedAction === "play" ? "stop" : savedAction);
    if (savedLaps) setLaps(savedLaps);
  }, []);

  useEffect(() => {
    localStorage.setItem("timer", JSON.stringify(time));
  }, [time]);

  useEffect(() => {
    localStorage.setItem("timerAction", action);
  }, [action]);

  useEffect(() => {
    localStorage.setItem("laps", JSON.stringify(laps));
  }, [laps]);

  useEffect(() => {
    clearInterval(intervalRef.current);

    if (action === "play") {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          let ms = prev.ms + 1;
          let sec = prev.sec;
          let min = prev.min;

          if (ms === 100) {
            ms = 0;
            sec += 1;
          }
          if (sec === 60) {
            sec = 0;
            min += 1;
          }

          return { min, sec, ms };
        });
      }, 10);
    }

    if (action === "reset") {
      setTime({ min: 0, sec: 0, ms: 0 });
      setLaps([]);
    }

    return () => clearInterval(intervalRef.current);
  }, [action]);

  const handleAction = (value) => {
    if (value === "play") setAction("play");
    if (value === "stop") setAction("stop");
    if (value === "reset") setAction("reset");
  };

  const handleLap = () => {
    setLaps((prev) => [
      ...prev,
      `${String(time.min).padStart(2, "0")}:${String(time.sec).padStart(
        2,
        "0"
      )}:${String(time.ms).padStart(2, "0")}`,
    ]);
  };

  return (
    <div className="timer-container">
      <h1 className="timer-display">
        {String(time.min).padStart(2, "0")}:{String(time.sec).padStart(2, "0")}:
        {String(time.ms).padStart(2, "0")}
      </h1>

      <div className="timer-buttons">
        <button
          className={`btn ${action === "play" ? "active" : ""}`}
          onClick={() => handleAction("play")}
        >
          Play
        </button>
        <button
          className={`btn ${action === "stop" ? "active" : ""}`}
          onClick={() => handleAction("stop")}
        >
          Stop
        </button>
        <button
          className={`btn ${action === "reset" ? "active" : ""}`}
          onClick={() => handleAction("reset")}
        >
          Reset
        </button>
        <button
          className="btn lap-btn"
          onClick={handleLap}
          disabled={action !== "play"}
        >
          Lap
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-container">
          <h3>Laps</h3>
          <ul>
            {laps.map((lap, index) => (
              <li key={index}>
                Lap {index + 1}: {lap}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Timer;