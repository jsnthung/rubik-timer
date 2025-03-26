import SolveHistoryItem from "./SolveHistoryItem";

const SolveHistory = ({ solves, onPenaltyChange, onDelete, onNoteChange }) => (
  <div className="mt-6">
    <h3 className="text-lg font-bold mb-2">📜 Solve History</h3>
    {solves.length > 0 ? (
      <ol className="text-sm text-gray-400 pl-5 space-y-2 list-none">
        {solves
          .slice()
          .reverse()
          .map((solve, i) => (
            <SolveHistoryItem
              key={i}
              index={i}
              solve={solve}
              reverseIndex={solves.length - 1 - i}
              onPenaltyChange={onPenaltyChange}
              onDelete={onDelete}
              onNoteChange={onNoteChange}
            />
          ))}
      </ol>
    ) : (
      <p className="text-gray-500">No solves yet.</p>
    )}
  </div>
);

export default SolveHistory;
