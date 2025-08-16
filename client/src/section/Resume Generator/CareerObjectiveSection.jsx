import React from "react";

export default function CareerObjectiveSection({ section, handleSectionChange, hideSection }) {
  return (
    <fieldset className="fieldset border border-indigo-400 dark:border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg section-text-theme">{section.label}</legend>
      <textarea
        className="textarea w-full p-2 rounded border"
        placeholder={`Enter Your ${section.label}`}
        rows="3"
        value={section.content}
        onChange={(e) => handleSectionChange(section.id, e.target.value)}
      />
      <button
        type="button"
        className="mt-2 text-sm btn btn-outline btn-secondary w-24"
        onClick={() => hideSection(section.id)}
      >
        Hide
      </button>
    </fieldset>
  );
}
