from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import JobApplication, ApplicationStage, Note

class JobTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.other_user = User.objects.create_user(username='otheruser', password='password123')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        
        self.job = JobApplication.objects.create(
            user=self.user,
            title='Software Engineer',
            company='Google',
            location='Mountain View',
            current_stage='applied'
        )
        self.job_list_url = reverse('job-list-create')
        self.job_detail_url = reverse('job-detail', kwargs={'pk': self.job.id})
        self.job_stage_url = reverse('job-stage-update', kwargs={'pk': self.job.id})
        self.job_notes_url = reverse('job-notes', kwargs={'pk': self.job.id})

    def test_create_job_application(self):
        data = {
            'title': 'Frontend Developer',
            'company': 'Meta',
            'location': 'Remote'
        }
        response = self.client.post(self.job_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.filter(user=self.user).count(), 2)
        # Check if stage history was created automatically
        job = JobApplication.objects.get(title='Frontend Developer')
        self.assertTrue(ApplicationStage.objects.filter(job=job, stage='applied').exists())

    def test_list_jobs_for_authenticated_user(self):
        response = self.client.get(self.job_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Software Engineer')

    def test_search_jobs(self):
        JobApplication.objects.create(user=self.user, title='Data Scientist', company='Amazon')
        # Search by company
        response = self.client.get(self.job_list_url + '?search=Amazon')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company'], 'Amazon')
        
        # Search by title
        response = self.client.get(self.job_list_url + '?search=Software')
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Software Engineer')

    def test_update_job_stage(self):
        data = {'stage': 'interview'}
        response = self.client.post(self.job_stage_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job.refresh_from_db()
        self.assertEqual(self.job.current_stage, 'interview')
        # Check history
        self.assertTrue(ApplicationStage.objects.filter(job=self.job, stage='interview').exists())

    def test_update_job_stage_invalid(self):
        data = {'stage': 'invalid_stage'}
        response = self.client.post(self.job_stage_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_note_to_job(self):
        data = {'content': 'Spoke with recruiter today'}
        response = self.client.post(self.job_notes_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Note.objects.filter(job=self.job).count(), 1)

    def test_security_user_cannot_access_other_user_job(self):
        # Create job for other user
        other_job = JobApplication.objects.create(user=self.other_user, title='Hacker', company='DarkWeb')
        url = reverse('job-detail', kwargs={'pk': other_job.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_job(self):
        response = self.client.delete(self.job_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(JobApplication.objects.filter(id=self.job.id).count(), 0)
