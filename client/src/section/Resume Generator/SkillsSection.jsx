import React, { useState } from "react";

export default function SkillsSection({ section, handleSectionChange, hideSection }) {
  const [input, setInput] = useState("");
  const skills = section.content ? section.content.split(",") : [];

  const addSkill = () => {
    if (!input.trim()) return;
    const newSkills = [...skills, input.trim()];
    handleSectionChange(section.id, newSkills.join(","));
    setInput("");
  };

  const removeSkill = (skill) => {
    handleSectionChange(section.id, skills.filter((s) => s !== skill).join(","));
  };

  return (
    <fieldset className="fieldset border border-indigo-400 dark:border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg section-text-theme">{section.label}</legend>
      <div className="flex gap-2 flex-wrap mb-2">
        {skills.map((skill) => (
          <span key={skill} className="bg-indigo-200 dark:bg-yellow-500 px-2 py-1 rounded-full flex items-center gap-1 section-text-theme">
            {skill} <button onClick={() => removeSkill(skill)}><i class="fa-solid fa-xmark"></i></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder={`Add ${section.label}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input input-sm flex-1"
        />
        <button type="button" className="btn btn-sm btn-outline" onClick={addSkill}>
          Add
        </button>
      </div>
      <button type="button" className="mt-2 text-sm btn btn-outline btn-secondary w-24" onClick={() => hideSection(section.id)}>
        Hide
      </button>
    </fieldset>
  );
}
