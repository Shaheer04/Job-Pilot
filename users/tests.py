from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.profile_url = reverse('profile')
        self.login_url = reverse('login')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123',
            'password2': 'testpassword123'
        }
        self.user = User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            password='existingpassword123'
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.api_authentication()

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.get(username='testuser').email, 'test@example.com')

    def test_user_registration_password_mismatch(self):
        data = self.user_data.copy()
        data['password2'] = 'mismatch'
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_profile(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'existinguser')
        self.assertEqual(response.data['email'], 'existing@example.com')

    def test_update_user_profile(self):
        data = {'username': 'updateduser', 'email': 'updated@example.com'}
        response = self.client.put(self.profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'updateduser')
        self.assertEqual(self.user.email, 'updated@example.com')

    def test_delete_user_account(self):
        response = self.client.delete(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.filter(username='existinguser').count(), 0)

    def test_profile_access_without_auth(self):
        self.client.credentials() # Clear credentials
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
