import React, { useState } from "react";

export default function SignupModal() {
  const [nameStatus, setNameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const checkName = (e) => {
    if (e.target.value.length > 2) setNameStatus("success");
    else setNameStatus("error");
  };

  const checkEmail = (e) => {
    if (e.target.value.includes("@")) setEmailStatus("success");
    else setEmailStatus("error");
  };

  const checkPassword = (e) => {
    if (e.target.value.length > 5) setPasswordStatus("success");
    else setPasswordStatus("error");
  };

  return (
    <dialog id="signup_modal" className="modal">
      <div className="modal-box">
        <form method="dialog" className="space-y-4">
          <h3 className="font-bold text-lg">Sign Up</h3>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          {/* Name */}
          <fieldset className="fieldset border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend text-sm">Name</legend>
            <input
              type="text"
              placeholder="Enter your name"
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
            <button className="btn btn-warning w-full">Sign Up</button>
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
