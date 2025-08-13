import React from "react";

export default function WorkExperienceSection({ section, handleSectionChange, hideSection }) {
  const experiences = section.content || [];

  const addExperience = () => handleSectionChange(section.id, [...experiences, { post: "", company: "", from: "", to: "", duration: "", description: "" }]);
  const updateExperience = (i, key, value) => {
    const newEx = [...experiences];
    newEx[i][key] = value;
    handleSectionChange(section.id, newEx);
  };
  const removeExperience = (i) => handleSectionChange(section.id, experiences.filter((_, idx) => idx !== i));

  function formatMonth(val) {
    if (!val) return "";
    const [year, month] = val.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  }

  return (
    <fieldset className="fieldset border border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg">{section.label}</legend>
      {experiences.map((ex, i) => (
        <div key={i} className="border p-2 rounded mb-2">
          <input placeholder="Post" value={ex.post} onChange={e => updateExperience(i,"post",e.target.value)} className="input w-full mb-1"/>
          <input placeholder="Company" value={ex.company} onChange={e => updateExperience(i,"company",e.target.value)} className="input w-full mb-1"/>

          <div className="flex gap-2 mb-1">
            <input
              type="month"
              placeholder="From"
              value={ex.from || ""}
              onChange={(e) => {
                const from = e.target.value;
                const dur = `${formatMonth(from)}${ex.to ? " - " + formatMonth(ex.to) : ""}`;
                updateExperience(i,"from", from);
                updateExperience(i,"duration", dur);
              }}
              className="input w-1/2"
            />
            <input
              type="month"
              placeholder="To"
              value={ex.to || ""}
              onChange={(e) => {
                const to = e.target.value;
                const dur = `${ex.from ? formatMonth(ex.from) + " - " : ""}${formatMonth(to)}`;
                updateExperience(i,"to", to);
                updateExperience(i,"duration", dur);
              }}
              className="input w-1/2"
            />
          </div>

          <textarea placeholder="Description" value={ex.description} onChange={e => updateExperience(i,"description",e.target.value)} className="textarea w-full mb-1"/>
          <button className="btn btn-sm btn-error" onClick={()=>removeExperience(i)}>Remove</button>
        </div>
      ))}
      <button className="btn btn-sm btn-outline mb-2" type="button" onClick={addExperience}>Add Experience</button>
      <button type="button" className="mt-2 text-sm btn btn-outline btn-secondary w-24" onClick={()=>hideSection(section.id)}>Hide</button>
    </fieldset>
  );
}
