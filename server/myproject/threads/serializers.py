from rest_framework import serializers
from .models import Category, Thread

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id','title','description','status','created_at','updated_at'
        ]

        read_only_fields = ['created_at', 'updated_at']

class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            'id', 'name', 'title', 'context', 'view_count',
            'like_count','point_reward',
            'expire_at', 'reply_limit',
            'category','user','status',
            'created_at','updated_at'
        ]
        read_only_fields = ['created_at','updated_at']