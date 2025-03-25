const SolveHistoryItem = ({
  solve,
  index,
  onPenaltyChange,
  onDelete,
  reverseIndex,
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

  return (
    <li key={index} className="border-b border-gray-700 pb-2">
      <div className="text-white font-medium">{display()}</div>
      <div className="text-xs text-gray-400 italic">
        {solve.event} – {formatTimestamp(solve.timestamp)}
      </div>
      <div className="text-xs text-gray-500 break-words">
        Scramble: {solve.scramble}
      </div>
      <div className="flex space-x-2 mt-1">
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
    </li>
  );
};

export default SolveHistoryItem;
