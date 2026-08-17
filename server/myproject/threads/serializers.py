from rest_framework import serializers
from .models import Category, Thread, Image, Reply
from users.models import User
from django.db import transaction
from django.db.models import F
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

    def validate_user(self, value):
        if not value.status or value.status.status_name != 'Active':
            raise serializers.ValidationError("This user account is not active.")
        return value

    def validate_thread(self, value):
        if not value.status or value.status.status_name != 'Active':
            raise serializers.ValidationError("This thread is not active.")
        
    def validate(self, attrs):
        parent_reply = attrs.get('parent_reply')
        thread = attrs.get('thread')
        if parent_reply and thread and parent_reply.thread_id != thread.id:
            raise serializers.ValidationError({
                "parent_reply": "The parent reply does not belong to the selected thread."
            })
        return attrs


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

class MiniImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            'id','file','alt_text','is_thumbnail',
            'created_at','display_order'
        ]
        read_only_fields = ['created_at'] 

class ThreadSerializer(serializers.ModelSerializer):
    queryset = Thread.objects.select_related('user', 'category', 'status').prefetch_related('images').all()
    class Meta:
        model = Thread
        fields = [
            'id', 'name', 'title', 'context', 
            'view_count','like_count','point_reward',
            'expire_at', 'reply_limit',
            'images', 
            'category','user','status',
            'created_at','updated_at'
        ]
        read_only_fields = ['created_at','updated_at']
#Create
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
            'images',
            'category','user'
        ]
    def validate_user(self, value):
        if not value.status or value.status.status_name != 'Active':
            raise serializers.ValidationError("This user account is not active.")
        return value

    def validate_category(self, value):
        if not value.status or value.status.status_name != 'Opened':
            raise serializers.ValidationError("This category is not active.")
        return value
    
    def validate_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("You can upload a maximum of 5 images per thread.")
        return value
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        request = self.context['request']
        user = validated_data.pop('user', request.user)
        user.current_point = F('current_point') + 10
        user.save(update_fields=['current_point'])
        with transaction.atomic():
            thread = Thread.objects.create(
                user=user,
                **validated_data
            )
            image_instances = [
                Image(
                    file=file,
                    thread=thread,
                    upload_by=user,
                    display_order=index,
                    is_thumbnail=(index == 0),
                )
                for index, file in enumerate(images_data)
            ]
            if image_instances:
                Image.objects.bulk_create(image_instances)
        return thread


class MiniReplySerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many=True, read_only=True)
    class Meta:
        model = Reply
        fields = [
            'id', 'name', 'context', 'images',
            'created_at','updated_at','like_count',
            'parent_reply', 'created_at'
        ]
        read_only_field = ['created_at']


#Admin 
class ThreadDataAdminSerializer(serializers.ModelSerializer):
    replies = MiniReplySerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    user_username = serializers.ReadOnlyField(source='user.username')
    status_name = serializers.ReadOnlyField(source='status.status_name')
    images = MiniImageSerializer(many=True, read_only=True)
    class Meta:
        model = Thread
        fields = [
            'id', 'name', 'title', 'context', 
            'view_count','like_count','point_reward',
            'replies','images',
            'user','user_username',
            'category', 'category_name',
            'status','status_name',
            'created_at','updated_at'
        ]
        read_only_fields = ['created_at','updated_at']

class ThreadUpdateAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            'id',
            'status',
        ]
        read_only_fields = ['id']

class ThreadDataModSerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many=True, read_only=True)
    replies = MiniReplySerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    user_username = serializers.ReadOnlyField(source='user.username')
    status_name = serializers.ReadOnlyField(source='status.status_name')
    class Meta:
        model = Thread
        fields = [
            'id', 'name', 'title', 'context', 
            'view_count','like_count',
            'expire_at', 'reply_limit',
            'images',
            'category_name',
            'user_username',
            'status_name',
            'created_at','updated_at'
        ]
        read_only_fields = ['created_at','updated_at']

class ThreadUpdateModSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            'id','status'
        ]
        read_only_fields = ['id']

class UserPublicThreadSerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many=True, read_only=True)
    replies = MiniReplySerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    user_username = serializers.ReadOnlyField(source='user.username')
    status_name = serializers.ReadOnlyField(source='status.status_name')
    class Meta:
            model = Thread
            fields = [
                'id', 'name', 'title', 'context', 
                'view_count','like_count',
                'expire_at', 'reply_limit',
                'images',
                'category_name',
                'user_username',
                'replies',
                'status_name',
                'created_at','updated_at'
            ]
            read_only_fields = ['created_at','updated_at']
    
class ThreadUpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = [
            'id','status'
        ]
        read_only_fields = ['id']

class ListingThreadSerializer(serializers.ModelSerializer):
    status_name = serializers.ReadOnlyField(source='status.status_name')
    images = MiniImageSerializer(many=True,read_only=True)
    reply_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Thread
        fields = [
            'id','context',
            'status_name',
            'reply_count','images'
        ]
        read_only_fields = ['id']

#Replies
class CreateReplySerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        max_length=5
    )
    class Meta:
        model = Reply
        fields = [
            'id', 'name', 'like_count', 'point_reward',
            'context',
            'parent_reply', 'images',
            'thread','status','user',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_user(self, value):
        if not value.status or value.status.status_name != 'Active':
            raise serializers.ValidationError("This user account is not active.")
        return value

    def validate_thread(self, value):
        if not value.status or value.status.status_name != 'On Going':
            raise serializers.ValidationError("This threads is not active.")
        return value
    
    def validate(self, attrs):
        parent_reply = attrs.get('parent_reply')
        thread = attrs.get('thread')
        if parent_reply and thread and parent_reply.thread_id != thread.id:
            raise serializers.ValidationError({
                "parent_reply": "The parent reply does not belong to the selected thread."
            })
        return attrs
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        request = self.context['request']
        user = validated_data.pop('user', request.user)
        with transaction.atomic():
            reply = Reply.objects.create(
                user=user,
                **validated_data
            )
            image_instances = [
                Image(
                    file=file,
                    reply=reply,
                    upload_by=user,
                    display_order=index,
                    is_thumbnail=(index == 0),
                )
                for index, file in enumerate(images_data)
            ]
            if image_instances:
                Image.objects.bulk_create(image_instances)
            User.objects.filter(pk=user.pk).update(current_point=F('current_point') + 2)

        return reply

class ReplyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = [
            'id','status'
        ]
        read_only_fields = ['id']

class PublicReplySerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many=True,read_only=True)
    class Meta:
        model = Reply
        fields = [
            'id','name','context','images'
            'created_at',
        ]
        read_only_fields = ['id']