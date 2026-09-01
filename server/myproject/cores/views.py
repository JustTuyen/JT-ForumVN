from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Status, Activity_Log
from .serializers import StatusSerializers, ActivityLogSerializer
# Create your views here.

class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializers
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    permission_classes = [permissions.AllowAny]

class ActivityLogViewSet(viewsets.ModelViewSet):
    queryset = Activity_Log.objects.all()
    serializer_class = ActivityLogSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    permission_classes = [permissions.AllowAny]