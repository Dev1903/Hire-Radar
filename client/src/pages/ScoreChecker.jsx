import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../components/Header";
import { ThemeContext } from "../context/ThemeContext";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import Notiflix from "notiflix"
import { uploadResume } from "../api/uploadResume";
import ReviewModal from "../components/ReviewModal";
import LoadingDark from "../assets/animations/LoadingDark.json"
import LoadingLight from "../assets/animations/LoadingLight.json"
import Lottie from "lottie-react";

export default function ScoreChecker() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatedScores, setAnimatedScores] = useState({});
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();


  const { mode } = useContext(ThemeContext);
  const loadinganimationData = mode === "dark" ? LoadingDark : LoadingLight;
  function formatValue(value, maxValue) {
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(2);
    return `${formatted}/${maxValue}`;
  }

  const handleFile = async (file) => {
    if (!localStorage.getItem("token")) {
      Notiflix.Notify.warning("Kindly Login to Continue !")
      setTimeout(() => {
        localStorage.setItem("showLoginArrow", "true");
        window.dispatchEvent(new Event("storage")); // trigger update for Header
      }, 2500);
      // document.getElementById("login_modal").showModal();
    }
    else {
      if (!file || file.type !== "application/pdf") {
        Notiflix.Notify.warning("Please select a valid PDF file");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("location", location);
      formData.append("model", "2");

      try {
        const res = await uploadResume(formData);
        Notiflix.Notify.success("Your ATS Score is Generated")
        const data = res.data
        console.log(data)
        
        // const data = await res.data();
        setResult(data || []);

        const initialScores = {};
        Object.keys(data.scores || {}).forEach((key) => (initialScores[key] = 0));
        setAnimatedScores(initialScores);

        setTimeout(() => {
          setAnimatedScores({
            ats_score: data.ats_score,
            ...data.scores,
          });
        }, 100);
      } catch (err) {
        console.error("Upload failed:", err);
        Notiflix.Notify.failure("Upload Failed! Please Try Again Later")
      } finally {
        setLoading(false);
        setTimeout(()=>document.getElementById("review_modal").showModal(), 4000);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const resetChecker = () => {
    setResult(null);
    setAnimatedScores({});
    setDragging(false);
  };

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    };

    const handleWindowDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  return (
    <div className="w-full pb-2">
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
      <ReviewModal />
      {/* HEADER */}
      <div className="header">
        <Header />
      </div>

      {/* TITLE + RECHECK BUTTON */}
      <div className="flex justify-center items-center gap-4">
        <h1 className="text-3xl font-bold text-center text-glow py-5">
          ATS Score Checker
        </h1>
        {result && (
          <button
            onClick={resetChecker}
            className="btn custom-btn"
          >
            Recheck
          </button>
        )}
      </div>

      {/* UPLOAD AREA BEFORE RESULTS */}
      {!result && (
        <div
          className="flex items-center justify-center"
          style={{
            height: "calc(100vh - 150px)", // Leaves space for header + title
          }}
        >
          <div
            className={` mx-5 flex justify-center items-center border-2 border-dashed border-indigo-500 dark:border-yellow-500 rounded-xl p-10 h-50 w-100 text-center cursor-pointer transition-colors ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
              }`}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {loading ? (
              <p className="text-gray-500 font-semibold text-glow">Analyzing PDF...</p>
            ) : dragging ? (
              <p className="text-blue-500 font-semibold text-glow">Drop PDF anywhere!</p>
            ) : (
              <p className="text-glow">Click or drag a PDF to upload</p>
            )}
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={handleSelect}
            />
          </div>
        </div>
      )}
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
      {/* RESULTS AFTER UPLOAD */}
      {result && (
        <div className="rounded-lg p-5 h-auto md:h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col pr-0 md:pr-4 overflow-visible md:overflow-y-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-center text-black dark:text-white">
                Best Role Match:{" "}
                <span className="text-glow">{result.best_role}</span>
              </h2>
              <div
                className="radial-progress text-theme w-40 h-40 border-4 border-indigo-200 dark:border-gray-300 rounded-full text-glow"
                style={{
                  "--value": animatedScores.ats_score || 0,
                  "--size": "10rem",
                  "--thickness": "12px",
                }}
                role="progressbar"
              >
                {Math.round(animatedScores.ats_score || 0)}%
              </div>
            </div>

            {/* Skills */}
            <div className="p-4 rounded-lg shadow-inner dark:bg-base-100">
              <h3 className="font-bold text-lg mb-3 text-center text-glow">
                Skills Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Matched{" "}
                    <i className="fa-solid fa-xl fa-check text-green-400"></i>
                  </h4>
                  <ul className="list-disc list-inside text-green-700">
                    {(result.matched_skills || []).map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Missing{" "}
                    <i className="fa-solid fa-xl fa-xmark text-red-500"></i>
                  </h4>
                  <ul className="list-disc list-inside text-red-700">
                    {(result.missing_skills || []).map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col pl-0 md:pl-4 w-full overflow-visible md:overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-center text-glow">
              Detailed Scores
            </h3>
            <div className="grid grid-cols-2 gap-6 justify-items-center">
              {Object.entries(result.scores || {}).map(([label, value], idx) => {
                const outOfValues = {
                  "Experience Bonus": 10,
                  "Hyperlink in Header": 2,
                  "Email Address": 3,
                  "Design": 5,
                  "File Format & Size": 5,
                  "Spelling & Grammar": 2,
                  "Repetition Penalty": -2,
                  "Quantifying Impact": 5,
                  "ATS Parse Rate": 10,
                  "Skills Match": 45,
                  "Essential Sections": 15,
                };

                const maxValue = outOfValues[label] || 10;
                const percentage = ((value / maxValue) * 100).toFixed(1);

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-4 rounded-lg shadow-sm justify-center"
                  >
                    <div
                      className="radial-progress text-secondary w-28 h-28 border-2 border-indigo-200 dark:border-yellow-500 rounded-full"
                      style={{
                        "--value": percentage,
                        "--size": "7rem",
                        "--thickness": "8px",
                      }}
                      role="progressbar"
                    >
                      {formatValue(value, maxValue)}
                    </div>
                    <p className="mt-2 text-center text-sm font-medium text-glow">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
