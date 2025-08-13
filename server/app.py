from flask import Flask, request, jsonify, send_file
from model.JobSearch import process_resume_file
from model.AtsScoreChecker import run_ats_scoring
from model.ResumeMaker import generate_resume
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/upload_resume", methods=["POST"])
def upload_resume():
    # print(request.form)
    print(request.files)
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    if "location" not in request.form:
        return jsonify({"error": "No file uploaded"}), 400
    if "model" not in request.form:
        return jsonify({"error": "No model number added"}), 400

    file = request.files["resume"]
    location = request.form["location"]
    model = request.form["model"]
    result = "No File"
    
    if model == '1':
        result = process_resume_file(file, location)
    elif model == '2':
        result = run_ats_scoring(file.stream, file.filename)
    return jsonify(result)

@app.route("/generate_resume", methods=["POST"])
def generate_resume_route():
    input_data = request.json  # frontend sends JSON
    print(input_data)
    print(request)
    pdf_file = generate_resume(input_data)

    # Send both PDF file and text in one response (PDF as download)
    return send_file(pdf_file, download_name="generated_resume.pdf", as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
