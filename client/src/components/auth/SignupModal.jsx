import React, { useState } from "react";
import { auth } from "../../utils/firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignupModal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameStatus, setNameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const checkName = (e) => {
    const val = e.target.value;
    setName(val);
    setNameStatus(val.length > 2 ? "success" : "error");
  };

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

  const clearForm = () =>{
    setName("");
    setEmail("");
    setPassword("");
    setNameStatus("");
    setEmailStatus("");
    setPasswordStatus("");
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      await updateProfile(userCred.user, { displayName: name });
      console.log("User registered:", userCred.user);
      alert("Account created successfully!");
      document.getElementById("signup_modal").close();
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
    clearForm();
    setLoading(false);
  };

  return (
    <dialog id="signup_modal" className="modal">
      <div className="modal-box">
        <form onSubmit={handleSignup} className="space-y-4">
          <h3 className="font-bold text-lg">Sign Up</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            type="button"
            onClick={() => document.getElementById("signup_modal").close()}
          >
            ✕
          </button>

          {/* Name */}
          <fieldset className="fieldset border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend text-sm">Name</legend>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              className={`input w-full ${
                nameStatus === "success"
                  ? "input-success"
                  : nameStatus === "error"
                  ? "input-error"
                  : ""
              }`}
              onChange={checkName}
            />
          </fieldset>

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

          {/* Password */}
          <fieldset className="fieldset border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend text-sm">Password</legend>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className={`input w-full ${
                passwordStatus === "success"
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
              className="btn btn-warning w-full"
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
