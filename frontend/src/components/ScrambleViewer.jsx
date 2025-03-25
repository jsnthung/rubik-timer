const ScrambleViewer = ({ scramble, puzzle }) => {
  if (!scramble) return null;

  return (
    <div className="mt-8 text-center">
      <h4 className="text-white text-lg font-medium mb-2">{scramble}</h4>
      <div className="flex justify-center">
        <twisty-player
          background="none"
          control-panel="none"
          puzzle={puzzle}
          alg={scramble}
          class="max-w-full"
        ></twisty-player>
      </div>
    </div>
  );
};

export default ScrambleViewer;
