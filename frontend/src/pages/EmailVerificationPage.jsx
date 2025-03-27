import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownToast = useRef(false);

  const { user, error, isLoading, verifyEmail, resendVerificationEmail } =
    useAuthStore();

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) {
      toast.error("Verification code must be numeric");
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    const digitsOnly = paste.replace(/\D/g, "").slice(0, 6);

    const newCode = Array(6).fill("");
    for (let i = 0; i < digitsOnly.length; i++) {
      newCode[i] = digitsOnly[i];
    }

    setCode(newCode);

    const nextIndex = digitsOnly.length < 6 ? digitsOnly.length : 5;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationEmail(user?.email);
      toast.success("Verification code resent!");
      setIsResendDisabled(true);
      setResendTimer(60);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Failed to resend code.");
    }
  };

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (location.state?.email && !hasShownToast.current) {
      toast.success("A new verification code has been sent to your email.");
      hasShownToast.current = true; // mark as shown
      navigate(location.pathname, { replace: true }); // clear state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Verify Your Email
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Enter the 6-digit code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 font-semibold mt-2 text-center">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Didn’t receive the code?
                <button
                  onClick={handleResend}
                  disabled={isResendDisabled}
                  className={`ml-2 font-semibold ${
                    isResendDisabled
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-green-400 hover:text-green-500"
                  }`}
                >
                  {isResendDisabled
                    ? `Resend in ${resendTimer}s`
                    : "Resend Code"}
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
