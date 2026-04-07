from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.contrib.auth.models import User
from jobs.models import JobApplication


class Command(BaseCommand):
    help = "Sends email reminders for applications that haven\'t been updated in 7 days"
    
    def handle(self, *args, **options):
        # 1 Calculate the "Stale" threshold
        threshold = timezone.now() - timedelta(days=7)
        
        # 2 Find jobs in 'applied' of 'followed_up' that are older than threshold
        stale_jobs = JobApplication.objects.filter(
            current_stage__in = ['applied', 'followed_up'],
            updated_at__lte = threshold
        )
        
        
        # 3 Group them by user so we don't spam multiple emails
        user_to_notify = User.objects.filter(JobApplication__in=stale_jobs).distinct()
        
        
        for users in user_to_notify:
            user_jobs = stale_jobs.filter(user=User)
            job_list = "\n".join([f" - {job.title} at {job.company}" for job in user_jobs])
            
            
        # Construct the email
        subject = f"Action Required: {user_jobs.count()} Stale Job Applications"
        body = f"Hi {User.username},\n\nThe following applications haven't been updated in over a week. It might be time to follow up!\n\n{job_list}\n\nGood luck!\n- JobPilot Team"
            
            
        
        # Send the email (Using Django's built-in send_mail)
        send_mail(
            subject,
            body,
            'sheeryjamal05@gmail.com',
            [User.email],
            fail_silently=False,
        )
        self.stdout.write(self.style.SUCCESS(f'Send Reminder to {User.email}'))