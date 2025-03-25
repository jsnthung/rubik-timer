const TimerDisplay = ({ time, holdState }) => {
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${seconds}.${hundredths.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="mt-8 text-center">
      <h2 className="text-xl font-semibold mb-2">Timer</h2>
      <div
        className={`text-5xl font-mono px-6 py-3 rounded-lg inline-block transition-colors duration-100 bg-gray-900 ${
          holdState === "ready"
            ? "text-green-500"
            : holdState === "holding"
            ? "text-red-500"
            : "text-white"
        }`}
      >
        {formatTime(time)}
      </div>
      <p className="text-gray-400 mt-2">
        Hold <span className="font-semibold">spacebar</span> for 2s to start.
        Press any key to stop.
      </p>
    </div>
  );
};

export default TimerDisplay;
