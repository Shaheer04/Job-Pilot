from django.contrib import admin
from .models import JobApplication, ApplicationStage, Note

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    # Display high-level metadata only — no private content in the list view
    list_display = ('id', 'user', 'company', 'title', 'current_stage', 'applied_date')
    list_filter = ('current_stage', 'applied_date')
    
    # Prevent searching through private descriptions/notes
    search_fields = ('company', 'title', 'user__username')
    
    # Blind sensitive content in the detail view
    # We exclude private text fields so even an admin can't read them
    exclude = ('description', 'ghost_reasoning', 'key_skills', 'salary_range')
    readonly_fields = ('user', 'applied_date', 'created_at', 'updated_at')

@admin.register(ApplicationStage)
class ApplicationStageAdmin(admin.ModelAdmin):
    list_display = ('job', 'stage', 'moved_at')
    list_filter = ('stage', 'moved_at')
    readonly_fields = ('job', 'stage', 'moved_at')

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('job', 'created_at', 'content_status')
    
    # Prevent searching inside private notes
    search_fields = ('job__company', 'job__title')
    
    # Hide the actual content from the detail view
    exclude = ('content',)
    readonly_fields = ('job', 'created_at')

    def content_status(self, obj):
        return "******** [PRIVATE USER NOTE — MASKED] ********"
    content_status.short_description = "Content Status"
