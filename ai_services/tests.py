from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from jobs.models import JobApplication
from unittest.mock import patch

class AIServicesTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        
        # Create some jobs for health score (at least 5 needed)
        for i in range(6):
            JobApplication.objects.create(
                user=self.user,
                title=f'Job {i}',
                company=f'Company {i}',
                current_stage='applied'
            )
        
        self.health_score_url = reverse('health-score')
        self.extract_url = reverse('job-extraction')
        self.followup_url = reverse('followup', kwargs={'pk': JobApplication.objects.filter(user=self.user).first().id})

    @patch('ai_services.views.calculate_stats')
    @patch('ai_services.views.generate_advice')
    def test_health_score_view(self, mock_advice, mock_stats):
        mock_stats.return_value = {'total': 6, 'interview_rate': 0}
        mock_advice.return_value = {'summary': 'Good start'}
        
        response = self.client.get(self.health_score_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('stats', response.data)
        self.assertIn('advice', response.data)

    @patch('ai_services.views.extract_job_details')
    def test_job_extraction_view(self, mock_extract):
        mock_extract.return_value = {'title': 'AI Engineer', 'company': 'OpenAI'}
        data = {'description': 'Valid job description'}
        
        response = self.client.post(self.extract_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'AI Engineer')

    def test_job_extraction_validation(self):
        # Test character limit
        long_description = 'a' * 10001
        response = self.client.post(self.extract_url, {'description': long_description})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Description too long', response.data['error'])

    @patch('ai_services.views.generate_followup')
    def test_followup_view(self, mock_followup):
        mock_followup.return_value = {'should_follow_up': True, 'email_body': 'Hello...'}
        
        response = self.client.post(self.followup_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['followup']['should_follow_up'], True)

    def test_rate_limiting_sensitive(self):
        # Verify that SensitiveThrottle is applied to the HealthScoreView
        from ai_services.views import HealthScoreView
        from ai_services.throttles import SensitiveThrottle
        
        self.assertIn(SensitiveThrottle, HealthScoreView.throttle_classes)
