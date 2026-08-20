from rest_framework import serializers
from .models import Bookmark
from threads.models import Thread, Image

class MiniImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            'id','file','alt_text','is_thumbnail',
            'created_at','display_order'
        ]
        read_only_fields = ['created_at'] 

         
class MiniThreadSerializer(serializers.ModelSerializer):
    images = MiniImageSerializer(many=True, read_only=True)
    class Meta:
        model = Thread
        fields = [
            'id','title','context','created_at','updated_at',
        ]
        read_only_fields = ['created_at','updated_at'] 

class BookmarkSerializer(serializers.ModelSerializer):
    threads = MiniThreadSerializer(many=True, read_only=True)
    class Meta:
        model = Bookmark
        fields = [
            'user',
            'threads',
            'note',
            'created_at','updated_at',
        ]
        read_only_fields = ['created_at','updated_at'] 

        def validate_user(self, value):
            if not value.status or value.status.status_name != 'Active':
                raise serializers.ValidationError("This user account is not active.")
            return value

        def validate_thread(self, value):
            if not value.status or value.status.status_name == 'Suspend':
                raise serializers.ValidationError("This thread is not available.")
            return value