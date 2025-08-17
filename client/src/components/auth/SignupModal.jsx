import React, { useState, useContext } from "react";
import { auth } from "../../utils/firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import LoadingDark from "../../assets/animations/LoadingDark.json"
import LoadingLight from "../../assets/animations/LoadingLight.json"
import Lottie from "lottie-react";
import Notiflix from "notiflix";

export default function SignupModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameStatus, setNameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { mode } = useContext(ThemeContext);
  const loadinganimationData = mode === "dark" ? LoadingDark : LoadingLight;

  const checkName = (e) => {
    const val = e.target.value;
    setName(val);

    // Regex for: length > 4 and contains at least one space
    const regex = /^(?=.{5,})(?=.*\s).+$/;

    if (regex.test(val)) {
      setNameStatus("success");
    } else {
      setNameStatus("error");
    }
  };


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
    setName("");
    setEmail("");
    setPassword("");
    setNameStatus("");
    setEmailStatus("");
    setPasswordStatus("");
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      setLoading(true);
      // Update display name
      await updateProfile(userCred.user, { displayName: name });
      console.log("User registered:", userCred.user);
      localStorage.setItem("token", userCred.user.accessToken)
      localStorage.setItem("name", userCred.user.displayName)
      localStorage.setItem("showAuthSuccess", userCred.user.displayName)
      localStorage.removeItem("showLoginArrow")
      setTimeout(() => {
        document.getElementById("signup_modal").close();
        window.location.reload();
      }, 2000)
    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
      Notiflix.Notify.failure(error.message);
    }
    clearForm();
  };

  return (
    <dialog id="signup_modal" className="modal">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center">
          {/* Semi-transparent overlay without solid color */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[3px]"></div>

          {/* Spinner and text */}
          <div className="relative flex flex-col justify-center items-center">
            <div className="w-150 h-100 flex justify-center items-center">
              <Lottie animationData={loadinganimationData} loop />
            </div>
          </div>
        </div>
      )}
      <div className="modal-box custom-bg">
        <form onSubmit={handleSignup} className="space-y-4">
          <h3 className="font-bold text-lg">Sign Up</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            type="button"
            onClick={() => document.getElementById("signup_modal").close()}
          >
            <i class="fa-solid fa-xmark fa-xl text-theme"></i>
          </button>

          {/* Name */}
          <fieldset className="fieldset border border-indigo-800 dark:border-yellow-500 p-4 rounded-box">
            <legend className="fieldset-legend text-sm text-theme">Name</legend>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              className={`input w-full ${nameStatus === "success"
                ? "input-success"
                : nameStatus === "error"
                  ? "input-error"
                  : ""
                }`}
              onChange={checkName}
              autoComplete="name"
            />
          </fieldset>

          {/* Email */}
          <fieldset className="fieldset border border-indigo-800 dark:border-yellow-500 p-4 rounded-box">
            <legend className="fieldset-legend text-sm text-theme">Email</legend>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              className={`input w-full ${emailStatus === "success"
                ? "input-success"
                : emailStatus === "error"
                  ? "input-error"
                  : ""
                }`}
              onChange={checkEmail}
              autoComplete="email"
            />
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset border border-indigo-800 dark:border-yellow-500 p-4 rounded-box">
            <legend className="fieldset-legend text-sm text-theme">Password</legend>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className={`input w-full ${passwordStatus === "success"
                ? "input-success"
                : passwordStatus === "error"
                  ? "input-error"
                  : ""
                }`}
              onChange={checkPassword}
            />
          </fieldset>

          {/* Actions */}
          <div className="modal-action flex flex-col gap-2">
            <button
              type="submit"
              className="btn custom-btn w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            <button
              type="button"
              className="btn btn-link text-theme"
              onClick={() => {
                document.getElementById("signup_modal").close();
                document.getElementById("login_modal").showModal();
              }}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
