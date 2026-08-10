
from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from cores.models import Status
# Create your models here.

#2 users
class User(AbstractUser):
    # username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    # password = models.CharField(max_length=128)
    description = models.TextField(max_length=1000, blank=True)
    gender = models.CharField(max_length=50, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    current_point = models.IntegerField(default=10)
    #profile
    profile_image = models.ForeignKey(
        'Image', on_delete=models.SET_NULL, null=True, blank=True, related_name='+'
    )
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        MODERATOR = 'moderator', 'Moderator'
        USER = 'user', 'User'
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)

    status = models.ForeignKey(
        Status, 
        on_delete=models.PROTECT, 
        related_name='users', 
        null=True, 
        blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['role', '-created_at'], 
                         name='idx_user_role_created'),
        ] 

        ordering = ['-created_at']

    def __str__(self):
        return f"{self.username} ({self.role})"

#3 Plan
class Plan(models.Model):
    title = models.CharField(max_length=255, unique=True)
    rank = models.PositiveIntegerField(unique=True)
    features = models.TextField(max_length=2000, blank=False)
    duration = models.DurationField(default=timedelta(days=30))
    monthly_price = models.DecimalField(max_digits=8, decimal_places=2, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    reply_limit = models.PositiveIntegerField()
    thread_duration = models.DurationField()
    status = models.ForeignKey(
        Status, 
        on_delete=models.PROTECT, 
        related_name='plans', 
        null=True, 
        blank=True)
    class Meta:
        indexes = [
            models.Index(fields=['status', '-created_at'], name='idx_plan_status_created'),
        ]
        ordering = ['rank']

    def __str__(self):
        return f"{self.title} ({self.duration}) ({self.reply_limit})"
    
#4 subscription
class Subscription(models.Model):
    auto_renew = models.BooleanField(default=False)
    start_at = models.DateTimeField(auto_now_add=True)
    expire_at = models.DateTimeField(editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    #defines model's custom save() method.
    def save(self, *args, **kwargs):
        if self._state.adding:
            duration = self.plan.duration if self.plan else timedelta(days=30)
            self.expire_at = timezone.now() + duration
        super().save(*args, **kwargs)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='subscriptions', 
        null=True, 
        blank=True)

    plan = models.ForeignKey(
        Plan, 
        on_delete=models.PROTECT, 
        related_name='subscriptions', 
        null=True, 
        blank=True)
    
    status = models.ForeignKey(
        Status, 
        on_delete=models.PROTECT, 
        related_name='subscriptions', 
        null=True, 
        blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user','plan','-created_at'], 
                        name='idx_sub_user_plan_created'),
        ] 
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} ({self.plan})"


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

