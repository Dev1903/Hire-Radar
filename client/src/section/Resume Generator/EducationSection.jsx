import React from "react";

export default function EducationSection({ section, handleSectionChange, hideSection }) {
  const educations = section.content || []; // no JSON.parse

  const addEducation = () =>
    handleSectionChange(section.id, [
      ...educations,
      { type: "", institution: "", duration: "", cgpa: "" },
    ]);

  const updateEducation = (i, key, value) => {
    const newEd = [...educations];
    if (key === null) {
      newEd[i] = value; // full object replacement
    } else {
      newEd[i][key] = value; // single field
    }
    handleSectionChange(section.id, newEd);
  };


  const removeEducation = (i) =>
    handleSectionChange(
      section.id,
      educations.filter((_, idx) => idx !== i)
    );

  function formatMonth(val) {
    if (!val) return "";
    const [year, month] = val.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  }

  return (
    <fieldset className="fieldset border border-indigo-400 dark:border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg section-text-theme">{section.label}</legend>

      {educations.map((ed, i) => (
        <div key={i} className="border p-2 rounded mb-2">
          <input
            placeholder="Type (Class X/12/UG)"
            value={ed.type}
            onChange={(e) => updateEducation(i, "type", e.target.value)}
            className="input w-full mb-1"
          />

          <input
            placeholder="School/University"
            value={ed.institution}
            onChange={(e) => updateEducation(i, "institution", e.target.value)}
            className="input w-full mb-1"
          />

          <div className="flex gap-2 mb-1">
            <input
              type="month"
              placeholder="From"
              value={ed.from || ""}
              onChange={(e) => {
                const from = e.target.value;
                const duration = `${formatMonth(from)}${ed.to ? " - " + formatMonth(ed.to) : ""}`;

                const newEd = { ...ed, from, duration }; // merge both
                updateEducation(i, null, newEd); // pass full object
              }}

              className="input w-1/2"
            />
            <input
              type="month"
              placeholder="To"
              value={ed.to || ""}
              onChange={(e) => {
                const to = e.target.value;
                const duration = `${ed.from ? formatMonth(ed.from) + " - " : ""}${formatMonth(to)}`;

                const newEd = { ...ed, to, duration };
                updateEducation(i, null, newEd);
              }}

              className="input w-1/2"
            />
          </div>

          <input
            placeholder="Percentage/CGPA"
            value={ed.cgpa}
            onChange={(e) => updateEducation(i, "cgpa", e.target.value)}
            className="input w-full mb-1"
          />

          <button
            className="btn btn-sm btn-error"
            type="button"
            onClick={() => removeEducation(i)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        className="btn btn-sm btn-outline mb-2"
        type="button"
        onClick={addEducation}
      >
        Add Education
      </button>

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
