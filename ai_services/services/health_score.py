from jobs.models import JobApplication
from django.db.models import Count
from datetime import timedelta
from django.utils import timezone
import json
import google.generativeai as genai
from decouple import config
from django.conf import settings
from ai_services.prompts import build_health_score_prompt

genai.configure(api_key=config("GEMINI_API_KEY"))
model = genai.GenerativeModel(settings.AI_MODEL_NAME)


def calculate_stats(user):
    all_jobs = JobApplication.objects.filter(user=user)
    total = all_jobs.count()
    
    if total == 0:
        return {
            'total_applications': 0,
            'stage_counts': {
                'applied': 0, 'followed_up': 0, 'interview': 0, 
                'offer': 0, 'rejected': 0, 'archived': 0
            },
            'interview_rate': 0,
            'best_source': 'N/A',
            'stale_count': 0,
            'weekly_momentum': 0,
            'rating': 'Analyzing'
        }
    
    # Stage Counts
    stages_qs = all_jobs.values('current_stage').annotate(count=Count('id'))
    stage_counts = {
        'applied': 0, 'followed_up': 0, 'interview': 0, 
        'offer': 0, 'rejected': 0, 'archived': 0
    }
    for item in stages_qs:
        stage_counts[item['current_stage']] = item['count']
    
    # Apply to interview rate
    progressed = stage_counts.get('interview', 0) + stage_counts.get('offer', 0)
    interview_rate = round((progressed / total) * 100, 1)
    
    # Best Source
    sources = all_jobs.exclude(source='').values('source').annotate(count=Count('id')).order_by('-count')
    best_source = sources[0]['source'] if sources.exists() else 'Direct'
    
    # Rejections logic
    pre_interview_rejections = all_jobs.filter(current_stage='rejected').count()
    post_interview_rejections = all_jobs.filter(
        current_stage='rejected',
        stage_history__stage='interview'
    ).distinct().count()
    pre_interview_rejections = max(0, pre_interview_rejections - post_interview_rejections)
        
    # Stale applications 
    seven_days_ago = timezone.now() - timedelta(days=7)
    stale_count = all_jobs.filter(
        updated_at__lt=seven_days_ago,
        current_stage__in=['applied', 'followed_up']
    ).count()
    
    # Weekly momentum 
    now = timezone.now()
    this_week = all_jobs.filter(created_at__gte=now - timedelta(days=7)).count()
    last_week = all_jobs.filter(
        created_at__gte=now - timedelta(days=14),
        created_at__lt=now - timedelta(days=7)
    ).count()
    
    # Overall rating
    if interview_rate >= 15 and stale_count == 0:
        overall_rating = 'Healthy'
    elif interview_rate >= 8 or stale_count <= 3:
        overall_rating = 'Needs Attention'
    else:
        overall_rating = 'Critical'
        
    # Match frontend keys exactly
    return {
        'total_applications': total,
        'stage_counts': stage_counts,
        'interview_rate': interview_rate,
        'best_source': best_source,
        'all_sources': list(sources), # Added this
        'stale_count': stale_count,
        'weekly_momentum': this_week,
        'rating': overall_rating,
        # Legacy fields for AI prompt
        'total': total,
        'by_stage': stage_counts,
        'pre_interview_rejections': pre_interview_rejections,
        'post_interview_rejections': post_interview_rejections,
        'momentum': {
            'this_week': this_week,
            'last_week': last_week,
            'trend': 'increasing' if this_week > last_week else 'steady'
        },
        'overall_rating': overall_rating
    }
    
    
def generate_advice(stats):
    try:
        # Minimum 5 apps for AI advice to be meaningful
        if stats['total_applications'] < 5:
            return {
                "summary": "Track at least 5 applications to unlock AI tactical advice.",
                "whats_working": "Initial setup",
                "main_problem": "Insufficient data",
                "top_3_actions": ["Add 5+ applications", "Complete job details", "Update job stages"]
            }

        prompt = build_health_score_prompt(stats)
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Strip markdown and any noise
        if "{" in text:
            text = text[text.find("{"):text.rfind("}")+1]

        return json.loads(text)

    except Exception as e:
        print(f"Advice Error: {e}")
        return {
            "summary": "AI strategy engine is warming up.",
            "whats_working": "Data collection",
            "main_problem": "AI timeout",
            "top_3_actions": ["Keep tracking jobs", "Check back later", "Manual follow-up"],
        }
