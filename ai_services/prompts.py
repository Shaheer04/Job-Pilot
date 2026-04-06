def build_health_score_prompt(stats):
    return f"""
You are a career coach analyzing a job seeker's application data.
Based on the stats below, write a short personalized assessment.

STATS:
- Total applications: {stats["total"]}
- By stage: {stats["by_stage"]}
- Apply-to-interview rate: {stats["interview_rate"]}%
- Best performing source: {stats["best_source"]}
- All sources: {stats["all_sources"]}
- Rejections before interview: {stats["pre_interview_rejections"]}
- Rejections after interview: {stats["post_interview_rejections"]}
- Stale applications (no update in 7+ days): {stats["stale_count"]}
- This week vs last week: {stats["momentum"]["this_week"]} vs {stats["momentum"]["last_week"]}
- Overall trend: {stats["momentum"]["trend"]}
- Overall rating: {stats["overall_rating"]}

Respond ONLY with a JSON object, no markdown, no explanation outside the JSON:
{{
  "summary": "2-3 sentence plain English summary of their job search health",
  "whats_working": "one specific thing going well based on the data",
  "main_problem": "the single biggest issue you see in the data",
  "top_3_actions": [
    "specific action 1 tailored to their data",
    "specific action 2 tailored to their data",
    "specific action 3 tailored to their data"
  ]
}}

Rules:
- Be direct and specific — reference their actual numbers
- Never give generic advice like "apply to more jobs"
- top_3_actions must be concrete steps they can take this week
- Keep summary under 60 words
"""
