from jobs.models import JobApplication, ApplicationStage
from django.db.models import Count, Avg, F, Q
from datetime import timedelta
from django.utils import timezone
from django.db.models.functions import TruncDate

def calculate_stats(user):
    all_jobs = JobApplication.objects.filter(user=user)
    total = all_jobs.count()
    
    if total == 0:
        return {
            'total_applications': 0,
            'stage_counts': {'applied': 0, 'followed_up': 0, 'interview': 0, 'offer': 0, 'rejected': 0, 'archived': 0},
            'interview_rate': 0,
            'best_source': 'N/A',
            'stale_count': 0,
            'weekly_momentum': 0,
            'rating': 'Analyzing',
            'funnel': [],
            'top_skills': [],
            'source_performance': [],
            'rule_advice': {"summary": "Start tracking jobs to see insights.", "actions": []}
        }
    
    # 1. Stage Counts & Funnel
    stages_qs = all_jobs.values('current_stage').annotate(count=Count('id'))
    stage_counts = {'applied': 0, 'followed_up': 0, 'interview': 0, 'offer': 0, 'rejected': 0, 'archived': 0}
    for item in stages_qs:
        stage_counts[item['current_stage']] = item['count']
    
    # Funnel Percentages (Relative to Total)
    funnel = [
        {"stage": "Applied", "count": total, "pct": 100},
        {"stage": "Interview", "count": stage_counts['interview'] + stage_counts['offer'], 
         "pct": round(((stage_counts['interview'] + stage_counts['offer']) / total) * 100, 1)},
        {"stage": "Offers", "count": stage_counts['offer'], 
         "pct": round((stage_counts['offer'] / total) * 100, 1)}
    ]

    # 2. Source Performance
    sources = all_jobs.exclude(source='').values('source').annotate(
        total_count=Count('id'),
        interview_count=Count('id', filter=Q(current_stage__in=['interview', 'offer']))
    ).order_by('-total_count')
    
    source_perf = []
    for s in sources:
        rate = round((s['interview_count'] / s['total_count']) * 100, 1) if s['total_count'] > 0 else 0
        source_perf.append({"source": s['source'], "count": s['total_count'], "rate": rate})

    # 3. Top Skills Frequency
    all_skills = []
    for job_skills in all_jobs.exclude(key_skills=[]).values_list('key_skills', flat=True):
        if isinstance(job_skills, list):
            all_skills.extend(job_skills)
    
    skill_counts = {}
    for s in all_skills:
        skill_counts[s] = skill_counts.get(s, 0) + 1
    
    top_skills = sorted([{"name": k, "count": v} for k, v in skill_counts.items()], 
                        key=lambda x: x['count'], reverse=True)[:8]

    # 4. Stale applications 
    seven_days_ago = timezone.now() - timedelta(days=7)
    stale_count = all_jobs.filter(
        updated_at__lt=seven_days_ago,
        current_stage__in=['applied', 'followed_up']
    ).count()
    
    # 5. Rating & Rule-Based Advice
    interview_rate = funnel[1]['pct']
    
    if interview_rate >= 20:
        rating = "Healthy"
        summary = "Your conversion rate is excellent. You're targeting the right roles."
    elif interview_rate >= 10:
        rating = "Needs Attention"
        summary = "You're getting some traction, but your funnel could be tighter."
    else:
        rating = "Critical"
        summary = "Low interview volume detected. Your resume might not be matching job requirements."

    # Generate Logic-Driven Actions
    actions = []
    if interview_rate < 10:
        actions.append("Optimize your resume: Your apply-to-interview rate is low.")
    if stale_count > 0:
        actions.append(f"Follow up: You have {stale_count} applications that haven't moved in 7+ days.")
    if len(source_perf) > 1 and source_perf[0]['rate'] < (source_perf[1]['rate'] if len(source_perf) > 1 else 0):
        actions.append(f"Shift focus: {source_perf[1]['source']} is performing better than {source_perf[0]['source']}.")
    if not top_skills:
        actions.append("Add job descriptions to see which skills are most requested in your search.")
    elif len(top_skills) > 0 and top_skills[0]['count'] > (total / 2):
        actions.append(f"Highlight {top_skills[0]['name']}: This skill appears in over 50% of your targeted jobs.")

    return {
        'total_applications': total,
        'stage_counts': stage_counts,
        'interview_rate': interview_rate,
        'rating': rating,
        'stale_count': stale_count,
        'funnel': funnel,
        'source_performance': source_perf,
        'top_skills': top_skills,
        'rule_advice': {
            'summary': summary,
            'actions': actions[:3]
        }
    }

def generate_advice(stats):
    return stats['rule_advice']
