from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
# Create your models here.

# thread has indexing for view and like is not very otpmized, considering view and like are constantly changing.


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

    #checking the duration of subscription
    def save(self, *args, **kwargs):
        if self._state.adding:
            duration = self.plan.duration if self.plan else timedelta(days=30)
            self.expire_at = timezone.now() + duration
        super().save(*args, **kwargs)

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
                        name='idx_subscription_user_plan_created'),
        ] 
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} ({self.plan})"

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
class Thread(models.Model):
    name = models.CharField(max_length=225, blank=False)
    title = models.CharField(max_length=500, blank=False)
    context = models.TextField(max_length=2000,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    view_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    point_reward = models.IntegerField(default=10)
    #duration = models.DurationField(default=timedelta(hours=24))
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
            models.Index(
            fields=['status', 'category', '-created_at'],
                    name='idx_thread_status_cat_created'),
            # models.Index(
            #     fields=['status', 'category', '-view_count'],
            #     name='idx_thread_status_cat_views',),
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
    
    note = models.TextField(max_length=500, blank=True)
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
                            name='idx_bookmark_user_thread_create'),
        ],
       ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} bookmarked {self.thread}"

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
                            name='idx_report_user_status_create'),
            models.Index(fields=['content_type', 'object_id','-created_at'],
                        name='idx_report_user_type_object_create')
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} report {self.target}"

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

