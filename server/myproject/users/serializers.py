from rest_framework import serializers
from django.db import transaction
from .models import Plan, User, Subscription
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
#outside model
from cores.models import Status
from threads.models import Thread, Reply, Image

#literally dto :P
class PLanSerializers(serializers.ModelSerializer):

    duration_days = serializers.SerializerMethodField()
    thread_duration_hours = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = [
            'id',
            'title','rank','features',
            'duration','duration_days',
            'monthly_price',
            'reply_limit',
            'thread_duration',
            'thread_duration_hours',
            'status',
            'created_at','updated_at',
        ]
        read_only_fields = ['created_at','updated_at']

    def get_duration_days(self, obj):
        return obj.duration.days if obj.duration else None

    def get_thread_duration_hours(self, obj):
        if obj.thread_duration:
            return round(obj.thread_duration.total_seconds() / 3600, 2)
        return None
class SubscriptionSerializers(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            'auto_renew',
            'start_at',
            'expire_at',
            'user',
            'plan',
            'status',
            'created_at'
        ]
        read_only_fields = ['created_at']
    def validate_user(self,value):
        if not value.status or value.status.status_name != 'active':
            raise  serializers.ValidationError("This user account is  not active.") 
        return value

class UserSerializers(serializers.ModelSerializer):
    class Meta:
            model = User
            fields = [
                'id', 'email','username','description', 'gender',
                'birth_date','current_point', 'password',
                'profile_image',
                'role',
                'status',
                'created_at','updated_at',
            ]   
            read_only_fields = ['created_at'] 

#login
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token
#register
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    class Meta:
        model = User
        fields = [
            'username', 'password','email'
        ]
    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.status = Status.objects.get(id=11)
        user.save()

        free_plan = Plan.objects.get(title='Free')
        active_status = Status.objects.get(id=8)
        Subscription.objects.create(
            user = user,
            plan = free_plan,
            status = active_status
        )

        return user



#data display for admins and moderator
#view admin
#0 image
class MiniImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            'id','file','alt_text','is_thumbnail','created_at','display_order'
        ]
        read_only_fields = ['created_at'] 
#1 thread
class MiniThreadSerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many = True, read_only = True)
    class Meta:
        model = Thread
        fields = [
            'id', 'title','context',
            'view_count','like_count',
            'status',
            'images',
            'created_at','updated_at'
        ]
        read_only_fields = ['created_at'] 
#2 reply
class MiniReplySerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many = True, read_only = True)
    class Meta:
        model = Reply
        fields = [
            'id', 'context',
            'parent_reply',
            'status','like_count',
            'images',
            'created_at'
        ]
class UserDataAdminSerializer(serializers.ModelSerializer):
    threads = MiniThreadSerializer(many = True, read_only = True)
    replies = MiniReplySerializer(many = True, read_only = True)
    class Meta:
        model = User
        fields = [
            'id', 'email','username',
            'description', 'gender',
            'birth_date','current_point',
            'profile_image',
            'role',
            'status',
            'threads','replies',
            'created_at','updated_at',
        ]
        read_only_fields = ['created_at'] 

class UserUpdateAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    class Meta:
        model = User
        fields = [
            'id', 'email','username', 'password',
            'description', 'gender',
            'birth_date','current_point',
            'profile_image',
            'role',
            'status',
            'threads','replies',
        ]
        read_only_fields = ['id'] 
        def update(self, instance, validated_data):
            password = validated_data.pop('password', None)
            instance = super().update(instance, validated_data)
            if password:
                instance.set_password(password)
                instance.save(update_fields=['password'])
            return instance


#Moderator
class UserDataModeratorSerializer(serializers.ModelSerializer):
    threads = MiniThreadSerializer(many = True, read_only = True)
    replies = MiniReplySerializer(many = True, read_only = True)
    class Meta:
        model = User
        fields = [
            'id', 'email','username',
            'description', 'gender',
            'birth_date','current_point',
            'profile_image',
            'role',
            'status',
            'threads','replies',
            'created_at','updated_at',
        ]
        read_only_fields = ['created_at'] 

class UserUpdateModeratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'status',
        ]
        read_only_fields = ['id'] 

#User
#view profile:
class UserProfileSerializer(serializers.ModelSerializer):
    threads = MiniThreadSerializer(many = True, read_only = True)
    class Meta:
        model = User
        fields = [
            'id','email','username',
            'description', 'gender',
            'birth_date','current_point',
            'profile_image',
            'threads',
            'created_at','updated_at',
        ]
        read_only_fields = ['created_at'] 

#view other user page:
class UserPublicDataSerializer(serializers.ModelSerializer):
    threads = MiniThreadSerializer(many = True, read_only = True)
    class Meta:
        model = User
        fields = [
            'id','email','username',
            'description','gender',
            'birth_date',
            'profile_image',
            'threads',
            'created_at',
        ]
        read_only_fields = ['created_at'] 

#update
class UserUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
            model = User
            fields = [
                'id','email','username',
                'description','gender',
                'birth_date',
            ]
            read_only_fields = ['id']

class UserUpdatePasswordSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    class Meta:
            model = User
            fields = [
                'id',
                'password',
            ]
            read_only_fields = ['id']
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save(update_fields=['password'])
        return instance

class UserUpdateImageSerializer(serializers.Serializer):
    profile_image = serializers.ImageField(required=True)