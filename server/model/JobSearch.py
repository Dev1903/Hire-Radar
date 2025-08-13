import os
import re
import fitz  # PyMuPDF
import docx2txt
import requests
import nltk
from nltk.tokenize import word_tokenize

nltk.download('punkt')

POSSIBLE_SKILLS = [
    "java", "python", "sql", "spring boot", "docker", "aws", "react", "html", "css",
    "kubernetes", "git", "tensorflow", "pandas", "linux", "javascript", "firebase",
    "excel", "power bi", "selenium", "kotlin", "swift", "hadoop", "spark", "scala"
]

def fetch_jobs_from_adzuna(skills_list, location, max_results=5):
    app_id = "99f8c648"
    app_key = "95ac41142e058a74d733548e95afbd10"
    headers = {"Accept": "application/json"}
    all_jobs = []

    for skill in skills_list:
        url = (
            f"https://api.adzuna.com/v1/api/jobs/in/search/1"
            f"?app_id={app_id}&app_key={app_key}"
            f"&what={skill}&where={location}&results_per_page={max_results}&sort_by=date"
        )
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            jobs = response.json().get("results", [])
            for job in jobs:
                job_data = {
                    "title": job.get("title"),
                    "company": job.get("company", {}).get("display_name"),
                    "location": job.get("location", {}).get("display_name"),
                    "salary_predicted": bool(int(job.get("salary_is_predicted", 0))),
                    "description": job.get("description"),
                    "url": job.get("redirect_url")
                }
                all_jobs.append(job_data)
    return all_jobs

def process_resume_file(file_storage, location):
    filename = file_storage.filename.lower()

    # PDF: process directly from memory
    if filename.endswith(".pdf"):
        pdf_bytes = file_storage.read()
        file_storage.seek(0)
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        resume_text = text.lower()

    # DOCX: save temporarily
    elif filename.endswith(".docx"):
        temp_path = "temp_resume.docx"
        file_storage.save(temp_path)
        resume_text = docx2txt.process(temp_path).lower()
        os.remove(temp_path)
    else:
        return {"skills": [], "experience": 0, "jobs": []}

    # Extract skills
    found_skills = [skill for skill in POSSIBLE_SKILLS if skill in resume_text]

    # Extract years of experience
    exp_match = re.search(r'(\d+)\s*(?:\+)?\s*(?:years|yrs|year)', resume_text)
    experience = int(exp_match.group(1)) if exp_match else 0

    # Fetch jobs
    jobs = fetch_jobs_from_adzuna(found_skills[:5], location=location, max_results=5) if found_skills else []

    return {
        "skills": found_skills,
        "experience": experience,
        "jobs": jobs
    }
