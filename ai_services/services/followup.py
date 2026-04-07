import json
import google.generativeai as genai
from decouple import config
from datetime import date
from jobs.models import JobApplication
from ai_services.prompts import build_followup_prompt

genai.configure(api_key=config('GEMINI_API_KEY'))
model = genai.GenerativeModel("gemini-2.5-flash-lite")


def generate_followup(job, user):
    
    # Calculate days since applied fresh
    days_since_applied = (date.today() - job.applied_date).days
    
    
    # gather any notes the user added for context
    notes_list = list(
        job.notes.values_list('content', flat=True).order_by('-created_at')[:3]
    )
    notes_text = '| '.join(notes_list) if notes_list else None
    
    prompt = build_followup_prompt(
        job_title= job.title,
        company = job.company,
        days_since_applied= days_since_applied,
        current_stage= job.current_stage,
        user_name= user.get_full_name() or user.username,
        notes = notes_text,
    )
    
    try :
        response = model.generate_content(prompt)
        text = response.text.strip()
        text = text.replace('```json', '').replace('```', '').strip()
        data = json.loads(text)
        
        
        # always attach the days_since_applied so frontend can display it 
        data['days_since_applied'] = days_since_applied
        return data
    except json.JSONDecodeError:
        return{
            'error' : 'Could not parse AI response.',
            'days_since_applied' : 'days_since_applied'
        }
    except Exception as e:
        return {
            'error' : str(e),
            'days_since_applied' : days_since_applied,
        }