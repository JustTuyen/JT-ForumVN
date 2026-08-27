from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from threads.models import Thread, Reply
from cores.models import Status
# from django.db.models import Check

# Create your models here.
#6 Bookmark
class Bookmark(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='bookmarks', 
        null=False, 
        blank=False)

    thread = models.ForeignKey(
        Thread,
        on_delete=models.PROTECT,
        related_name='bookmarks', 
        null=False, 
        blank=False)
    
    note = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
       constraints = [
            models.UniqueConstraint(
                fields=["user", "thread"],
                name="unique_user_thread_bookmark",
            )
        ]
       indexes = [
            models.Index(fields=['user','thread','-created_at'],
                            name='idx_mark_user_thread_create'),
        ]
       ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} bookmarked {self.thread}"


#8 Report
class Report(models.Model):
    violation_type = models.CharField(max_length=500, blank=False)
    reason = models.TextField(max_length=2000,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    point_punishment = models.IntegerField(default=0)

    #who report
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='reports', 
        null=True, 
        blank=True) 
    
    #target id: thread, reply or user
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey('content_type', 'object_id')

    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        related_name='reports',
        null=False,
        blank=False)
    class Meta:
        indexes = [
            models.Index(fields=['user','status','-created_at'],
                name='idx_re_user_status_create'),
            models.Index(fields=['content_type', 'object_id','-created_at'],
                name='idx_re_type_object_create')
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} report {self.target}"


class Like(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='likes', 
        null=False, 
        blank=False)

    thread = models.ForeignKey(
        Thread,
        on_delete=models.PROTECT,
        related_name='likes', 
        null=True, 
        blank=True)

    reply = models.ForeignKey(
        Reply,
        on_delete=models.PROTECT,
        related_name='likes', 
        null=True, 
        blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "thread"],
                name="unique_user_thread_like",
                condition=models.Q(thread__isnull=False)
            ),
            models.UniqueConstraint(
                fields=["user", "reply"],
                name="unique_user_reply_like",
                condition=models.Q(thread__isnull=False)
            ),

            models.CheckConstraint(
                condition=(
                    (models.Q(thread__isnull=False) & models.Q(reply__isnull=True)) |
                    (models.Q(thread__isnull=True) & models.Q(reply__isnull=False))
                ),
                name="like_must_target_thread_or_reply"
            )
        ]
        indexes = [
            models.Index(fields=['user','reply','-created_at'],
                name='idx_like_user_reply_create'),
            models.Index(fields=['user','thread','-created_at'],
                            name='idx_like_user_thread_create'),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} like {self.thread}"