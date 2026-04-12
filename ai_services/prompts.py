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


def build_followup_prompt(
    job_title, company, days_since_applied, current_stage, user_name, notes
):
    return f"""
You are a career coach helping a job seeker decide whether and how to follow up.

JOB DETAILS:
- Job title: {job_title}
- Company: {company}
- Days since applied: {days_since_applied}
- Current stage: {current_stage}
- Applicant name: {user_name}
- Notes about this job: {notes if notes else "None"}

Based on this, give follow-up advice.

Respond ONLY with a JSON object, no markdown, no explanation outside the JSON:
{{
  "should_follow_up": true or false,
  "recommended_wait_days": 0,
  "reasoning": "specific reason based on their situation",
  "recipient": "hiring manager or recruiter or generic",
  "subject_line": "...",
  "email_body": "..."
}}

Rules:
- If current_stage is 'interview' — always recommend following up with a thank you
- If current_stage is 'offer' — advise waiting until their stated deadline
- If days_since_applied < 5 — recommend waiting, too soon
- If company sounds like a large tech company (Google, Meta, Amazon, Microsoft, Apple) — advise against cold follow-up, explain why
- Email must be under 100 words
- Never open with "I just wanted to check in" — it is weak
- Never sound desperate
- subject_line and email_body must be empty strings if should_follow_up is false
- Be specific — reference the actual job title and company name in the email
"""

def build_extraction_prompt(description):
    return f"""
You are a job description parser. Extract structured information from the job description below.

JOB DESCRIPTION:
{description}

Respond ONLY with a raw JSON object. No markdown, no code blocks, no explanation. Just the JSON.

{{
  "title": "exact job title as written in the description",
  "company": "company name exactly as written",
  "location": "city, country or Remote or Hybrid — exactly as mentioned",
  "job_type": "Full-time or Part-time or Contract or Freelance or Internship",
  "salary_range": "salary exactly as written, or empty string if not mentioned",
  "source": "LinkedIn or Indeed or Rozee or Company Website or Unknown",
  "key_skills": ["skill1", "skill2", "skill3"],
  "experience_required": "concise requirement, max 5 words, e.g. '3+ years' or 'Senior level' or 'Entry-level'"
}}

Rules:
- Copy values directly from the text — do not rephrase or summarize
- If a field genuinely cannot be found, use empty string — never guess
- key_skills must be a list of specific technologies or skills mentioned (max 8)
- experience_required MUST be very concise (max 5 words). Focus on years or level only.
- For source: only use LinkedIn if the description mentions LinkedIn or description looks like a linkedin Post, otherwise use Unknown
- title and company are the most important — look carefully before giving up
"""
