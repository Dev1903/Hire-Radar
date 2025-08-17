import React, { useEffect, useState, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import Header from "../components/Header";

import CareerObjectiveSection from "../section/Resume Generator/CareerObjectiveSection";
import SkillsSection from "../section/Resume Generator/SkillsSection";
import LanguagesSection from "../section/Resume Generator/LanguagesSection";
import ProjectsSection from "../section/Resume Generator/ProjectsSection";
import AchievementsSection from "../section/Resume Generator/AchievementsSection";
import EducationSection from "../section/Resume Generator/EducationSection";
import WorkExperienceSection from "../section/Resume Generator/WorkExperienceSection";
import CertificationSection from "../section/Resume Generator/CertificationSection";
import ExtraCurricularSection from "../section/Resume Generator/ExtraCurricularSection";
import PreviewPDF from "../section/Resume Generator/PreviewPDF";

import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import ReviewModal from "../components/ReviewModal";

import Notiflix from "notiflix";
import { generateResume } from "../api/generateResume";

const sectionTemplates = [
  { id: "Career Objective", label: "Career Objective", type: "career", active: true, content: "" },
  { id: "Education", label: "Education", type: "education", active: true, content: "" },
  { id: "Skills", label: "Skills", type: "skills", active: true, content: "" },
  { id: "Projects", label: "Projects", type: "projects", active: true, content: "" },
  { id: "Achievements", label: "Achievements", type: "achievements", active: true, content: "" },
  { id: "Languages", label: "Languages", type: "languages", active: true, content: "" },
  { id: "Work Experience", label: "Work Experience", type: "work", active: true, content: "" },
  { id: "Certifications", label: "Certifications", type: "certification", active: true, content: "" },
  { id: "Extracurricular Activities", label: "Extracurricular Activities", type: "extra", active: true, content: "" },
];

export default function ResumeGenerator() {
  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", linkedin: "", github: "" });
  const [sections, setSections] = useState(sectionTemplates);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSectionChange = (id, value) => setSections(sections.map(s => s.id === id ? { ...s, content: value } : s));
  const hideSection = id => setSections(sections.map(s => s.id === id ? { ...s, active: false } : s));

  const getSectionComponent = (sec) => {
    switch (sec.type) {
      case "career": return <CareerObjectiveSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "skills": return <SkillsSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "languages": return <LanguagesSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "projects": return <ProjectsSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "achievements": return <AchievementsSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "education": return <EducationSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "work": return <WorkExperienceSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "certification": return <CertificationSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "extra": return <ExtraCurricularSection key={sec.id} section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      default: return null;
    }
  }

  const shown = useRef(false);
  useEffect(() => {
    if (!shown.current && !localStorage.getItem("token")) {
      Notiflix.Notify.info("Kindly Login Beforehand to avoid rewriting");
      shown.current = true;

      setTimeout(() => {
        localStorage.setItem("showLoginArrow", "true");
        window.dispatchEvent(new Event("storage")); // trigger update for Header
      }, 2500);
    }
  }, []);

  const activeSections = sections.filter(s => s.active);

  // PDF Pagination logic: simple fixed height per page
  const pageHeight = 1100; // px for A4 simulation
  const pages = [];
  let currentContent = [];
  let tempHeight = 0;

  activeSections.forEach((sec) => {
    const height = 250; // approximate height per section
    if (tempHeight + height > pageHeight) {
      pages.push(currentContent);
      currentContent = [sec];
      tempHeight = height;
    } else {
      currentContent.push(sec);
      tempHeight += height;
    }
  });
  if (currentContent.length) pages.push(currentContent);

  const handleGenerateResume = async () => {
    const requiredFields = ["full_name", "email", "phone", "linkedin", "github"];
    const emptyField = requiredFields.find(field => !formData[field].trim());

    if (emptyField) {
      Notiflix.Notify.failure(
        `Please fill in your ${emptyField.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())} before generating the resume.`
      );
      return;
    }

    if (!localStorage.getItem("token")) {
      Notiflix.Notify.warning("Kindly Login to Continue!");
      document.getElementById("login_modal").showModal();
      return;
    }


    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Replace window.confirm with Notiflix.Confirm
      let proceed = false; // flag to check if user confirmed
      // Initialize Notiflix Confirm once in your app (e.g., App.js or before calling Confirm.show)
      if (localStorage.getItem("theme") === "light") {
        Notiflix.Confirm.init({
          backgroundColor: "#D1D5DB", // dark bg
          titleColor: "#312e81",      // text white
          messageColor: "#000000",
          okButtonBackground: "#2563eb",
          cancelButtonBackground: "#ef4444",
        });
      } else {
        Notiflix.Confirm.init({
          backgroundColor: "#262626",
          titleColor: "#EAB308",
          messageColor: "white",
          okButtonBackground: "#EAB308",
          cancelButtonBackground: "#ef4444",
        });
      }


      await new Promise((resolve) => {
        Notiflix.Confirm.show(
          "Mobile PDF Warning",
          "PDF scaling may differ on mobile devices. Click 'Yes' to continue.",
          "Yes",
          "Cancel",
          () => {
            proceed = true;
            resolve();
          },
          () => {
            proceed = false;
            resolve();
          },
          {
            customClass: {
              confirm: 'custom-bg', // dialog box
              okButton: 'red', // Yes button
              cancelButton: '#000000', // Cancel button
            }
          },

        );

      });
      if (!proceed) return; // user cancelled
    }


    try {
      const payload = { ...formData, section_order: sections.map(s => s.label) };
      sections.forEach(s => { payload[s.label.replace(/ /g, "_")] = s.content; });

      const saveBlobAsFile = (blob, filename = "HireRadar_resume.pdf") => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      };

      try {
        const blob = await generateResume(payload);
        saveBlobAsFile(blob);
        Notiflix.Notify.success("Resume Generated Successfully!");
        setTimeout(() => document.getElementById("review_modal").showModal(), 500);

        setFormData({ full_name: "", email: "", phone: "", linkedin: "", github: "" });
        setSections(sectionTemplates);
      } catch (err) {
        Notiflix.Notify.failure("Unable to generate Resume! Please try again later");
      }
    } catch (err) {
      console.error(err);
      Notiflix.Notify.failure("Error Generating Resume! Please try again later");
    }
  };

  return (
    <div>
      {/* Modals */}
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
      <ReviewModal />

      {/* Header */}
      <div className="header">
        <Header />
      </div>

      {/* Main layout */}
      <div className="min-h-screen flex flex-col md:flex-row gap-6 p-6">

        {/* Left form */}
        <form className="w-full md:w-1/2 overflow-y-auto max-h-screen space-y-6">
          <h1 className="text-3xl font-bold text-glow flex items-center gap-2">
            Resume Generator
            {/* Mobile Preview Button */}
            <button
              type="button"
              className="btn btn-sm btn-accent md:hidden"
              onClick={() => {
                setShowMobilePreview(true);
                Notiflix.Notify.info("Click on the PDF to close the preview");
              }}
            >
              Preview
            </button>
          </h1>

          {/* Personal Info */}
          <div className="p-4 rounded-lg shadow-lg space-y-3">
            {["full_name", "email", "phone", "linkedin", "github"].map(field => (
              <input
                key={field}
                placeholder={`Enter Your ${field.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}`}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="input w-full"
                required
              />
            ))}
          </div>

          {/* Sections */}
          <div className="p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-glow">Sections (Drag to Reorder)</h2>
            <ReactSortable
              list={activeSections}
              setList={newList => setSections([...newList, ...sections.filter(s => !s.active)])}
              animation={150}
            >
              {activeSections.map(sec => getSectionComponent(sec))}
            </ReactSortable>

            {sections.some(s => !s.active) && (
              <div className="mt-4 p-4 bg-gray-400 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2 text-white">Hidden Sections</h3>
                {sections.filter(s => !s.active).map(s => (
                  <div
                    key={s.id}
                    className="p-2 mb-2 rounded border border-dashed border-gray-300 bg-gray-800 flex justify-between items-center opacity-70 hover:opacity-100 cursor-pointer"
                    onClick={() => setSections(sections.map(ss => ss.id === s.id ? { ...ss, active: true } : ss))}
                  >
                    <span className="text-white">{s.label}</span>
                    <span className="text-sm btn btn-accent">Restore</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn custom-btn w-full mt-4"
            onClick={handleGenerateResume}
          >
            Generate Resume
          </button>
        </form>

        {/* Right: PDF Preview (desktop only) */}
        <div className="hidden md:flex w-1/2 flex-col h-screen">
          <PreviewPDF sections={sections} formData={formData} />
        </div>
      </div>

      {/* Mobile PDF Overlay */}
      {showMobilePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4 md:hidden cursor-pointer"
          onClick={() => setShowMobilePreview(false)}
        >
          <PreviewPDF sections={sections} formData={formData} />
        </div>
      )}
    </div>
  );
}
