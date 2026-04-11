from rest_framework import serializers
from datetime import date
from .models import JobApplication, Note, ApplicationStage


class NoteSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Note
        fields = ['id', 'content', 'created_at']
        read_only_fields = ['id','created_at']
        
       
class StageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationStage
        fields = ['id', 'stage', 'moved_at'] 
        read_only_fields = ["id", "stage", "moved_at"]

class JobApplicationSerializer(serializers.ModelSerializer):
    stage_history = StageHistorySerializer(many=True, read_only=True)
    notes         = NoteSerializer(many=True, read_only=True)
    days_since_applied = serializers.SerializerMethodField()
    
    
    class Meta:
        model = JobApplication
        fields = [
            "id",
            "title",
            "company",
            "location",
            "description",
            "source",
            "job_type",
            "salary_range",
            "key_skills",
            "experience_required",
            "current_stage",
            "ghost_score",
            "ghost_reasoning",
            "applied_date",
            "created_at",
            "updated_at",
            "days_since_applied",
            "stage_history",
            "notes",
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'ghost_score', 'ghost_reasoning', 'current_stage']
    
    
    def get_days_since_applied(self, obj):
        return (date.today() - obj.applied_date).days
        
    def validate_current_stage(self, value):
        valid = [c[0] for c in JobApplication.STAGE_CHOICES]   
        if value not in valid:
            raise serializers.ValidationError(
                f"Invalid Stage. Choose from {valid}."
            )
        return value
    
    
class JobApplicationCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = JobApplication
        fields = [
            'id',
            'title',
            'company',
            'location',
            'description',
            'source',
            'job_type',
            'salary_range',
            'key_skills',
            'experience_required',
            'applied_date'
        ]
        read_only_fields = ['id']

    def validate_applied_date(self, value):
        if value > date.today():
            raise serializers.ValidationError(
                "Applied date can't be in future."
            )
        return value
