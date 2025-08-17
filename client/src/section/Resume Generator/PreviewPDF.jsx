import React, { useRef, useState, useEffect } from "react";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.78;

export default function PreviewPDF({ sections, formData }) {
  const containerRef = useRef();
  const sectionRefs = useRef([]);

  const [scale, setScale] = useState(1);
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const activeSections = sections.filter(
    (sec) =>
      sec.active &&
      sec.content &&
      (Array.isArray(sec.content) ? sec.content.length > 0 : sec.content.trim() !== "")
  );

  useEffect(() => {
    sectionRefs.current = [];
  }, [activeSections]);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  // Scale to fit container width (desktop only)
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const isMobile = containerWidth < 768;

      if (isMobile) {
        setScale(1); // No scaling on mobile
      } else {
        setScale(containerWidth / (A4_WIDTH_MM * MM_TO_PX));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build pages dynamically with real-time height
  useEffect(() => {
    const pageHeightPx = A4_HEIGHT_MM * MM_TO_PX;

    const personalInfoHeight =
      containerRef.current?.querySelector(".personal-info")?.offsetHeight || 100;

    let currentPage = [];
    let currentHeight = personalInfoHeight;
    const newPages = [];

    const pushPage = () => {
      if (currentPage.length) newPages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    };

    activeSections.forEach((sec, idx) => {
      const sectionEl = sectionRefs.current[idx];
      const sectionHeight = sectionEl?.offsetHeight || 200;

      if (currentHeight + sectionHeight > pageHeightPx) {
        pushPage();
        currentPage.push(sec);
        currentHeight = sectionHeight;
      } else {
        currentPage.push(sec);
        currentHeight += sectionHeight;
      }
    });

    pushPage();
    setPages(newPages.length ? newPages : [[]]);
    setCurrentPageIndex(0);
  }, [JSON.stringify(activeSections), JSON.stringify(formData)]);

  const scrollToPage = (index) => {
    if (!containerRef.current) return;
    const pageHeightPx = A4_HEIGHT_MM * MM_TO_PX * scale;
    containerRef.current.scrollTo({ top: index * pageHeightPx, behavior: "smooth" });
    setCurrentPageIndex(index);
  };

  return (
    <div className="flex flex-col h-full border w-full">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-100 dark:bg-gray-900"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {pages.map((page, idx) => (
          <div
            key={idx}
            className="mx-auto bg-gray-100 dark:bg-white shadow-lg mb-4"
            style={{
              width: `100%`,
              maxWidth: `${A4_WIDTH_MM * MM_TO_PX}px`,
              minHeight: `${A4_HEIGHT_MM * MM_TO_PX}px`,
              transform: scale !== 1 ? `scale(${scale})` : "none",
              transformOrigin: "top left",
              padding: "24px",
              scrollSnapAlign: "start",
            }}
          >
            {/* Always show personal info */}
            {idx === 0 && (
              <div className="text-center mb-6 personal-info">
                <h1 className="text-xl text-black dark:text-black font-bold break-words">
                  {formData.full_name || ""}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-600 break-words">
                  {formData.email || ""} | {formData.phone || ""}
                </p>
                <p className="text-neutral-600 dark:text-neutral-600 underline break-words">
                  {formData.linkedin || ""} | {formData.github || ""}
                </p>
              </div>
            )}

            {page.map((sec) => (
              <div key={sec.id} ref={addToRefs} className="mb-6">
                <h2 className="font-bold text-lg uppercase text-blue-600 mb-2">{sec.label}</h2>
                {Array.isArray(sec.content) ? (
                  sec.content.map((item, j) => (
                    <div key={j} className="mb-2">
                      {Object.keys(item)
                        .filter((k) => k !== "from" && k !== "to")
                        .map((key) => (
                          <p key={key} className="whitespace-pre-wrap break-words">
                            {item[key]}
                          </p>
                        ))}
                    </div>
                  ))
                ) : (
                  <p className="whitespace-pre-wrap break-words text-sm text-black dark:text-black">{sec.content}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {pages.length > 1 && (
        <div className="flex justify-center items-center gap-2 p-2 bg-gray-200 dark:bg-gray-800">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => scrollToPage(Math.max(currentPageIndex - 1, 0))}
            disabled={currentPageIndex === 0}
          >
            Prev
          </button>
          <span>
            Page {currentPageIndex + 1} / {pages.length}
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => scrollToPage(Math.min(currentPageIndex + 1, pages.length - 1))}
            disabled={currentPageIndex === pages.length - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
