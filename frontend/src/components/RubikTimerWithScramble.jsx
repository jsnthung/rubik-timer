import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../utils/api";
import EventSelector from "./EventSelector";
import ScrambleViewer from "./ScrambleViewer";
import TimerDisplay from "./TimerDisplay";
import SolveStats from "./SolveStats";
import SolveHistory from "./SolveHistory";
import { randomScrambleForEvent } from "cubing/scramble";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
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

const RubikTimerWithScramble = () => {
  const { user, isCheckingAuth } = useAuthStore();
  const isAuthenticated = !!user;

  const [selectedEvent, setSelectedEvent] = useState("333");
  const [scramble, setScramble] = useState("");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [holdState, setHoldState] = useState("idle");
  const [localSolveHistory, setLocalSolveHistory] = useLocalStorageState(
    "rubikTimer-solveHistory",
    []
  );
  const [solveHistory, setSolveHistory] = useState([]);

  const timerRef = useRef(null);
  const startTimestampRef = useRef(null);
  const updateTimerRef = useRef(null);
  const spaceHeldRef = useRef(false);
  const holdStartRef = useRef(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (isCheckingAuth) return;

    const fetchSolves = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch(`${API_URL}/solves`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) setSolveHistory(data.solves);
          else console.error("Failed to fetch solves:", data.message);
        } catch (err) {
          console.error("Error fetching solves:", err);
        }
      } else {
        setSolveHistory(localSolveHistory);
      }
    };

    fetchSolves();
  }, [isAuthenticated, isCheckingAuth, localSolveHistory]);

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

  const stopTimer = useCallback(async () => {
    cancelAnimationFrame(timerRef.current);
    setIsRunning(false);

    const newSolve = {
      time,
      penalty: null,
      scramble,
      event: wcaEvents[selectedEvent].eventName,
      timestamp: new Date().toISOString(),
      note: "",
    };

    if (isAuthenticated) {
      try {
        const res = await fetch(`${API_URL}/solves`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newSolve),
        });
        const data = await res.json();
        if (res.ok) setSolveHistory((prev) => [...prev, data.solve]);
        else console.error("Failed to save solve:", data.message);
      } catch (error) {
        console.error("Error saving solve:", error);
      }
    } else {
      const updated = [...solveHistory, newSolve];
      setSolveHistory(updated);
      setLocalSolveHistory(updated);
    }

    generateScramble();
  }, [
    time,
    scramble,
    selectedEvent,
    generateScramble,
    isAuthenticated,
    solveHistory,
    setLocalSolveHistory,
  ]);

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

  const updateSolvePenalty = async (index, penalty) => {
    const updatedSolves = [...solveHistory];
    const solve = updatedSolves[index];
    solve.penalty = penalty;

    if (isAuthenticated && solve._id) {
      try {
        await fetch(`${API_URL}/solves/${solve._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ penalty }),
        });
      } catch (err) {
        console.error("Failed to update penalty:", err);
      }
    } else {
      setLocalSolveHistory(updatedSolves);
    }

    setSolveHistory(updatedSolves);
  };

  const updateSolveNote = async (index, note) => {
    const updatedSolves = [...solveHistory];
    const solve = updatedSolves[index];
    solve.note = note;

    if (isAuthenticated && solve._id) {
      try {
        await fetch(`${API_URL}/solves/${solve._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ note }),
        });
      } catch (err) {
        console.error("Failed to update note:", err);
      }
    } else {
      setLocalSolveHistory(updatedSolves);
    }

    setSolveHistory(updatedSolves);
  };

  const deleteSolve = async (index) => {
    const updatedSolves = [...solveHistory];
    const solve = updatedSolves[index];

    if (isAuthenticated && solve._id) {
      try {
        await fetch(`${API_URL}/solves/${solve._id}`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch (err) {
        console.error("Failed to delete solve:", err);
      }
    } else {
      setLocalSolveHistory(updatedSolves.filter((_, i) => i !== index));
    }

    updatedSolves.splice(index, 1);
    setSolveHistory(updatedSolves);
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

export default RubikTimerWithScramble;
