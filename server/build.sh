#!/usr/bin/env bash
# Install Python dependencies
pip install -r requirements.txt

# Download the spaCy model
python -m spacy download en_core_web_sm
