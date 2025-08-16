import React from "react";

export default function CertificationSection({ section, handleSectionChange, hideSection }) {
  const items = Array.isArray(section.content) ? section.content : [];

  const addItem = () => {
    handleSectionChange(section.id, [
      ...items,
      { title: "", subtitle: "", description: "", link: "" },
    ]);
  };

  const updateItem = (i, key, value) => {
    const newItems = [...items];
    newItems[i][key] = value;
    handleSectionChange(section.id, newItems);
  };

  const removeItem = (i) => {
    handleSectionChange(
      section.id,
      items.filter((_, idx) => idx !== i)
    );
  };

  return (
    <fieldset className="fieldset border border-indigo-400 dark:border-yellow-500 p-4 mb-2 rounded-box hover:cursor-grab">
      <legend className="fieldset-legend text-lg section-text-theme">{section.label}</legend>

      {items.map((item, i) => (
        <div key={i} className="border p-3 rounded mb-3">
          <input
            type="text"
            className="input w-full mb-2"
            placeholder="Title"
            value={item.title}
            onChange={(e) => updateItem(i, "title", e.target.value)}
          />

          <input
            type="text"
            className="input w-full mb-2"
            placeholder="Subtitle (optional)"
            value={item.subtitle}
            onChange={(e) => updateItem(i, "subtitle", e.target.value)}
          />

          <textarea
            className="textarea w-full mb-2"
            placeholder="Description"
            rows="3"
            value={item.description}
            onChange={(e) => updateItem(i, "description", e.target.value)}
          />

          <input
            type="text"
            className="input w-full mb-2"
            placeholder="Link (optional)"
            value={item.link}
            onChange={(e) => updateItem(i, "link", e.target.value)}
          />

          <button
            type="button"
            className="btn btn-sm btn-error"
            onClick={() => removeItem(i)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        className="btn btn-sm btn-outline mb-2"
        type="button"
        onClick={addItem}
      >
        Add {section.label}
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
