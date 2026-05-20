from pypdf import PdfReader
import base64

with open("home.pdf","rb") as file:
    home_text=file.read()
with open("AI-ML.pdf","rb") as file:
    aiml_text=file.read()
with open("Web-dev.pdf","rb") as file:
    webdev_text=file.read()

full_text = ""
reader1 = PdfReader("Career-doc.pdf")
for page in reader1.pages:
    text = page.extract_text()
    if text:
        full_text += text
full_text+="\n"

reader2 = PdfReader("home.pdf")
for page in reader2.pages:
    text = page.extract_text()
    if text:
        full_text += text
full_text+="\n"

reader3 = PdfReader("AI-ML.pdf")
for page in reader3.pages:
    text = page.extract_text()
    if text:
        full_text += text
full_text+="\n"

reader4 = PdfReader("Web-dev.pdf")
for page in reader4.pages:
    text = page.extract_text()
    if text:
        full_text += text
full_text+="\n"

print(len(full_text))
with open("info.txt","w") as file:
    file.write(full_text)