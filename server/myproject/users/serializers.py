from rest_framework import serializers
from .models import Plan, User, Subscription
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

#outside model
from threads.models import Thread


#view here
class PLanSerializers(serializers.ModelSerializer):

    duration_days = serializers.SerializerMethodField()
    thread_duration_hours = serializers.SerializerMethodField()

    class Meta:
        model = Plan
        fields = [
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


class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email','username','description', 'gender', 
            'birth_date','current_point',
            'profile_image',
            'role',
            'status',
            'created_at','updated_at',
        ]    
        read_only_fields = ['created_at','updated_at']

#Get all user including data
#mini thread ThreadMiniSerializer
class ThreadMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ['id','title','context','view_count','like_count',
                  'created_at','updated_at']
class DetailsUserSerializers(serializers.ModelSerializer):
    threads  = ThreadMiniSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            'id', 'email','username','description', 'gender', 
            'birth_date','current_point',
            'profile_image',
            'role', 'threads',
            'status', 
            'created_at','updated_at',
        ]    
        read_only_fields = ['created_at','updated_at']