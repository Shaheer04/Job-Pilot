from django.urls import path
from .views import (
    JobListCreateView,
    JobDetailView,
    JobStageUpdateView,
    NoteListCreateView,
)

urlpatterns = [
    # ─── Job Applications ─────────────────────────────────────────────
    # GET  /api/jobs/       → returns all jobs for the logged-in user
    # POST /api/jobs/       → creates a new job application
    path("", JobListCreateView.as_view(), name="job-list-create"),
    
    # GET    /api/jobs/<id>/  → returns full detail of a single job
    #                           includes nested stage_history and notes
    # PUT    /api/jobs/<id>/  → updates the entire job object
    # PATCH  /api/jobs/<id>/  → updates specific fields only
    # DELETE /api/jobs/<id>/  → permanently deletes the job
    path("<int:pk>/", JobDetailView.as_view(), name="job-detail"),
    
    # ─── Stage Management ─────────────────────────────────────────────
    # POST /api/jobs/<id>/stage/  → updates current_stage on the job
    #                               body: { "stage": "interview" }
    #                               valid values: applied, followed_up,
    #                               interview, offer, rejected, archived
    #                               automatically logs change to stage history
    path("<int:pk>/stage/", JobStageUpdateView.as_view(), name="job-stage-update"),
    
    # ─── Notes ────────────────────────────────────────────────────────
    # GET  /api/jobs/<id>/notes/  → returns all notes for that job
    # POST /api/jobs/<id>/notes/  → adds a new note to that job
    #                               body: { "content": "your note here" }
    path("<int:pk>/notes/", NoteListCreateView.as_view(), name="job-notes"),
]

