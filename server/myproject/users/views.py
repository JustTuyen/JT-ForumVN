from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Plan, User, Subscription
from .serializers import PLanSerializers
from .serializers import SubscriptionSerializers
from .serializers import (
    UserSerializers, DetailsUserSerializers
)
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.
class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.select_related('status').all()
    serializer_class = PLanSerializers
    permission_classes = [permissions.AllowAny]
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related('user','plan','status').all()
    serializer_class = SubscriptionSerializers
    permission_classes = [permissions.AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('status').all()
    serializer_class = DetailsUserSerializers
    permission_classes = [permissions.AllowAny]
  