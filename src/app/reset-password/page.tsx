"use client";

import { useSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleRequestCode = async () => {
    if (!isLoaded) return;

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep(2);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error requesting code.");
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // alert("Password reset successful. You are now signed in.");
        toast.success("Password reset successful. You are now signed in.", {
          position: "bottom-center",
        });
        // Redirect to localhost:3000
        window.location.href = "/";
      } else {
        setError("Unexpected error. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error resetting password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white border rounded-xl shadow-lg">
        <h1 className="flex-grow text-2xl font-bold flex items-center py-10">
          <span className="text-green-500">BIO</span>MS
        </h1>
        <h2 className="text-2xl font-bold mb-4">
          {step === 1 ? "Reset Password" : "Enter Verification Code"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full p-2 bg-blue-600 text-white rounded"
              onClick={handleRequestCode}
            >
              Request Reset Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Verification Code"
              className="w-full p-2 border rounded mb-3"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full p-2 bg-green-600 text-white rounded"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
