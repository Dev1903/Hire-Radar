from fpdf import FPDF
import io
import os

# Path to font folder
FONT_PATH = os.path.join(os.path.dirname(__file__), "..", "fonts")


class StyledPDF(FPDF):
    def __init__(self):
        super().__init__()
        # Add Roboto fonts
        self.add_font('Roboto', '', os.path.join(FONT_PATH, 'Roboto-Regular.ttf'), uni=True)
        self.add_font('Roboto', 'B', os.path.join(FONT_PATH, 'Roboto-Bold.ttf'), uni=True)
        
        self.font_size_normal = 10
        self.font_size_header = 14
        self.font_size_subheader = 12
        self.line_height = 6

    def set_compact_style(self, scale_factor):
        self.font_size_normal = max(8, int(10 * scale_factor))
        self.font_size_header = max(10, int(14 * scale_factor))
        self.font_size_subheader = max(9, int(12 * scale_factor))
        self.line_height = max(5, int(6 * scale_factor))

    def header(self):
        self.set_font("Roboto", "B", self.font_size_header + 4)
        self.set_text_color(30, 30, 30)
        self.cell(0, 10, self.input_data['full_name'].upper(), ln=True, align="C")

        self.set_font("Roboto", "", self.font_size_normal)
        self.set_text_color(80, 80, 80)
        self.cell(0, 6, f"{self.input_data['email']} | {self.input_data['phone']}", ln=True, align="C")

        linkedin = self.input_data.get('linkedin', '')
        github = self.input_data.get('github', '')
        separator = " | "

        self.set_font("Roboto", "U", self.font_size_normal)
        linkedin_width = self.get_string_width(linkedin)
        github_width = self.get_string_width(github)
        separator_width = self.get_string_width(separator)

        total_width = linkedin_width + separator_width + github_width
        page_width = self.w - 2 * self.l_margin
        start_x = (page_width - total_width) / 2 + self.l_margin

        self.set_xy(start_x, self.get_y())
        if linkedin:
            self.write(self.line_height, linkedin)
        self.set_font("Roboto", "", self.font_size_normal)
        if linkedin and github:
            self.write(self.line_height, separator)
        if github:
            self.set_font("Roboto", "U", self.font_size_normal)
            self.write(self.line_height, github)
        self.ln(8)

    def add_section(self, title):
        self.set_text_color(0, 0, 139)
        self.set_font("Roboto", "B", self.font_size_header)
        self.cell(0, self.line_height, title.upper(), ln=True)
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def add_colored_subheader(self, label):
        self.set_font("Roboto", "B", self.font_size_subheader)
        self.set_text_color(0, 102, 204)
        self.multi_cell(0, self.line_height - 1, label)
        self.set_text_color(0, 0, 0)
        self.ln(1)

    def add_text(self, text, bullet=False):
        self.set_font("Roboto", "", self.font_size_normal)
        if bullet:
            self.multi_cell(0, self.line_height, f"• {text}")
        else:
            self.multi_cell(0, self.line_height, text)
        self.ln(1)

    def add_underline(self):
        self.set_draw_color(180, 180, 180)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), self.w - 10, self.get_y())
        self.ln(3)


def generate_resume(input_data):
    pdf = StyledPDF()
    pdf.input_data = input_data
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(15, 15, 15)
    pdf.add_page()
    pdf.set_compact_style(1.0)

    for section in input_data.get('section_order', []):
        sec = section.lower()
        content = input_data.get(section.replace(" ", "_"), None)
        if not content:
            continue

        # Career Objective
        if sec == "career objective":
            pdf.add_section("Career Objective")
            pdf.add_text(content)

        # Education
        elif sec == "education":
            pdf.add_section("Education")
            for edu in content:
                title_line = f"{edu.get('type', '')} - {edu.get('institution', '')}".strip(" -")
                pdf.add_colored_subheader(title_line)
                details = []
                if edu.get('duration'):
                    details.append(edu['duration'])
                if edu.get('cgpa'):
                    details.append(f"CGPA/Percentage: {edu['cgpa']}")
                if details:
                    pdf.add_text(" | ".join(details))
            pdf.ln(2)

        # Work Experience
        elif sec == "work experience":
            pdf.add_section("Work Experience")
            for exp in content:
                title = exp.get('title', '')
                subtitle = exp.get('subtitle', '')
                header_text = f"{title} | {subtitle}" if subtitle else title
                pdf.add_colored_subheader(header_text)
                if exp.get('duration'):
                    pdf.add_text(f"Duration: {exp['duration']}")
                if exp.get('description'):
                    pdf.add_text(exp['description'], bullet=True)
                if exp.get('link'):
                    pdf.set_text_color(0, 102, 204)
                    pdf.add_text(f"Link: {exp['link']}")
                    pdf.set_text_color(0, 0, 0)
            pdf.ln(2)

        # Projects
        elif sec == "projects":
            pdf.add_section("Projects")
            for proj in content:
                header_text = f"{proj.get('title', '')} | {proj.get('subtitle', '')}" if proj.get('subtitle') else proj.get('title', '')
                pdf.add_colored_subheader(header_text)
                if proj.get('duration'):
                    pdf.add_text(f"Duration: {proj['duration']}")
                if proj.get('description'):
                    pdf.add_text(proj['description'], bullet=True)
                if proj.get('link'):
                    pdf.set_text_color(0, 102, 204)
                    pdf.add_text(f"Link: {proj['link']}")
                    pdf.set_text_color(0, 0, 0)
            pdf.ln(2)

        # Extra Curricular Activities & Certifications (nested arrays)
        elif sec in ["extra curricular activities", "certifications"]:
            pdf.add_section(section)
            for item in content:
                title = item.get('title', '')
                subtitle = item.get('subtitle', '')
                header_text = f"{title} | {subtitle}" if subtitle else title
                pdf.add_colored_subheader(header_text)
                if item.get('duration'):
                    pdf.add_text(f"Duration: {item['duration']}")
                if item.get('description'):
                    pdf.add_text(item['description'], bullet=True)
                if item.get('link'):
                    pdf.set_text_color(0, 102, 204)
                    pdf.add_text(f"Link: {item['link']}")
                    pdf.set_text_color(0, 0, 0)
            pdf.ln(2)

        # Skills, Languages, Achievements (simple lists)
        else:
            pdf.add_section(section)
            if isinstance(content, list):
                for item in content:
                    if isinstance(item, dict):
                        title = item.get('title') or item.get('sub', '')
                        desc = item.get('description') or item.get('desc', '')
                        if title:
                            pdf.add_colored_subheader(title)
                        if desc:
                            pdf.add_text(desc, bullet=True)
                    else:
                        pdf.add_text(str(item), bullet=True)
            else:
                pdf.add_text(str(content))

    pdf_bytes = pdf.output(dest='S').encode('latin-1', 'replace')
    return io.BytesIO(pdf_bytes)
