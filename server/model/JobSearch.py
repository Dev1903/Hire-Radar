import re
import math
import os
import re
import fitz  # PyMuPDF
import docx2txt
import requests
import nltk
from nltk.tokenize import word_tokenize
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

nltk.download('punkt')

POSSIBLE_SKILLS = [
    "java", "python", "sql", "spring boot", "docker", "aws", "react", "html", "css",
    "kubernetes", "git", "tensorflow", "pandas", "linux", "javascript", "firebase",
    "excel", "power bi", "selenium", "kotlin", "swift", "hadoop", "spark", "scala"
]

def fetch_jobs_from_adzuna(skills_list, max_results_per_skill=50):
    """
    Fetch ALL jobs from Adzuna API for all skills and merge duplicates.
    No location filtering; frontend will handle filtering.
    """
    app_id = os.getenv("APP_ID")
    app_key = os.getenv("API_KEY")
    print(app_id)
    headers = {"Accept": "application/json"}
    all_jobs_dict = {}  # keyed by redirect_url to remove duplicates

    for skill in skills_list:
        # Fetch multiple pages if necessary
        page = 1
        total_fetched = 0
        while total_fetched < max_results_per_skill:
            url = (
                f"https://api.adzuna.com/v1/api/jobs/in/search/{page}"
                f"?app_id={app_id}&app_key={app_key}"
                f"&what={skill}&results_per_page=50&sort_by=date"
            )
            response = requests.get(url, headers=headers)
            if response.status_code != 200:
                break

            jobs = response.json().get("results", [])
            if not jobs:
                break

            for job in jobs:
                job_url = job.get("redirect_url")
                if not job_url:
                    continue

                job_data = {
                    "title": job.get("title"),
                    "company": job.get("company", {}).get("display_name"),
                    "location": job.get("location", {}).get("display_name"),
                    "salary_min": job.get("salary_min"),
                    "salary_max": job.get("salary_max"),
                    "salary_is_predicted": bool(int(job.get("salary_is_predicted", 0))),
                    "description": job.get("description"),
                    "redirect_url": job_url,
                    "contract_type": job.get("contract_type"),
                    "contract_time": job.get("contract_time"),
                    "category": job.get("category", {}).get("label"),
                    "created": job.get("created"),
                    "latitude": job.get("latitude"),
                    "longitude": job.get("longitude"),
                    "company_logo": job.get("company", {}).get("logo_url"),
                    "company_url": job.get("company", {}).get("url"),
                    "skills_matched": [skill]
                }

                if job_url in all_jobs_dict:
                    # append skill if not already present
                    existing_skills = all_jobs_dict[job_url]["skills_matched"]
                    if skill not in existing_skills:
                        existing_skills.append(skill)
                else:
                    all_jobs_dict[job_url] = job_data

            total_fetched += len(jobs)
            page += 1

    return list(all_jobs_dict.values())


def process_resume_file(file_storage):
    """
    Process PDF/DOCX resume, extract skills, fetch ALL jobs for skills.
    Filtering (location/skills) will be done in frontend.
    """
    filename = file_storage.filename.lower()

    # Extract text from PDF/DOCX
    if filename.endswith(".pdf"):
        pdf_bytes = file_storage.read()
        file_storage.seek(0)
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        resume_text = text.lower()
    elif filename.endswith(".docx"):
        temp_path = "temp_resume.docx"
        file_storage.save(temp_path)
        resume_text = docx2txt.process(temp_path).lower()
        os.remove(temp_path)
    else:
        return {"skills": [], "experience": 0, "jobs": [], "total_jobs": 0}

    # Extract skills
    POSSIBLE_SKILLS = [
        "java", "python", "sql", "spring boot", "docker", "aws", "react", "html", "css",
        "kubernetes", "git", "tensorflow", "pandas", "linux", "javascript", "firebase",
        "excel", "power bi", "selenium", "kotlin", "swift", "hadoop", "spark", "scala"
    ]
    found_skills = [skill for skill in POSSIBLE_SKILLS if skill in resume_text]

    # Extract experience
    exp_match = re.search(r'(\d+)\s*(?:\+)?\s*(?:years|yrs|year)', resume_text)
    experience = int(exp_match.group(1)) if exp_match else 0

    # Fetch ALL jobs for all skills (no location filter)
    all_jobs = fetch_jobs_from_adzuna(found_skills[:5], max_results_per_skill=200) if found_skills else []

    # Sort by created date
    all_jobs.sort(key=lambda x: x.get("created", ""), reverse=True)

    return {
        "skills": found_skills,
        "experience": experience,
        "jobs": all_jobs,
        "total_jobs": len(all_jobs)
    }
