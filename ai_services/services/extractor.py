import json
import google.generativeai as genai
from decouple import config
from ai_services.prompts import build_extraction_prompt

genai.configure(api_key=config("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash-lite")

def extract_job_details(description):
    try:
        prompt = build_extraction_prompt(description)
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # strip markdown code blocks if Gemini wraps the response
        text = text.replace("```json", "").replace(" `", "").strip()

        return json.loads(text)
    except Exception as e:
          return {
              "error": str(e),
              "title": "Unknown",
              "company": "Unknown",
              "location": "",
              "job_type": "",
              "salary_range": "",
              "source": "External"
          }
