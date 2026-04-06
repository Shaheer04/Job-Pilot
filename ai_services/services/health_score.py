from jobs.models import JobApplication
from django.db.models import Count
from datetime import timedelta
from django.utils import timezone
import json
import google.generativeai as genai
from decouple import config
from ai_services.prompts import build_health_score_prompt

genai.configure(api_key=config("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash-lite")


def calculate_stats(user):
    
    # Base Query Set
    all_jobs = JobApplication.objects.filter(user=user)
    total = all_jobs.count()
    
    if total == 0:
        return None
    
    # Stage Counts
    
    stages = dict(
        all_jobs.values_list('current_stage').annotate(count=Count('id')).values_list('current_stage', 'count')
    )
    
    
    # Stages now look likes this: {'applied' : 10, "interview:3", " rejected: 5 "}
    
    applied = stages.get('applied', 0)
    followed_up = stages.get('followed_up', 0)
    interview = stages.get('interview', 0)
    offer = stages.get('offer', 0)
    rejected = stages.get('rejected', 0)
    archived = stages.get('archived', 0)
    
    
    # Apply to interview rate
    progressed = interview + offer
    interview_rate = round((progressed/total) * 100, 1) if total > 0 else 0
    
    # Best Source
    # which platform is generating the most applications
    sources = list(
        all_jobs.exclude(source='').values('source').annotate(count=Count('id')).order_by('-count')
    )
    
    best_source = sources[0]['source'] if sources else 'Not tracked'
    
    
    # Stage drop off
    # Where are people losing = before or after interview
    
    if total > 0:
        pre_interview_rejections = all_jobs.filter(
            current_stage='rejected'
        ).count()
        
        
        # jobs that reached interview or beyond then got rejected
        post_interview_rejections = all_jobs.filter(
            current_stage='rejected',
            stage_history__stage='interview'
        ).distinct().count()
        
        pre_interview_rejections = pre_interview_rejections - post_interview_rejections
    else:
        pre_interview_rejections = 0
        post_interview_rejections = 0
        
    
    # stale applications 
    # jobs with no update in 7+ days still in early stages
    seven_days_ago = timezone.now()- timedelta(days=7)
    stale = list(
        all_jobs.filter(
            updated_at__lt=seven_days_ago,
            current_stage__in = ['applied', 'followed_up']
        ).values('id', 'title', 'company', 'updated_at')
    )
    
    
    # make updated_at serializeable
    for job in stale:
        job['updated_at'].strftime('%Y-%m-%d')
        job['days_stale'] = (timezone.now().date() - job['updated_at'].__class__.fromisoformat(job['updated_at'])).days
        
    # Weekly momentum 
    now = timezone.now()
    this_week = all_jobs.filter(created_at__gte=now - timedelta(days=7)).count()
    last_week = all_jobs.filter(created_at__gte=now - timedelta(days=14),
                                created_at__lt= now -timedelta(days=7)).count()
    
    if last_week == 0:
        momentum = 'increasing' if this_week > 0 else 'no data'
    elif this_week > last_week:
        momentum = 'increasing'
    elif this_week < 'last_week':
        momentum = 'decreasing'
    else:
        momentum = 'steady'
        
    
    # Overall rating
    if interview_rate >= 15 and len(stale) == 0:
        overall_rating = 'Healthy'
    elif interview_rate >= 8 or len(stale) <= 3:
        overall_rating = 'Needs Attention'
    else:
        overall_rating = 'Critical'
        
        
    return {
        'total' : total,
        'by_stage' : {
            'applied' : applied,
            'followed_up' : followed_up,
            'interview' : interview,
            'offer' : offer,
            'rejected' : rejected,
            'archived' : archived,
        },
        'interview_rate' : interview_rate,
        'best_source' : best_source,
        'all_sources' : sources,
        'pre_interview_rejections' : pre_interview_rejections,
        'post_interview_rejections' : post_interview_rejections,
        'stale_applications' : stale,
        'stale_count' : len(stale),
        'momentum' : {
            'this_week' : this_week,
            'last_week' : last_week,
            'trend' : momentum,
        },
        'overall_rating' : overall_rating,
    }
    
    
def generate_advice(stats):
    try:
        prompt = build_health_score_prompt(stats)
        response = model.generate_content(prompt)
        text = response.text.strip()

        # strip markdown code blocks if Gemini wraps the response
        text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except json.JSONDecodeError:
        return {
            "summary": "Unable to generate advice right now.",
            "whats_working": "",
            "main_problem": "",
            "top_3_actions": [],
        }
    except Exception as e:
        return {
            "summary": "AI service temporarily unavailable.",
            "whats_working": "",
            "main_problem": "",
            "top_3_actions": [],
            "error": str(e),
        }