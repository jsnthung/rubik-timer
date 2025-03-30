import { create } from "zustand";
import axios from "../utils/axiosInstance";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  cameFromVerificationFlow: false,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/signup", {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        cameFromVerificationFlow: true,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/verify-email", { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        cameFromVerificationFlow: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerificationEmail: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/resend-verification", {
        email,
      });
      set({ isLoading: false });
      return response.data.message;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to resend code",
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get("/auth/check-auth");
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        cameFromVerificationFlow: false,
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const user = response.data.user;

      if (!user.isVerified) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          cameFromVerificationFlow: true,
        });

        return { needsVerification: true, user };
      }

      set({
        isAuthenticated: true,
        user,
        error: null,
        isLoading: false,
        cameFromVerificationFlow: false,
      });
      return { needsVerification: false, user };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post("/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        cameFromVerificationFlow: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`/auth/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
