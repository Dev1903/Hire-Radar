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

    # Generate sections
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
                line = f"{edu.get('type','')} | {edu.get('institution','')} | {edu.get('duration','')} | {edu.get('cgpa','')}"
                pdf.add_colored_subheader(line)
            if input_data.get('class_xii'):
                pdf.add_colored_subheader("Class XII")
                pdf.add_text(input_data['class_xii'])
            if input_data.get('class_x'):
                pdf.add_colored_subheader("Class X")
                pdf.add_text(input_data['class_x'])

        # Work Experience
        elif sec == "work experience":
            pdf.add_section("Work Experience")
            if isinstance(content, list):
                for exp in content:
                    if isinstance(exp, dict):
                        title = exp.get('title', '')
                        subtitle = exp.get('subtitle', '')
                        pdf.add_colored_subheader(f"{title} | {subtitle}" if subtitle else title)
                        desc = exp.get('description', '')
                        if desc:
                            pdf.add_text(desc, bullet=True)
                    else:
                        pdf.add_text(str(exp))
            else:
                pdf.add_text(content)

        # Projects
        elif sec == "projects":
            pdf.add_section("Projects")
            for proj in content:
                title = proj.get('title', '')
                subtitle = proj.get('subtitle', '')
                link = proj.get('link', '')
                pdf.add_colored_subheader(f"{title} | {subtitle}" if subtitle else title)
                pdf.add_text(proj.get('description', ''), bullet=True)
                if link:
                    pdf.set_text_color(0, 102, 204)
                    pdf.add_text(f"Link: {link}")
                    pdf.set_text_color(0, 0, 0)

        # Skills, Certifications, Languages, Achievements
        else:
            pdf.add_section(section)
            if isinstance(content, list):
                for item in content:
                    if isinstance(item, dict):
                        sub = item.get('sub', '')
                        desc = item.get('desc', '')
                        if sub:
                            pdf.add_colored_subheader(sub)
                        if desc:
                            pdf.add_text(desc, bullet=True)
                    else:
                        pdf.add_text(str(item), bullet=True)
            else:
                pdf.add_text(str(content))

    # Output PDF as bytes
    pdf_bytes = pdf.output(dest='S').encode('latin-1', 'replace')
    return io.BytesIO(pdf_bytes)
