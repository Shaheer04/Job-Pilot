from django.urls import path
from .views import HealthScoreView

urlpatterns = [path("health-score/", HealthScoreView.as_view(), name="health-score")]