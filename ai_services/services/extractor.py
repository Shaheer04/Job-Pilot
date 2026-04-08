import json
import google.generativeai as genai
from decouple import config
from ai_services.prompts import build_extraction_prompt
import re

genai.configure(api_key=config("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash-lite")

# def extract_job_details(description):
#     try:
#         prompt = build_extraction_prompt(description)
#         response = model.generate_content(prompt)
#         text = response.text.strip()
        
#         # strip markdown code blocks if Gemini wraps the response
#         text = text.replace("```json", "").replace(" `", "").strip()

#         return json.loads(text)
#     except Exception as e:
#           return {
#               "error": str(e),
#               "title": "Unknown",
#               "company": "Unknown",
#               "location": "",
#               "job_type": "",
#               "salary_range": "",
#               "source": "External"
#           }

def extract_job_details(description):
    try:
        prompt = build_extraction_prompt(description)
        response = model.generate_content(prompt)
        text = response.text.strip()
        # 1. More robust way to strip markdown backticks
        text = re.sub(r'^```json\s*|  `$', '', text, flags=re.MULTILINE).strip()
        
        
        # This is the most reliable way to handle Gemini's markdown response:
       # It finds the first '{' and the last '}' and takes everything in between
        start = text.find('{')
        end = text.rfind('}') + 1
        
        if start != -1 and end != 0:
            text = text[start:end]

        # Add a print here for your backend console so you can see exactly what AI said
        print(f"DEBUG AI Response: {text}")
        return json.loads(text)
    
    except Exception as e:
        print(f"Error parsing AI response: {e}") # Print the real error
        return {
              "error": str(e),
              "title": "Unknown",
              "company": "Unknown",
              "location": "",
              "job_type": "",
              "salary_range": "",
              "source": "External"
          }
