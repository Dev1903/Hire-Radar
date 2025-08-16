import React, { useEffect, useState, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import Header from "../components/Header"

import CareerObjectiveSection from "../section/Resume Generator/CareerObjectiveSection";
import SkillsSection from "../section/Resume Generator/SkillsSection";
import LanguagesSection from "../section/Resume Generator/LanguagesSection";
import ProjectsSection from "../section/Resume Generator/ProjectsSection"
import AchievementsSection from "../section/Resume Generator/AchievementsSection";
import EducationSection from "../section/Resume Generator/EducationSection";
import WorkExperienceSection from "../section/Resume Generator/WorkExperienceSection";
import CertificationSection from "../section/Resume Generator/CertificationSection";
import ExtraCurricularSection from "../section/Resume Generator/ExtraCurricularSection";
import PreviewPDF from "../section/Resume Generator/PreviewPDF";
import LoginModal from "../components/auth/LoginModal";
import SignupModal from "../components/auth/SignupModal";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import Notiflix from "notiflix";

const sectionTemplates = [
  { id: "Career Objective", label: "Career Objective", type: "career", active: true, content: "" },
  { id: "Education", label: "Education", type: "education", active: true, content: "" },
  { id: "Skills", label: "Skills", type: "skills", active: true, content: "" },
  { id: "Projects", label: "Projects", type: "projects", active: true, content: "" },
  { id: "Achievements", label: "Achievements", type: "achievements", active: true, content: "" },
  { id: "Languages", label: "Languages", type: "languages", active: true, content: "" },
  { id: "Work Experience", label: "Work Experience", type: "work", active: true, content: "" },
  { id: "Certifications", label: "Certifications", type: "certification", active: true, content: "" },
  { id: "Extracurricular Activities", label: "Extracurricular Activities", type: "extra", active: true, content: "" }
];

export default function ResumeGenerator() {

  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", linkedin: "", github: "" });
  const [sections, setSections] = useState(sectionTemplates);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSectionChange = (id, value) => setSections(sections.map(s => s.id === id ? { ...s, content: value } : s));
  const hideSection = id => setSections(sections.map(s => s.id === id ? { ...s, active: false } : s));

  const getSectionComponent = (sec) => {
    switch (sec.type) {
      case "career": return <CareerObjectiveSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "skills": return <SkillsSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "languages": return <LanguagesSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "projects": return <ProjectsSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "achievements": return <AchievementsSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "education": return <EducationSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "work": return <WorkExperienceSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "certification": return <CertificationSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      case "extra": return <ExtraCurricularSection section={sec} handleSectionChange={handleSectionChange} hideSection={hideSection} />;
      default: return null;
    }
  }
  const shown = useRef(false);
  useEffect(() => {
    if (!shown.current) {
      Notiflix.Notify.info("Kindly Login Beforehand to avoid rewriting");
      shown.current = true;
    }
  }, []);

  const activeSections = sections.filter(s => s.active);

  // PDF Pagination logic: simple fixed height per page
  const pageHeight = 1100; // px for A4 simulation
  const pages = [];
  let currentContent = [];

  let tempHeight = 0;
  activeSections.forEach((sec) => {
    const height = 250; // approximate height per section for simplicity
    if (tempHeight + height > pageHeight) { pages.push(currentContent); currentContent = [sec]; tempHeight = height; }
    else { currentContent.push(sec); tempHeight += height; }
  });
  if (currentContent.length) pages.push(currentContent);


  const handleGenerateResume = async () => {
    if (!localStorage.getItem("token")) {
      Notiflix.Notify.warning("Kindly Login to Continue !")
      document.getElementById("login_modal").showModal();
    }
    else {
      try {
        // Prepare the payload
        const payload = {
          ...formData,
          section_order: sections.map(s => s.label), // send order of sections
        };

        // Include section content
        sections.forEach(s => {
          const key = s.label.replace(/ /g, "_"); // match backend keys like Career_Objective
          payload[key] = s.content;
        });

        // POST request to backend
        console.log(payload)
        const response = await fetch("http://localhost:5000/generate_resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        if (!response.ok) {
          Notiflix.Notify.failure("Failed to Generate Resume !")
        }
        Notiflix.Notify.success("Resume Generated Successfully !")
        // Get the PDF as a blob
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated_resume.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
        setFormData(
          {
            full_name: "",
            email: "",
            phone: "",
            linkedin: "",
            github: ""
          }
        )
        setSections(sectionTemplates)

      } catch (err) {
        console.error(err);
        Notiflix.Notify.failure("Error Generating Resume !Please try again later")
      }
    }
  };


  return (
    <div>
      <LoginModal />
      <SignupModal />
      <ForgotPasswordModal />
      <div className="header">
        <Header />
      </div>
      <div className="min-h-screen flex gap-6 p-6">
        {/* Left form scrollable */}
        <form className="w-1/2 overflow-y-auto max-h-screen space-y-6">
          <h1 className="text-3xl font-bold text-glow">Resume Generator</h1>
          <div className="p-4 rounded-lg shadow-lg space-y-3 ">
            {["full_name", "email", "phone", "linkedin", "github"].map(field => (
              <input
                key={field}
                placeholder={`Enter Your ${field
                  .replace("_", " ")
                  .split(" ")
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
                  }`}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="input w-full"
              />
            ))}
          </div>

          <div className="p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-glow">Sections (Drag to Reorder)</h2>
            <ReactSortable list={activeSections} setList={newList => setSections([...newList, ...sections.filter(s => !s.active)])} animation={150}>
              {activeSections.map(sec => getSectionComponent(sec))}
            </ReactSortable>

            {sections.some(s => !s.active) && (
              <div className="mt-4 p-4 bg-gray-400 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2 text-white">Hidden Sections</h3>
                {sections.filter(s => !s.active).map(s => (
                  <div key={s.id} className="p-2 mb-2 rounded border border-dashed border-gray-300 bg-gray-800 flex justify-between items-center opacity-70 hover:opacity-100 cursor-pointer"
                    onClick={() => setSections(sections.map(ss => ss.id === s.id ? { ...ss, active: true } : ss))}>
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

        {/* Right: PDF Preview */}
        <div className="w-1/2 flex flex-col h-screen">
          <PreviewPDF sections={sections} formData={formData} />
        </div>

      </div>
    </div>
  )
}
