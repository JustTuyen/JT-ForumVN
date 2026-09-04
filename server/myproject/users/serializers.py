from rest_framework import serializers
from django.db import transaction
from .models import Plan, User, Subscription
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
#outside model
from cores.models import Status
from threads.models import Thread, Reply, Image
from moderators.models import Bookmark
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
    
    def validate_status(self, value):
        if value.status_type != 'Plan':
            raise serializers.ValidationError("This status is not valid for plans.")
        return value
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
        if not value.status or value.status.status_name != 'Active':
            raise  serializers.ValidationError("This user account is  not active.") 
        return value

    def validate_plan(self, value):
        if not value.status or value.status.status_name != 'Active':
            raise serializers.ValidationError("This subscription plan is not currently available or active.")
        return value

    def validate_status(self, value):
        if value.status_type != 'Subscription':
            raise serializers.ValidationError("This status is not valid for subscriptions.")
        return value
class UserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
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
    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.status = Status.objects.get(id=1)
        user.set_password(password)
        user.save()

        free_plan = Plan.objects.get(id=1)
        active_status = Status.objects.get(id=11)
        Subscription.objects.create(
            user = user,
            plan = free_plan,
            status = active_status
        )
        return user

    def update(self, instance, validated_data):
        # 1. Pop password if present in request data
        password = validated_data.pop('password', None)

        # 2. Update remaining normal fields (username, email, etc.)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # 3. Hash and set password only if a new password was provided
        if password:
            instance.set_password(password)

        instance.save()
        return instance
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
        user.status = Status.objects.get(id=1)
        user.set_password(password)
        user.save()

        free_plan = Plan.objects.get(id=1)
        active_status = Status.objects.get(id=11)
        Subscription.objects.create(
            user = user,
            plan = free_plan,
            status = active_status
        )

        return user

    def validate_status(self, value):
        if value.status_type != 'User':
            raise serializers.ValidationError("This status is not valid for users.")
        return value

#data display for admins and moderator
#view admin
#0 image
class MiniImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            'id','file','alt_text','is_thumbnail','display_order'
        ]
        read_only_fields = ['id'] 
#1 thread
class MiniReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = [
            'id',
        ]
        read_only_fields = ['id']

class MiniThreadSerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many = True, read_only = True)
    status_name = serializers.ReadOnlyField(source='status.status_name')
    replies = MiniReplySerializer(many=True, read_only = True)

    class Meta:
        model = Thread
        fields = [
            'id', 'title','context',
            'status','status_name',
            'replies',
            'images',
            'created_at','updated_at'
        ]
        read_only_fields = ['created_at'] 
#2 reply

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
            'threads', 'role',
            'created_at','updated_at',
        ]
        read_only_fields = ['created_at'] 

#view other user page:
class UserPublicDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id','email','username',
            'description','gender',
            'birth_date',
            'profile_image',
            'role',
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

    def validate_user(self,value):
        if not value.status or value.status.status_name != 'Active':
            raise  serializers.ValidationError("This user account is  not active.") 
        return value

class UserUpdatePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    class Meta:
            model = User
            fields = [
                'old_password',
                'password',
            ]
            
    def validate_old_password(self, value):
        user = self.instance
        if user and not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
    
    def validate(self, attrs):
        user = self.instance
        if user and (not user.status or user.status.status_name != 'Active'):
            raise serializers.ValidationError("This account is not active.")

        if attrs.get('old_password') == attrs.get('password'):
            raise serializers.ValidationError({"password": "New password cannot be identical to current password."})
        
        return attrs
    
    def update(self, instance, validated_data):
        validated_data.pop('old_password', None)
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save(update_fields=['password'])
        return instance

class UserUpdateImageSerializer(serializers.Serializer):
    profile_image = serializers.ImageField(required=True)
    def validate_user(self,value):
        if not value.status or value.status.status_name != 'Active':
            raise  serializers.ValidationError("This user account is  not active.") 
        return value

class UserBookmarkSerializer(serializers.Serializer):
    images = MiniImageSerializer(read_only=True, many=True)
    threads = MiniThreadSerializer(read_only=True, many=True)
    class Meta:
        model = Bookmark
        fields = [
            'id', 'threads','note','created_at','updated_at'
        ]
        read_only_fields = ['id']

    