import React, { useState } from "react";

export default function JobSearch() {
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("location", location);    
    formData.append("model", "2");    

    const res = await fetch("http://localhost:5000/upload_resume", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setJobs(data.jobs || []);
    console.log(data)
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      <button onClick={handleUpload}>Upload</button>

      <ul>
        {jobs.map((job, i) => (
          <li key={i}>
            <a href={job.url} target="_blank" rel="noreferrer">{job.title}</a> - {job.company}
          </li>
        ))}
      </ul>
    </div>
  );
}
