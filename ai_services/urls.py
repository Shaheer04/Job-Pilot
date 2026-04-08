from django.urls import path
from .views import HealthScoreView, FollowUpView, JobExtractionView

urlpatterns = [
    path("health-score/", HealthScoreView.as_view(), name="health-score"),
    path("followup/<int:pk>/", FollowUpView.as_view(), name="followup"),
    path("extract/", JobExtractionView.as_view(), name="job-extraction")
    ]


