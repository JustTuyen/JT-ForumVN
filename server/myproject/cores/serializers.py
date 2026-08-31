from rest_framework import serializers
from .models import Status, Activity_Log

class StatusSerializers(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = [
            'id','status_type','status_name','created_at', 'updated_at'
        ]

        read_only_fields = ['created_at', 'updated_at']

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.user_username')
    target = serializers.SerializerMethodField()
    content_type_name = serializers.CharField(source='content_type.model', read_only=True)

    class Meta:
        model = Activity_Log
        fields = [
            'id','ip_address','action','created_at', 
            'user','user_name',
            'content_type','content_type_name',
            'object_id','target','metadata',
        ]

        read_only_fields = ['created_at']

    def get_target(self, obj):
        if obj.target is None:
            return None
        return {
            'id': obj.target.pk,
            'display': str(obj.target),
        }