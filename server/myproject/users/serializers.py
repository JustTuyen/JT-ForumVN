from rest_framework import serializers
from django.db import transaction
from .models import Plan, User, Subscription
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
#outside model
from cores.models import Status
from threads.models import Thread

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
    
#USER MANAGER
User = get_user_model()
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
        read_only_fields = ['created_at','updated_at']

    #Get outside information
class ThreadMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ['id','title','context','view_count','like_count',
                  'created_at','updated_at']
    #Get user including outside data
class DetailsUserSerializers(serializers.ModelSerializer):
    threads  = ThreadMiniSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'id', 'email','username','description', 'gender', 
            'birth_date','current_point','password',
            'profile_image',
            'role', 'threads',
            'status', 
            'created_at','updated_at',
        ]    
        read_only_fields = ['created_at','updated_at']

    #Login and register
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token


class RegisterSerializers(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    class Meta:
        model = User
        fields = ['username','email','password']
    @transaction.atomic
    def create(self, validate_data):
    #harsher           
        password = validate_data.pop('password')
        user = User(**validate_data)
        user.set_password(password)

        #for auto subscripted
        user.status = Status.objects.get(status_name='Active')
        user.save()

        free_plan = Plan.objects.get(title='Free')  # adjust lookup to whatever uniquely identifies the free plan
        active_status = Status.objects.get(id=8)
        #auto subscripted
        Subscription.objects.create(
            user = user,
            plan = free_plan,
            status = active_status
        )
        return user

    #Admin serializers
class AdminUserSerializers(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True, 
        required=False, 
        validators=[validate_password]
    )
    class Meta:
        model = User
        fields = [
            'id','username','email','gender','birth_date','profile_image',
            'created_at','updated_at','password'
        ]
        read_only_fields = ['created_at','updated_at',]

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save(update_fields=['password'])
        return instance
        

    #Moderator serializers
class ModeratorUserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=False, 
        validators=[validate_password]
    )
    class Meta:
            model = User
            fields = [
                'id',
                'username','email','gender','birth_date','profile_image',
                'created_at','updated_at','password'
            ]
            read_only_fields = ['created_at','updated_at',]
            
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save(update_fields=['password'])
        return instance
    #get user's information including threads
class ThreadMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ['id','title','context','view_count','like_count',
        'created_at','updated_at']
class ProfileUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username','gender','birth_date','profile_image',
            'created_at','updated_at','role',
        ]
        read_only_fields = ['created_at','updated_at',]

#Admin
class SubscriptionMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            'plan','auto_renew',
            'status',
            'created_at'
        ]

class UserManagerSerializers(serializers.ModelSerializer):
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
            read_only_fields = ['created_at','updated_at']

#updating
class UpdateUserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])

    class Meta:
        model = User
        fields = [
            'id',
            'username', 'email', 'birth_date', 'gender',
            'password', 'profile_image','description',
        ]
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save(update_fields=['password'])
        return instance

class UpdateUserPassword(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    class Meta:
        model = User
        fields = ['id', 'password']
        read_only_fields = ['id']
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save(update_fields=['password'])
        return instance


#profile handler
class UploadProfileImageUserSerializer(serializers.Serializer):
    file = serializers.ImageField()