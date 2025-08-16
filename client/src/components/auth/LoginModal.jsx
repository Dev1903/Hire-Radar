import React, { useState, useContext } from "react";
import { auth } from "../../utils/firebase.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import Notiflix from "notiflix";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { mode } = useContext(ThemeContext);

  const provider = new GoogleAuthProvider();

  const checkEmail = (e) => {
    const val = e.target.value;
    setEmail(val);

    // Basic email pattern
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailStatus(regex.test(val) ? "success" : "error");
  };

  const checkPassword = (e) => {
    const val = e.target.value;
    setPassword(val);

    // Must be at least 7 digits
    const regex = /^\d{6,}$/;
    setPasswordStatus(regex.test(val) ? "success" : "error");
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setEmailStatus("");
    setPasswordStatus("");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCred.user);
      localStorage.setItem("token", userCred.user.accessToken);
      document.getElementById("login_modal").close();
      Notiflix.Notify.success(`Welcome ${userCred.user.displayName}! Redirecting.....`)
      setTimeout(()=>{
        window.location.reload();
      },2000)
      


    } catch (error) {
      console.error("Login error:", error);
      Notiflix.Notify.failure(error.message);
    }
    clearForm();
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login result:", result);
      console.log("User details:", result.user); // Full user object
      localStorage.setItem("token", result.user.accessToken);
      localStorage.setItem("dp", result.user.photoURL);
      document.getElementById("login_modal").close();
      Notiflix.Notify.success(`Welcome ${result.user.displayName}! Redirecting.....`)
      setTimeout(()=>{
        window.location.reload();
      },2000)
    } catch (error) {
      console.error("Google login error:", error);
      Notiflix.Notify.failure(error.message);
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box bg-indigo-200 dark:bg-base-100">
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
            <legend className="fieldset-legend text-sm text-theme">Email</legend>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={checkEmail}
              className={`input w-full ${emailStatus === "success"
                ? "input-success"
                : emailStatus === "error"
                  ? "input-error"
                  : ""
                }`}
            />
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset border border-base-300 p-4  mb-0 rounded-box">
            <legend className="fieldset-legend text-sm text-theme">Password</legend>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={checkPassword}
              className={`input w-full ${passwordStatus === "success"
                ? "input-success"
                : passwordStatus === "error"
                  ? "input-error"
                  : ""
                }`}
            />
          </fieldset>
          <button
            type="button"
            className="btn btn-link text-theme"
            onClick={() => {
              document.getElementById("login_modal").close();
              document.getElementById("forgot_password_modal").showModal();
            }}
          >
            Forgot Password?
          </button>

          {/* Actions */}
          <div className="modal-action flex flex-col gap-2 mt-0">
            <button type="submit" className="btn custom-btn w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {
              mode === "dark" ? (
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={handleGoogleLogin}
                >
                  <i class="fa-brands fa-google"></i> &nbsp;&nbsp;
                  Sign in with Google
                </button>
              ) : (
                <button
                  type="button"
                  className="btn bg-white text-black border-[#e5e5e5]"
                  onClick={handleGoogleLogin}
                >
                  <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                  Login with Google
                </button>
              )
            }
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
