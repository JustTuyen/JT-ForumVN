from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
# Create your models here.

#1 status
class Status(models.Model):
    status_type = models.CharField(max_length=100, blank=False)
    status_name = models.CharField(max_length=100, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['status_type', 'status_name',],
                name='unique_status_type_name'
            )
        ]
        ordering = ['status_type', 'status_name']

    def __str__(self):
        return f"{self.status_type}: {self.status_name}"




#9 user log
def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')

class Activity_Log(models.Model):

    class ActionType(models.TextChoices):
        CREATE_THREAD = 'create_thread', 'Created Thread'
        UPDATE_THREAD = 'update_thread', 'Updated Thread'
        DELETE_THREAD = 'delete_thread', 'Deleted Thread'
        ARCHIVE_THREAD = 'archive_thread', 'Archived Thread'
        SOFT_DELETE_THREAD = 'soft_delete_thread', 'Soft Delete Thread'
        LIKE_THREAD = 'like_thread', 'Liked Thread'
        UNLIKE_THREAD = 'unlike_thread', 'Unlike Thread'
        #
        BOOKMARK_THREAD = 'bookmark_thread', 'Bookmarked Thread'
        UNBOOKMARK_THREAD = 'unbookmark_thread', 'Unbookmarked Thread'
        #
        CREATE_REPLY = 'create_reply', 'Created Reply'
        UPDATE_REPLY = 'update_reply', 'Updated Reply'
        DELETE_REPLY = 'delete_reply', 'Deleted Reply'
        LIKE_REPLY = 'like_reply', 'Liked Reply'
        UNLIKE_REPLY = 'unlike_reply', 'Unlike Reply'
        SOFT_DELETE_REPLY = 'soft_delete_reply', 'Soft Delete Reply'
        #
        CREATE_REPORT = 'create_report', 'Created Report'
        UPDATE_REPORT = 'update_report', 'Updated Report'
        DELETE_REPORT = 'delete_report', 'Deleted Report'
        # VIEW_USER = 'view_user', 'View User'

    ip_address = models.GenericIPAddressField(blank=True, null=True)
    action = models.CharField( choices = ActionType.choices , blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='activity_logs', 
        null=True, 
        blank=True)

    #target id: thread, reply or user
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE,null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey('content_type', 'object_id')
    metadata = models.JSONField(default=dict, blank=True)
    class Meta:
        indexes = [
            models.Index(fields=['user', '-created_at'], 
                         name='idx_logs_user_create'),
            models.Index(fields=['content_type', 'object_id', '-created_at'], 
                         name='idx_logs_target_create'),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.action}"

def log_activity(request, action, target = None, metadata = None):
    if not request.user.is_authenticated:
        return
    Activity_Log.objects.create(
        user = request.user,
        action = action,
        content_type = ContentType.objects.get_for_model(target) if target else None,
        object_id=target.pk if target else None,
        ip_address= get_client_ip(request),
        metadata = metadata or {}
    )
