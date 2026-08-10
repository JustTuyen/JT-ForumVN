from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Category
from .serializers import CategorySerializer
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.select_related('status').all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]