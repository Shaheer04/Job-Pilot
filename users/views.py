from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer


# ─── View 1: Register ────────────────────────────────────────────────
# Handles POST /api/auth/register/
# Public endpoint — anyone can reach it without being logged in


class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    # That's it. CreateAPIView handles everything:
    # 1. receives POST request
    # 2. passes data to RegisterSerializer
    # 3. runs validate() — checks passwor        # instead of looking up a user by ID in the URL,
    # we always return the user who is currently logged in
    # DRF extracts this from the JWT token automaticallyds match, email not taken
    # 4. runs create() — saves user with hashed password
    # 5. returns 201 Created


# ─── View 2: User Profile ────────────────────────────────────────────
# Handles GET    /api/auth/profile/  → returns logged in user's info
# Handles PUT    /api/auth/profile/  → updates logged in user's info
# Handles DELETE /api/auth/profile/  → deletes logged in user's account
# Protected — user must send a valid JWT token to reach this


class UserProfileView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # instead of looking up a user by ID in the URL,
        # we always return the user who is currently logged in
        # DRF extracts this from the JWT token automatically
        return self.request.user
