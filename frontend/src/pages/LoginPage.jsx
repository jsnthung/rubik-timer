import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <form className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none"
        />
        <button className="w-full bg-white text-black py-2 rounded hover:bg-gray-300 transition">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-400 hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
