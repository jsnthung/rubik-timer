const SolveStats = ({ solves }) => {
  const getFinalTime = (s) => (s.penalty === "+2" ? s.time + 2000 : s.time);
  const valid = solves.filter((s) => s.penalty !== "DNF");

  const best = valid.length ? Math.min(...valid.map(getFinalTime)) : null;
  const avg = valid.length
    ? valid.reduce((a, s) => a + getFinalTime(s), 0) / valid.length
    : null;
  const last10 = valid.slice(-10);
  const avg10 =
    last10.length === 10
      ? last10.reduce((a, s) => a + getFinalTime(s), 0) / 10
      : null;

  const format = (ms) =>
    ms !== null
      ? `${Math.floor(ms / 1000)}.${Math.floor((ms % 1000) / 10)
          .toString()
          .padStart(2, "0")}s`
      : "—";

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold mb-2">📈 Solve Stats</h3>
      <ul className="text-sm text-gray-300 space-y-1">
        <li>🏆 Best: {format(best)}</li>
        <li>📊 Average: {format(avg)}</li>
        <li>🔟 Avg of last 10: {format(avg10)}</li>
      </ul>
    </div>
  );
};

export default SolveStats;
