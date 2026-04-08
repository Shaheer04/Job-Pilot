from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .services.health_score import calculate_stats, generate_advice
from .services.followup import generate_followup
from .services.extractor import extract_job_details
from jobs.models import JobApplication
from django.shortcuts import get_object_or_404


class HealthScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = calculate_stats(request.user)

        if stats is None:
            return Response(
                {
                    "message": "Track at least 5 applications to generate your health score."
                }
            )

        # stats are always returned — AI advice is a bonus on top
        advice = generate_advice(stats)

        return Response({"stats": stats, "advice": advice})


class FollowUpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # verfiy the job exists and belongs to this user
        job = get_object_or_404(JobApplication, pk=pk, user=request.user)

        result = generate_followup(job, request.user)

        return Response({"job_id": job.id, "followup": result})


class JobExtractionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        description = request.data.get('description', '')
        if not description:
            return Response({"error": "No description provided"}, status=400)  
        details = extract_job_details(description)
        return Response(details)


