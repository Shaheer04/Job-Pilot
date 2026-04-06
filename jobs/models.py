from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create your models here.
class JobApplication (models.Model):
    
    STAGE_CHOICES = [
        ("applied", "Applied"),
        ("followed_up", "Followed Up"),
        ("interview", "Interview Scheduled"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("archived", "Archived"),
    ]
    
    def __str__(self):
        return f"{self.title} at {self.company}"
        
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    title = models.CharField(max_length=225)
    company = models.CharField(max_length=225)
    location = models.CharField(max_length=225)
    description = models.TextField(blank=True)
    source = models.CharField(max_length=100, blank=True)
    job_type = models.CharField(max_length=100, blank=True)
    salary_range = models.CharField(max_length=100, blank=True)
    current_stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default='applied')
    ghost_score = models.CharField(max_length=10, blank=True, null=True)
    ghost_reasoning = models.TextField(blank=True, null=True)
    applied_date = models.DateField(default=date.today)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
class ApplicationStage(models.Model):
    job = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='stage_history')
    stage = models.CharField(max_length=50)
    moved_at = models.DateTimeField(auto_now_add=True)
    
    
class Note(models.Model):
    job = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name='notes')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)