from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .services.health_score import calculate_stats,generate_advice

class HealthScoreView(APIView):
    permission_classes = [IsAuthenticated]
    
    
    def get(self, request):
        stats = calculate_stats(request.user)
        
        if stats is None:
            return Response({
                'message' : 'Track at least 5 applications to generate your health score.'
            })
            
        # stats are always returned — AI advice is a bonus on top
        advice = generate_advice(stats)
            
        return Response({
            'stats' : stats,
            'advice' : advice
            })
    
    