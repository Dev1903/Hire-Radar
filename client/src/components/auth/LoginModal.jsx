import React, { useState } from "react";
import { auth } from "../../utils/firebase.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();

  const checkEmail = (e) => {
    const val = e.target.value;
    setEmail(val);
    setEmailStatus(val.includes("@") ? "success" : "error");
  };

  const checkPassword = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStatus(val.length > 5 ? "success" : "error");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCred.user);
      alert("Login successful!");
      document.getElementById("login_modal").close();
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login result:", result);
      console.log("User details:", result.user); // Full user object
      alert(`Welcome ${result.user.displayName}`);
      document.getElementById("login_modal").close();
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.message);
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box">
        <form onSubmit={handleLogin} className="space-y-4">
          <h3 className="font-bold text-lg">Login</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            type="button"
            onClick={() => document.getElementById("login_modal").close()}
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
              onChange={checkEmail}
              className={`input w-full ${
                emailStatus === "success"
                  ? "input-success"
                  : emailStatus === "error"
                  ? "input-error"
                  : ""
              }`}
            />
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend text-sm">Password</legend>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={checkPassword}
              className={`input w-full ${
                passwordStatus === "success"
                  ? "input-success"
                  : passwordStatus === "error"
                  ? "input-error"
                  : ""
              }`}
            />
          </fieldset>

          {/* Actions */}
          <div className="modal-action flex flex-col gap-2">
            <button type="submit" className="btn btn-warning w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="btn btn-outline w-full"
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </button>
            <button
              type="button"
              className="btn btn-link text-theme"
              onClick={() => {
                document.getElementById("login_modal").close();
                document.getElementById("signup_modal").showModal();
              }}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
