from rest_framework import serializers
from .models import Plan, User
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

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


#user registeration
class UserRegisterSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, validators = [validate_password])

    class Meta:
        model = User
        fields = ['id','username','email','password']
        
    #harsher
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

#user rank role only can update data this much :/
class UpdateUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','description', 
                  'gender','birth_date','profile_image']

#admin managing other user
class UserAdminSerializers(serializers.ModelSerializer):
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

class UserModeratorSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['description','gender','birth_date','profile_image', 'status']

        
class PublicUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','description','gender','profile_image','created_at']