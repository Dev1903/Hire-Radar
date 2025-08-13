import React from "react";
import ProjectsSection from "./ProjectsSection";

export default function AchievementsSection({ achievements, setAchievements }) {
  return <ProjectsSection  projects={achievements} setProjects={setAchievements} label="Achievements" />;
}
