import React from "react";
import { useNavigate } from "react-router-dom";

// use this to build
// import RubikTimer from "../components/RubikTimer";

// use this to use cubing.js
import RubikTimerWithScramble from "../components/RubikTimerWithScramble";

const HomeNoAuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Sign Up
        </button>
      </header>

      <main>
        {/* <RubikTimer /> */}
        <RubikTimerWithScramble />
      </main>
    </div>
  );
};

export default HomeNoAuthPage;
