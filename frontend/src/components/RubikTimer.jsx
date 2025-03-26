import React, { useState, useEffect, useRef, useCallback } from "react";
import EventSelector from "./EventSelector";
import ScrambleViewer from "./ScrambleViewer";
import TimerDisplay from "./TimerDisplay";
import SolveStats from "./SolveStats";
import SolveHistory from "./SolveHistory";
import { randomScrambleForEvent } from "cubing/scramble";
import "cubing/twisty";

const wcaEvents = {
  333: { puzzleID: "3x3x3", eventName: "3x3x3 Cube" },
  222: { puzzleID: "2x2x2", eventName: "2x2x2 Cube" },
  444: { puzzleID: "4x4x4", eventName: "4x4x4 Cube" },
  555: { puzzleID: "5x5x5", eventName: "5x5x5 Cube" },
  666: { puzzleID: "6x6x6", eventName: "6x6x6 Cube" },
  777: { puzzleID: "7x7x7", eventName: "7x7x7 Cube" },
  "333bf": { puzzleID: "3x3x3", eventName: "3x3x3 Blindfolded" },
  "333fm": { puzzleID: "3x3x3", eventName: "3x3x3 Fewest Moves" },
  "333oh": { puzzleID: "3x3x3", eventName: "3x3x3 One-Handed" },
  clock: { puzzleID: "clock", eventName: "Clock" },
  minx: { puzzleID: "megaminx", eventName: "Megaminx" },
  pyram: { puzzleID: "pyraminx", eventName: "Pyraminx" },
  skewb: { puzzleID: "skewb", eventName: "Skewb" },
  sq1: { puzzleID: "square1", eventName: "Square-1" },
  "444bf": { puzzleID: "4x4x4", eventName: "4x4x4 Blindfolded" },
  "555bf": { puzzleID: "5x5x5", eventName: "5x5x5 Blindfolded" },
  "333mbf": { puzzleID: "3x3x3", eventName: "3x3x3 Multi-Blind" },
};

const RubikTimer = () => {
  const [selectedEvent, setSelectedEvent] = useState("333");
  const [scramble, setScramble] = useState("");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [holdState, setHoldState] = useState("idle");

  const [solveHistory, setSolveHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("rubikTimer-solveHistory") || "[]");
  });

  const timerRef = useRef(null);
  const startTimestampRef = useRef(null);
  const updateTimerRef = useRef(null);
  const spaceHeldRef = useRef(false);
  const holdStartRef = useRef(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(
      "rubikTimer-solveHistory",
      JSON.stringify(solveHistory)
    );
  }, [solveHistory]);

  const generateScramble = useCallback(async () => {
    const newScramble = await randomScrambleForEvent(selectedEvent);
    setScramble(newScramble.toString());
  }, [selectedEvent]);

  useEffect(() => {
    generateScramble();
  }, [generateScramble]);

  useEffect(() => {
    updateTimerRef.current = (now) => {
      const elapsed = now - startTimestampRef.current;
      setTime(elapsed);
      timerRef.current = requestAnimationFrame(updateTimerRef.current);
    };
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setTime(0);

    timerRef.current = requestAnimationFrame((now) => {
      startTimestampRef.current = now;
      updateTimerRef.current(now);
    });
  }, []);

  const stopTimer = useCallback(() => {
    cancelAnimationFrame(timerRef.current);
    setIsRunning(false);
    setSolveHistory((prev) => [
      ...prev,
      {
        time,
        penalty: null,
        scramble,
        event: wcaEvents[selectedEvent].eventName,
        timestamp: new Date().toISOString(),
        note: "",
      },
    ]);
    generateScramble();
  }, [time, scramble, selectedEvent, generateScramble]);

  useEffect(() => {
    let holdTimeout;

    const handleKeyDown = (e) => {
      if (e.code === "Space") e.preventDefault();

      if (isRunning) {
        stopTimer();
        return;
      }

      if (e.code === "Space" && !spaceHeldRef.current) {
        spaceHeldRef.current = true;
        setHoldState("holding");
        isReadyRef.current = false;

        holdTimeout = setTimeout(() => {
          setHoldState("ready");
          isReadyRef.current = true;
        }, 500);

        holdStartRef.current = Date.now();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") e.preventDefault();

      if (e.code === "Space" && spaceHeldRef.current) {
        clearTimeout(holdTimeout);

        if (isReadyRef.current) startTimer();

        setHoldState("idle");
        spaceHeldRef.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearTimeout(holdTimeout);
    };
  }, [isRunning, startTimer, stopTimer]);

  const updateSolvePenalty = (index, penalty) => {
    setSolveHistory((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], penalty };
      return updated;
    });
  };

  const updateSolveNote = (index, newNote) => {
    setSolveHistory((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], note: newNote };
      return updated;
    });
  };

  const deleteSolve = (index) => {
    setSolveHistory((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <EventSelector
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        events={wcaEvents}
      />

      <button
        onClick={generateScramble}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition duration-200"
      >
        Generate New Scramble
      </button>

      <TimerDisplay time={time} holdState={holdState} />
      <ScrambleViewer
        scramble={scramble}
        puzzle={wcaEvents[selectedEvent].puzzleID}
      />
      <SolveStats solves={solveHistory} />
      <SolveHistory
        solves={solveHistory}
        onPenaltyChange={updateSolvePenalty}
        onDelete={deleteSolve}
        onNoteChange={updateSolveNote}
      />
    </div>
  );
};

export default RubikTimer;
