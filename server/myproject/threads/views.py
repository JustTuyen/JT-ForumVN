from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Category, Thread
from .serializers import CategorySerializer, ThreadSerializer
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.select_related('status').all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.select_related('user','category','status').all()
    serializer_class = ThreadSerializer
    permission_classes = [permissions.AllowAny]