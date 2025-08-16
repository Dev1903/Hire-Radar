import React, { useState } from "react";
import { auth } from "../../utils/firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";
import Notiflix from "notiflix";

export default function ForgotPasswordModal() {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const checkEmail = (e) => {
    const val = e.target.value;
    setEmail(val);

    // Basic email pattern
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailStatus(regex.test(val) ? "success" : "error");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      document.getElementById("forgot_password_modal").close();
      Notiflix.Notify.success("Password reset email sent!");
      
    } catch (error) {
      console.error("Reset password error:", error);
      Notiflix.Notify.failure(error.message);
    }
    setLoading(false);
  };

  return (
    <dialog id="forgot_password_modal" className="modal">
      <div className="modal-box bg-indigo-200 dark:bg-base-100">
        <form onSubmit={handleReset} className="space-y-4">
          <h3 className="font-bold text-lg">Reset Password</h3>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("forgot_password_modal").close()}
          >
            <i class="fa-solid fa-xmark fa-xl text-theme"></i>
          </button>

          {/* Email */}
          <fieldset className="fieldset border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend text-sm text-theme">Email</legend>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              className={`input w-full ${
                emailStatus === "success"
                  ? "input-success"
                  : emailStatus === "error"
                  ? "input-error"
                  : ""
              }`}
              onChange={checkEmail}
              autoComplete="email"
            />
          </fieldset>

          {/* Actions */}
          <div className="modal-action flex flex-col gap-2">
            <button
              type="submit"
              className="btn custom-btn w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <button
              type="button"
              className="btn btn-link text-theme"
              onClick={() => {
                document.getElementById("forgot_password_modal").close();
                document.getElementById("login_modal").showModal();
              }}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
