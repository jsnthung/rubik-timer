import React from "react";
import { useAuthStore } from "../store/authStore";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// use this to build
import RubikTimer from "../components/RubikTimer";

// use this to use cubing.js
// import RubikTimerWithScramble from "../components/RubikTimerWithScramble";

const HomeWithAuthPage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg 
          hover:from-green-600 hover:to-emerald-700
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Logout
        </motion.button>
      </header>

      <div>
        <h3>Profile Informations</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>

      <main>
        <RubikTimer />
        {/* <RubikTimerWithScramble /> */}
      </main>
    </div>
  );
};

export default HomeWithAuthPage;
