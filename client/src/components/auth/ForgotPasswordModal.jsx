import React, { useState } from "react";
import { auth } from "../../utils/firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordModal() {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const checkEmail = (e) => {
    const val = e.target.value;
    setEmail(val);
    setEmailStatus(val.includes("@") ? "success" : "error");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
      document.getElementById("forgot_password_modal").close();
    } catch (error) {
      console.error("Reset password error:", error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <dialog id="forgot_password_modal" className="modal">
      <div className="modal-box">
        <form onSubmit={handleReset} className="space-y-4">
          <h3 className="font-bold text-lg">Reset Password</h3>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("forgot_password_modal").close()}
          >
            ✕
          </button>

          {/* Email */}
          <fieldset className="fieldset border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend text-sm">Email</legend>
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
            />
          </fieldset>

          {/* Actions */}
          <div className="modal-action flex flex-col gap-2">
            <button
              type="submit"
              className="btn btn-warning w-full"
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
