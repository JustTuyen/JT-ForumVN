from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from cores.models import Status

# Create your models here.

#5 Category
class Category(models.Model):
    title = models.CharField(max_length=255, blank=False)
    description = models.TextField(max_length=2000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    status = models.ForeignKey(
        Status, 
        on_delete=models.PROTECT, 
        related_name='categories', 
        null=True, 
        blank=True)
    class Meta:
        indexes = [
            models.Index(fields=['title','-created_at'],
                         name='idx_category_title_create'),
        ]
        ordering = ['-created_at']

    def __str__(self):       
        return self.title

#6 Thread
# thread sorting with view count and like count is not very otpzimed, view and like changed to often can discrute the indexing, not recomemend
class Thread(models.Model):
    name = models.CharField(max_length=225, blank=False)
    title = models.CharField(max_length=500, blank=False)
    context = models.TextField(max_length=2000,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    point_reward = models.IntegerField(default=10)
    expire_at = models.DateTimeField(editable=False)
    reply_limit = models.PositiveIntegerField(default=0) 

    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT, 
        related_name='threads', 
        null=True, 
        blank=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='threads', 
        null=False, 
        blank=False)

    status = models.ForeignKey(
        Status, 
        on_delete=models.PROTECT, 
        related_name='threads', 
        null=True, 
        blank=True)
    class Meta:
        indexes = [
            #global 
            models.Index(
            fields=['status', '-created_at'], name='idx_thread_status_created'),

            #filter categories
            models.Index(fields=['category', '-updated_at'], name='idx_thread_cat_created'),
            models.Index(fields=['category', '-updated_at'], name='idx_thread_cat_updated'),
            #partial indexing
            models.Index(fields=['category', '-view_count'], name='idx_thread_cat_views', condition=Q(view_count__gte=100)),
            models.Index(fields=['category', '-like_count'], name='idx_thread_cat_likes', condition=Q(like_count__gte=100)),

            #user
            models.Index(fields=['user','-created_at'], name='idx_thread_user_created_at'),
        ]
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if self._state.adding:
            subscription = (
                self.user.subscriptions
                .filter(
                    status__status_name="active",
                    expire_at__gt=timezone.now(),
                )
                .select_related("plan")
                .order_by("-created_at")
                .first()
            )

            if subscription and subscription.plan:
                self.expire_at = timezone.now() + subscription.plan.thread_duration
                self.reply_limit = subscription.plan.reply_limit
            else:
                self.expire_at = timezone.now() + timedelta(hours=24)
                self.reply_limit = 200
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

#5 reply
class Reply(models.Model):
    name = models.CharField(max_length=225, blank=False)
    context = models.TextField(max_length=2000,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    like_count = models.PositiveIntegerField(default=0)
    point_reward = models.IntegerField(default=5)

    #when reply on a reply
    parent_reply = models.ForeignKey(
        #replying to another reply within the thread
        'self',
        on_delete=models.PROTECT,
        related_name='replies',
        null=True,
        blank=True
    )

    thread = models.ForeignKey(
        Thread, 
        on_delete=models.PROTECT, 
        related_name='replies', 
        null=False, 
        blank=False)
    
    status = models.ForeignKey(
        Status, 
        on_delete=models.PROTECT, 
        related_name='replies', 
        null=False, 
        blank=False)
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='replies', 
        null=False, 
        blank=False)

    class Meta:
        indexes = [
            models.Index(fields=['user','thread','-created_at'],
                            name='idx_user_thread_create'),
        ]
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.name}"

#7 image
class Image(models.Model):
    file = models.ImageField(upload_to='images/%Y/%m/%d/')
    thread = models.ForeignKey(
        Thread, 
        on_delete=models.CASCADE, 
        related_name='images', 
        null=True, 
        blank=True)
    reply = models.ForeignKey(
        Reply, 
        on_delete=models.CASCADE, 
        related_name='images', 
        null=True, 
        blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_thumbnail = models.BooleanField(default=False)
    upload_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='images', 
        null=False, 
        blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['display_order']
        constraints = [
            # only one image can be the thumbnail
            models.UniqueConstraint(
                fields=['thread'],
                condition=models.Q(is_thumbnail=True),
                name='unique_thumbnail_per_thread'
            ),
        ]
        indexes = [
            models.Index(fields=['thread', 'display_order'], name='idx_image_thread_order'),
            models.Index(fields=['reply', 'display_order'], name='idx_image_reply_order'),
        ]
