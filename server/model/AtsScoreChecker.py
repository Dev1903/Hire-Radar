# ats_score.py
import re
import spacy
import PyPDF2
import docx
import os
import nltk
from nltk.corpus import words as nltk_words

# Download required resources (only once)
nltk.download('words', quiet=True)
nlp = spacy.load("en_core_web_sm")
english_words = set(w.lower() for w in nltk_words.words())

# ===== Extract Resume Text =====
def extract_text(file_stream, filename):
    text = ""
    if filename.lower().endswith(".pdf"):
        pdf_reader = PyPDF2.PdfReader(file_stream)
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
    elif filename.lower().endswith(".docx"):
        doc = docx.Document(file_stream)
        for para in doc.paragraphs:
            text += para.text + " "
    else:
        raise ValueError("Unsupported file format. Use PDF or DOCX.")
    return text.strip()

# ===== Role & Skills Mapping =====
role_keywords = {
    "Java Developer": ["java", "spring", "hibernate", "rest api", "sql", "docker", "kubernetes", "aws", "git"],
    "Python Developer": ["python", "django", "flask", "rest api", "pandas", "numpy", "aws", "docker", "git"],
    "Frontend Developer": ["html", "css", "javascript", "react", "bootstrap", "git"],
    "Backend Developer": ["java", "spring", "hibernate", "rest api", "sql", "docker", "kubernetes", "aws", "git"],
    "Full Stack Developer": ["html", "css", "javascript", "react", "node", "sql", "aws", "docker", "git"],
    "Data Scientist": ["machine learning", "deep learning", "nlp", "pandas", "numpy", "tensorflow", "aws", "git"]
}

def detect_best_role(text):
    text_lower = text.lower()
    best_role = None
    best_match_count = 0
    for role, skills in role_keywords.items():
        count = sum(1 for skill in skills if skill in text_lower)
        if count > best_match_count:
            best_match_count = count
            best_role = role
    return best_role

# ===== ATS Score Calculation =====
def calculate_ats_score(text, filename, file_size_mb):
    text_lower = text.lower()
    scores = {}

    best_role = detect_best_role(text_lower)
    relevant_skills = role_keywords.get(best_role, [])

    # Skills Match (45%)
    matched_keywords = [kw for kw in relevant_skills if kw in text_lower]
    scores["Skills Match"] = (len(matched_keywords) / len(relevant_skills)) * 45 if relevant_skills else 0

    # Essential Sections (15%)
    essential_sections = ["contact", "summary", "experience", "skills", "education"]
    section_count = sum(1 for sec in essential_sections if sec in text_lower)
    scores["Essential Sections"] = (section_count / len(essential_sections)) * 15

    # ATS Parse Rate (10%)
    scores["ATS Parse Rate"] = 10 if len(text.strip()) > 200 else 7

    # Quantifying Impact (5%)
    scores["Quantifying Impact"] = 5 if re.search(r"\d+%|\d+\s*(years|months)|\$\d+|₹\d+", text_lower) else 3

    # Repetition Penalty (-2%)
    repetition_penalty = 0
    for kw in set(matched_keywords):
        if text_lower.count(kw) > 10:
            repetition_penalty -= 2
            break
    scores["Repetition Penalty"] = repetition_penalty

    # Spelling & Grammar (2%)
    words = re.findall(r"\b[a-zA-Z]+\b", text_lower)
    misspelled_count = sum(1 for word in words if word not in english_words)
    scores["Spelling & Grammar"] = max(0, 2 - (misspelled_count * 0.01))

    # File Format & Size (5%)
    scores["File Format & Size"] = 5 if (filename.lower().endswith((".pdf", ".docx")) and file_size_mb <= 2) else 3

    # Design (5%)
    scores["Design"] = 5 if not re.search(r"table|image|chart", text_lower) else 4

    # Email Address (3%)
    scores["Email Address"] = 3 if re.search(r"\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b", text_lower) else 0

    # Hyperlink in Header (2%)
    scores["Hyperlink in Header"] = 2 if re.search(r"linkedin\.com|github\.com", text_lower) else 0

    # Experience Bonus (+1/year, max 10)
    exp_bonus = 0
    year_pattern = r"(\d+(\.\d+)?\+?)\s*(year|years)"
    matches = re.findall(year_pattern, text_lower)
    for match in matches:
        try:
            years = float(match[0].replace("+", ""))
            exp_bonus = min(int(years), 10)
            break
        except:
            continue
    scores["Experience Bonus"] = exp_bonus

    total_score = sum(scores.values())
    if total_score > 100:
        total_score = 100

    return round(total_score, 2), scores, matched_keywords, best_role

# ===== Main Callable Function =====
def run_ats_scoring(file_stream, filename):
    file_stream.seek(0)
    text = extract_text(file_stream, filename)
    file_size_mb = len(file_stream.read()) / (1024 * 1024)
    ats_score, scores, matched, best_role = calculate_ats_score(text, filename, file_size_mb)
    return {
        "best_role": best_role,
        "ats_score": ats_score,
        "scores": scores,
        "matched_skills": matched,
        "missing_skills": [kw for kw in role_keywords.get(best_role, []) if kw not in matched]
    }
