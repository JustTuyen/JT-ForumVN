from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Status
from .serializers import StatusSerializers
# Create your views here.

class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializers
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    permission_classes = [permissions.AllowAny]