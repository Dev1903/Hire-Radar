import React, { useState } from "react";

export default function LanguagesSection({ section, handleSectionChange, hideSection }) {
  const [input, setInput] = useState("");
  const langs = section.content ? section.content.split(",") : [];

  const addLang = () => {
    if (!input.trim()) return;
    handleSectionChange(section.id, [...langs, input.trim()].join(","));
    setInput("");
  };

  const removeLang = (lang) => {
    handleSectionChange(section.id, langs.filter(l => l !== lang).join(","));
  };

  return (
    <fieldset className="fieldset border border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg">{section.label}</legend>
      <div className="flex gap-2 flex-wrap mb-2">
        {langs.map((l) => (
          <span key={l} className="bg-green-300 px-2 py-1 rounded-full flex items-center gap-1">
            {l} <button onClick={() => removeLang(l)}>×</button>
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
        <button type="button" className="btn btn-sm btn-outline" onClick={addLang}>
          Add
        </button>
      </div>
      <button type="button" className="mt-2 text-sm btn btn-outline btn-secondary w-24" onClick={() => hideSection(section.id)}>
        Hide
      </button>
    </fieldset>
  );
}
