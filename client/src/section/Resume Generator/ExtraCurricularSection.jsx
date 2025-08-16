import React, { useState } from "react";

export default function ExtraCurricularSection({ section, handleSectionChange, hideSection }) {
  const [input, setInput] = useState("");
  const activities = section.content ? section.content.split(",") : [];

  const addActivity = () => {
    if (!input.trim()) return;
    const newActivities = [...activities, input.trim()];
    handleSectionChange(section.id, newActivities.join(","));
    setInput("");
  };

  const removeActivity = (activity) => {
    handleSectionChange(section.id, activities.filter((s) => s !== activity).join(","));
  };

  return (
    <fieldset className="fieldset border border-indigo-400 dark:border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg section-text-theme">{section.label}</legend>
      <div className="flex gap-2 flex-wrap mb-2">
        {activities.map((activity) => (
          <span key={activity} className="bg-indigo-200 dark:bg-yellow-500 px-2 py-1 rounded-full flex items-center gap-1 section-text-theme">
            {activity} <button onClick={() => removeActivity(activity)}><i class="fa-solid fa-xmark"></i></button>
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
        <button type="button" className="btn btn-sm btn-outline" onClick={addActivity}>
          Add
        </button>
      </div>
      <button type="button" className="mt-2 text-sm btn btn-outline btn-secondary w-24" onClick={() => hideSection(section.id)}>
        Hide
      </button>
    </fieldset>
  );
}
