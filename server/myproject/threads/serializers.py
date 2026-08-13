from rest_framework import serializers
from .models import Category, Thread, Image, Reply
from django.db import transaction
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id','title','description','status','created_at','updated_at'
        ]

        read_only_fields = ['created_at', 'updated_at']

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = [
            'id', 'name', 'like_count', 'point_reward',
            'context',
            'parent_reply','thread','status','user',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class CreateThreadSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        max_length=5
    )
    class Meta:
        model = Thread
        fields = [
            'name', 'title', 'context',
            'category','user','status',
            'images'
        ]

        read_only_fields = ['user']
    
    def validate_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("You can upload a maximum of 5 images per thread.")
        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        request = self.context['request']

        with transaction.atomic():
            thread = Thread.objects.create(
                user=request.user,
                **validated_data
            )

            for index, file in enumerate(images_data):
                Image.objects.create(
                    file=file,
                    thread=thread,
                    upload_by=request.user,
                    display_order=index,
                    is_thumbnail=(index == 0),
                )
        return thread

class ImageSerializer(serializers.Serializer):
    file = serializers.ImageField()
    def validate(self, attrs):
        thread = self.context['thread']
        current_count = thread.images.count()
        if current_count >= 5:
            raise serializers.ValidationError(
                {'file': 'This thread already has the maximum of 5 images.'}
            )
        return attrs

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

class ReplyMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ['id','name','context','like_count',
                    'created_at','updated_at']
class LikeThreadSerializer(serializers.ModelSerializer):
    class Meta:
            model = Thread
            fields = ['id', 'like_count']
            read_only_fields = ['id']
class AdminThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            'id', 'name', 'title', 'context', 'view_count',
            'like_count','point_reward',
            'expire_at', 'reply_limit',
            'category','user','status',
        ]
        read_only_fields = [ 'id']

class UpdateModeratorThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            'id', 
            'status',
        ]
        read_only_fields = ['id']

class UpdateUserThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            'id', 
            'status',
        ]
        read_only_fields = ['id']

class PublicThreadSerializer(serializers.ModelSerializer):
    replies = ReplyMiniSerializer(many=True, read_only=True)
    class Meta:
        model = Thread
        fields = [
            'id', 'title', 'context', 'view_count','replies',    
        ]
        read_only_fields = ['id']

class DetailsUserThreadSerializer(serializers.ModelSerializer):
    replies = ReplyMiniSerializer(many=True, read_only=True)
    class Meta:
        model = Thread
        fields = [
            'id', 'name', 'title', 'context', 'view_count',
            'like_count','point_reward',
            'expire_at', 'reply_limit',
            'category','user','status','replies'
            'created_at','updated_at'
        ]
        read_only_fields = ['created_at','updated_at']