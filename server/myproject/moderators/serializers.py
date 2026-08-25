from rest_framework import serializers
from .models import Bookmark, Like
from threads.models import Thread, Image, Reply

class MiniImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            'id','file','alt_text','is_thumbnail',
            'created_at','display_order'
        ]
        read_only_fields = ['created_at'] 


class MiniReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = [
            'id'
        ]
        read_only_fields = ['id']

class MiniThreadSerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many=True, read_only=True)
    status_name = serializers.ReadOnlyField(source='status.status_name')
    reply_count = serializers.IntegerField(source='thread_reply_count', read_only=True)
    replies = MiniReplySerializer(many=True,read_only=True)
    class Meta:
        model = Thread
        fields = [
            'id','title','context','status_name',
            'images','created_at','updated_at',
            'reply_count','replies'
        ]
        read_only_fields = ['created_at','updated_at'] 



class BookmarkSerializer(serializers.ModelSerializer):
    thread = MiniThreadSerializer(read_only=True)
    thread_id = serializers.PrimaryKeyRelatedField(
        queryset=Thread.objects.all(), 
        source='thread', 
        write_only=True
    )
    class Meta:
        model = Bookmark
        fields = [
            'id',
            'user',
            'thread',
            'thread_id',
            'note',
            'created_at','updated_at',
        ]
        read_only_fields = ['user','created_at','updated_at'] 

    def validate_user(self, value):
        if not value.status or value.status.status_name != 'Active':
            raise serializers.ValidationError("This user account is not active.")
        return value

    def validate_thread_id(self, value):
        if not value.status or value.status.status_name == 'Suspend':
            raise serializers.ValidationError("This thread is not available.")
        return value


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = [
            'id',
            'user',
            'thread',
            'reply',
            'created_at',
        ]
        read_only_fields = ['created_at',] 

    def validate_user(self, value):
        if not value.status or value.status.status_name != 'Active':
            raise serializers.ValidationError("This user account is not active.")
        return value

    def validate_thread_id(self, value):
        if not value.status or value.status.status_name == 'Suspend':
            raise serializers.ValidationError("This thread is not available.")
        return value
    
    def validate_reply_id(self, value):
        if not value.status or value.status.status_name == 'Suspend':
            raise serializers.ValidationError("This reply is not available.")
        return value