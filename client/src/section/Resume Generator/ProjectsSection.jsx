import React from "react";

export default function ProjectsSection({ section, handleSectionChange, hideSection }) {
  const projects = section.content || [];

  const addProject = () => handleSectionChange(section.id, [...projects, { title: "", subtitle: "", from: "", to: "", duration: "", description: "", link: "" }]);
  const updateProject = (i, key, value) => {
    const newProjects = [...projects];
    newProjects[i][key] = value;
    handleSectionChange(section.id, newProjects);
  };
  const removeProject = (i) => handleSectionChange(section.id, projects.filter((_, idx) => idx !== i));

  function formatMonth(val) {
    if (!val) return "";
    const [year, month] = val.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  }

  return (
    <fieldset className="fieldset border border-indigo-400 dark:border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg section-text-theme">{section.label}</legend>
      {projects.map((p, i) => (
        <div key={i} className="border p-2 rounded mb-2">
          <input placeholder="Title" value={p.title} onChange={e => updateProject(i, "title", e.target.value)} className="input w-full mb-1"/>
          <input placeholder="Subtitle" value={p.subtitle} onChange={e => updateProject(i, "subtitle", e.target.value)} className="input w-full mb-1"/>

          <div className="flex gap-2 mb-1">
            <input
              type="month"
              placeholder="From"
              value={p.from || ""}
              onChange={(e) => {
                const from = e.target.value;
                const dur = `${formatMonth(from)}${p.to ? " - " + formatMonth(p.to) : ""}`;
                updateProject(i,"from", from);
                updateProject(i,"duration", dur);
              }}
              className="input w-1/2"
            />
            <input
              type="month"
              placeholder="To"
              value={p.to || ""}
              onChange={(e) => {
                const to = e.target.value;
                const dur = `${p.from ? formatMonth(p.from) + " - " : ""}${formatMonth(to)}`;
                updateProject(i,"to", to);
                updateProject(i,"duration", dur);
              }}
              className="input w-1/2"
            />
          </div>

          <textarea placeholder="Description" value={p.description} onChange={e => updateProject(i, "description", e.target.value)} className="textarea w-full mb-1"/>
          <input placeholder="Link" value={p.link} onChange={e => updateProject(i, "link", e.target.value)} className="input w-full mb-1"/>
          <button className="btn btn-sm btn-error" onClick={() => removeProject(i)}>Remove</button>
        </div>
      ))}
      <button className="btn btn-sm btn-outline mb-2" type="button" onClick={addProject}>Add Project</button>
      <button type="button" className="mt-2 text-sm btn btn-outline btn-secondary w-24" onClick={() => hideSection(section.id)}>Hide</button>
    </fieldset>
  );
}
