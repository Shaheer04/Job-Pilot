import logging
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .services.health_score import calculate_stats, generate_advice
from .services.followup import generate_followup
from .services.extractor import extract_job_details
from .throttles import SensitiveThrottle
from jobs.models import JobApplication
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

class HealthScoreView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SensitiveThrottle]

    def get(self, request):
        try:
            stats = calculate_stats(request.user)

            if stats is None:
                return Response(
                    {
                        "message": "Track at least 5 applications to generate your health score."
                    }
                )

            advice = generate_advice(stats)
            return Response({"stats": stats, "advice": advice})
        except Exception as e:
            logger.error(f"HealthScore generation failed for user {request.user.id}: {str(e)}")
            return Response({"error": "AI is currently resting. Please try again later."}, status=503)


class FollowUpView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SensitiveThrottle]

    def post(self, request, pk):
        job = get_object_or_404(JobApplication, pk=pk, user=request.user)
        try:
            result = generate_followup(job, request.user)
            if "error" in result:
                logger.warning(f"Followup service returned error for job {pk}: {result['error']}")
            return Response({"job_id": job.id, "followup": result})
        except Exception as e:
            logger.error(f"Followup generation failed for job {pk}: {str(e)}")
            return Response({"error": "AI coach is unavailable. Try again in a moment."}, status=503)


class JobExtractionView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SensitiveThrottle]
    
    def post(self, request):
        description = request.data.get('description', '')
        if not description:
            return Response({"error": "No description provided"}, status=400)
        
        # COST PROTECTION: Limit description size to 10k chars (~2.5k tokens)
        if len(description) > 10000:
            return Response({
                "error": "Description too long. Please provide a shorter snippet (max 10,000 characters)."
            }, status=400)

        try:
            details = extract_job_details(description)
            return Response(details)
        except Exception as e:
            logger.error(f"Job extraction failed: {str(e)}")
            return Response({"error": "AI extraction failed. Please enter details manually."}, status=503)


