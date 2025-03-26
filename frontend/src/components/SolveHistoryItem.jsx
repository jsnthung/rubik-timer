import { useState } from "react";

const SolveHistoryItem = ({
  solve,
  index,
  onPenaltyChange,
  onDelete,
  reverseIndex,
  onNoteChange,
}) => {
  const getFinalTime = (s) => (s.penalty === "+2" ? s.time + 2000 : s.time);
  const formatTime = (ms) =>
    `${Math.floor(ms / 1000)}.${Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, "0")}s`;

  const display = () => {
    if (solve.penalty === "DNF") return "DNF";
    const base = getFinalTime(solve);
    return solve.penalty === "+2"
      ? `${formatTime(base)} (+2)`
      : formatTime(base);
  };

  const formatTimestamp = (ts) =>
    new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const [note, setNote] = useState(solve.note || "");

  const handleNoteChange = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
    onNoteChange && onNoteChange(reverseIndex, newNote);
  };

  return (
    <li key={index} className="border-b border-gray-700 pb-3 flex gap-3">
      <div className="text-gray-500 text-sm">{index + 1}.</div>
      <div className="flex-1">
        <div className="text-white font-medium">{display()}</div>
        <div className="text-xs text-gray-400 italic">
          {solve.event} – {formatTimestamp(solve.timestamp)}
        </div>
        <div className="text-xs text-gray-500 break-words">
          Scramble: {solve.scramble}
        </div>

        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Add a note..."
          className="mt-1 w-full text-xs bg-gray-800 text-white border border-gray-600 rounded p-1 resize-none"
          rows={2}
        />

        <div className="flex space-x-2 mt-2">
          {solve.penalty === "+2" ? (
            <button
              onClick={() => onPenaltyChange(reverseIndex, null)}
              className="text-xs text-yellow-400 hover:underline"
            >
              Undo +2
            </button>
          ) : solve.penalty !== "DNF" ? (
            <button
              onClick={() => onPenaltyChange(reverseIndex, "+2")}
              className="text-xs text-yellow-400 hover:underline"
            >
              +2s
            </button>
          ) : null}

          {solve.penalty !== "DNF" ? (
            <button
              onClick={() => onPenaltyChange(reverseIndex, "DNF")}
              className="text-xs text-red-400 hover:underline"
            >
              DNF
            </button>
          ) : (
            <button
              onClick={() => onPenaltyChange(reverseIndex, null)}
              className="text-xs text-green-400 hover:underline"
            >
              Undo DNF
            </button>
          )}

          <button
            onClick={() => onDelete(reverseIndex)}
            className="text-xs text-gray-400 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default SolveHistoryItem;
