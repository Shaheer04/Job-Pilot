from django.urls import path
from .views import HealthScoreView, FollowUpView

urlpatterns = [
    path("health-score/", HealthScoreView.as_view(), name="health-score"),
    path("followup/<int:pk>/", FollowUpView.as_view(), name="followup")
    ]


