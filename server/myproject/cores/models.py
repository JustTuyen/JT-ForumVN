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
class Activity_Log(models.Model):
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    action = models.CharField(max_length=50, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='activity_logs', 
        null=True, 
        blank=True)

    #target id: thread, reply or user
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey('content_type', 'object_id')

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

