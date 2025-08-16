// JobSearch.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Header from "../components/Header";
import NotfoundDark from "../assets/animations/NotfoundDark.json";
import NotfoundLight from "../assets/animations/NotfoundLight.json";
import LoadingDark from "../assets/animations/LoadingDark.json"
import LoadingLight from "../assets/animations/LoadingLight.json"
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const PAGE_SIZE = 10;

  // Theme
  const { mode } = useContext(ThemeContext);
  const notfoundanimationData = mode === "dark" ? NotfoundDark : NotfoundLight;
  const loadinganimationData = mode === "dark" ? LoadingDark : LoadingLight;

  // Upload Resume
  const handleUpload = async (uploadedFile) => {
    const selectedFile = uploadedFile;
    if (!selectedFile) return alert("Please upload a resume PDF!");

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("page", 1);
    formData.append("model", "1");
    try {
      const res = await fetch("http://192.168.29.104:5000/upload_resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setStatus(res.status);

      console.log(data);

      setJobs(data.jobs || []);
      setAllSkills(data.skills || []);
      setFilteredJobs(data.jobs || []);
      setSelectedLocation("");
      setSelectedSkills([]);
      setPage(1);

      // Extract unique locations from all jobs
      const locations = [
        ...new Set(
          (data.jobs || [])
            .map((job) => job.location)
            .filter(Boolean)
        ),
      ].sort();
      setAvailableLocations(locations);
    } catch (err) {
      console.log(err)
      alert("Error Uploading Resume")
    } finally {
      setLoading(false);
    }

  };

  // Apply filters
  useEffect(() => {
    let tempJobs = [...jobs];

    if (selectedLocation !== "") {
      tempJobs = tempJobs.filter((job) =>
        job.location?.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    if (selectedSkills.length > 0) {
      tempJobs = tempJobs.filter((job) =>
        job.skills_matched.some((skill) => selectedSkills.includes(skill))
      );
    }

    setFilteredJobs(tempJobs);
    setPage(1);
  }, [selectedLocation, selectedSkills, jobs]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  // Drag & Drop / Click-to-Upload
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleUpload(droppedFile);
  };

  const handleSelect = (e) => {
    const selectedFile = e.target.files[0];
    handleUpload(selectedFile);
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
      const droppedFile = e.dataTransfer.files[0];
      handleUpload(droppedFile);
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
    <div className="min-h-screen pb-4">


      <div className="header">
        <Header />
      </div>

      <div className="w-full px-6">
        <h1 className="text-3xl text-center mb-10 text-theme text-glow">
          Smart Job Search
        </h1>

        {/* Upload Resume */}
        <div
          className={`flex flex-col md:flex-row justify-center items-center gap-4 mb-6 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
            }`}
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept="application/pdf, .docx"
            ref={fileInputRef}
            className="hidden"
            onChange={handleSelect}
          />
          <p className="text-glow text-center">
            {dragging
              ? "Drop file here!"
              : "Click or drag a PDF/DOCX to upload"}
          </p>
        </div>

        {/* Filters Section - Top */}
        {jobs.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4">
            {/* Location Dropdown */}
            {availableLocations.length > 0 && (
              <select
                defaultValue="Pick a location"
                className="select w-full md:w-64 bg-white dark:bg-base-100"
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option disabled>Pick a location</option>
                <option value="">All Locations</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}

            {/* Skills filter */}
            <div className="flex flex-wrap gap-2 max-w-full">
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`btn btn-sm ${selectedSkills.includes(skill)
                    ? "btn-primary"
                    : "btn-outline"
                    }`}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pagination - Top */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
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
        {/* Jobs List / No jobs animation */}
        {status == 200 && jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-100 h-100 flex justify-center items-center">
              <Lottie animationData={notfoundanimationData} loop />
            </div>
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-6 px-4">
              <i className="fas fa-upload mr-2"></i> No jobs found. Try adding
              more skills or an ATS-friendly resume.
            </p>
            <Link
              to="/resume-maker"
              className="btn custom-btn text-center mt-5"
            >
              Make an ATS Friendly resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {paginatedJobs.length > 0 &&
              paginatedJobs.map((job, i) => (
                <div
                  key={i}
                  className="card bg-white dark:bg-base-100 shadow-xl hover:shadow-2xl transition-all rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-full"
                >
                  <div className="card-body p-6">
                    <h2 className="card-title text-indigo-600 dark:text-yellow-400 text-xl flex items-center gap-2">
                      <i className="fas fa-briefcase"></i> {job.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2 mt-1">
                      <i className="fas fa-building"></i> {job.company} •{" "}
                      <i className="fas fa-map-marker-alt"></i> {job.location}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-4 mt-2">
                      <span>
                        <i className="fas fa-layer-group"></i> {job.category}
                      </span>
                      <span>
                        <i className="fas fa-clock"></i> {job.contract_time || "N/A"}
                      </span>
                      <span>
                        <i className="fas fa-dollar-sign"></i>{" "}
                        {job.salary_is_predicted ? "Salary Predicted" : "Salary N/A"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                      <i className="fas fa-calendar-alt"></i> Posted:{" "}
                      {new Date(job.created).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                      <i className="fas fa-map-pin"></i> Coordinates:{" "}
                      {job.latitude && job.longitude
                        ? `${job.latitude}, ${job.longitude}`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-3">
                      {job.description}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <a
                        href={job.redirect_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm btn-secondary flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <i className="fas fa-eye"></i> View Job
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Pagination - Bottom */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
