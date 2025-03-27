import React from "react";
import RubikTimer from "../components/RubikTimer";
import { useAuthStore } from "../store/authStore";

const HomeWithAuthPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header>HomeWithAuthPage</header>
      <div>
        <h3>Profile Information</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
      <main>
        <RubikTimer />
      </main>
    </div>
  );
};

export default HomeWithAuthPage;
