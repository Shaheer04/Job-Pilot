from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    UpdateAPIView,
)
from rest_framework import filters
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from .models import JobApplication, Note, ApplicationStage
from .serializers import (
    JobApplicationSerializer,
    JobApplicationCreateSerializer,
    NoteSerializer,
)


# ─── View 1: List all jobs + Create a new job ─────────────────────────────────
# GET  /api/jobs/   → returns all jobs belonging to the logged-in user
# POST /api/jobs/   → creates a new job application


class JobListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "company", "location", "description", "source", "experience_required"]
    ordering_fields = ["created_at", "applied_date", "title", "company"]
    ordering = ["-created_at"]  # Default to newest first

    def get_serializer_class(self):
        # Use the simple create serializer for POST requests
        # Use the full serializer (with nested notes + history) for GET
        if self.request.method == "POST":
            return JobApplicationCreateSerializer
        return JobApplicationSerializer

    def get_queryset(self):
        # SECURITY: users only ever see their own jobs
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, seralizer):
        # Save the job and attach the current user automatically
        # The frontend never sends the user — we set it here server-side

        job = seralizer.save(user=self.request.user)
        # Log the first stage in the history table automatically
        # Every job starts at 'applied' so we record that moment

        ApplicationStage.objects.create(job=job, stage="applied")


# ─── View 2: Get, Update, Delete a single job ─────────────────────────────────
# GET    /api/jobs/<id>/   → returns full detail of one job
# PUT    /api/jobs/<id>/   → updates the entire job
# PATCH  /api/jobs/<id>/   → updates specific fields only
# DELETE /api/jobs/<id>/   → deletes the job


class JobDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # SECURITY: even for a single job lookup, we filter by user
        # This means if user A knows user B's job ID,
        # they still get a 404 — not a 403, which would confirm the job exists
        return JobApplication.objects.filter(user=self.request.user)


# ─── View 3: Update stage + log it to history ─────────────────────────────────
# POST /api/jobs/<id>/stage/   → body: { "stage": "interview" }
# This is a custom view because the logic is specific:
# update current_stage AND create a history record in one action


class JobStageUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Fetch the job — 404 if it doesn't exist or doesn't belong to this user
        job = get_object_or_404(JobApplication, pk=pk, user=request.user)

        # Get the new stage from the request body
        new_stage = request.data.get("stage")

        # validate that the stage value is one of our allowed choices
        valid_stages = [
            choice[0]
            for choice in JobApplication._meta.get_field("current_stage").choices
        ]

        if new_stage not in valid_stages:
            return Response(
                {"error ": f"Invalid stage. Must be one of : {valid_stages}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update the stage on the job
        job.current_stage = new_stage
        job.save()

        # Log this stage change to history with an automatic timestamp
        ApplicationStage.objects.create(job=job, stage=new_stage)

        # return the updated job using the full serialzer
        serialzer = JobApplicationSerializer(job)
        return Response(serialzer.data, status=status.HTTP_200_OK)


# ─── View 4: List notes + Add a note to a job ─────────────────────────────────
# GET  /api/jobs/<id>/notes/   → returns all notes for that job
# POST /api/jobs/<id>/notes/   → adds a new note to that job


class NoteListCreateView(ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter notes by the job ID in the url (pk)
        # AND make sure that job belongs to the current user
        # job__ user means "follow the ForiegnKey from Note ---> Job, then check user "

        return Note.objects.filter(
            job_id=self.kwargs["pk"], job__user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, seralizer):
        # fetch job first t verify ownership

        job = get_object_or_404(
            JobApplication, pk=self.kwargs["pk"], user=self.request.user
        )

        # Attach the job automatically = frontend only sends content

        seralizer.save(job=job)
