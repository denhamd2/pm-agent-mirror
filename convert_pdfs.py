import os
import glob
from PyPDF2 import PdfReader

for folder in ['research/India/customer-transcripts', 'research/India/internal-sme-transcripts']:
    for pdf_path in glob.glob(f"{folder}/*.pdf"):
        txt_path = pdf_path.replace('.pdf', '.txt')
        print(f"Converting {pdf_path} to {txt_path}")
        with open(pdf_path, 'rb') as f:
            reader = PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        with open(txt_path, 'w') as f:
            f.write(text)
