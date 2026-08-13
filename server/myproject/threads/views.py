from django.db.models import F
from rest_framework import viewsets, permissions, status
from .models import Category, Thread, Reply
from .serializers import CategorySerializer, ReplySerializer
from .serializers import ImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import (
    ThreadSerializer, CreateThreadSerializer, AdminThreadSerializer, DetailsUserThreadSerializer,
    UpdateModeratorThreadSerializer,UpdateUserThreadSerializer,PublicThreadSerializer
)
from rest_framework.response import Response
from threads.models import Image
from users.models import User
from rest_framework.decorators import action

# Create your views here.

class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.select_related('status','thread','user').all()
    serializer_class = ReplySerializer
    permission_classes = [permissions.AllowAny]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.select_related('status').all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and (u.is_staff or u.role == User.Role.ADMIN)

class IsModeratorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and (
            u.is_staff or u.role in [User.Role.ADMIN, User.Role.MODERATOR]
        )
class IsNormieOrBoss(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        u = request.user
        if not u.is_authenticated:
            return False
        return (
            obj == u
            or u.is_staff
            or u.role in [User.Role.ADMIN, User.Role.MODERATOR]
        )
    
    
class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.select_related('user','category','status').all()
    # serializer_class = ThreadSerializer
    # permission_classes = [permissions.AllowAny]
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateThreadSerializer
        
        if self.action in ['update', 'partial_update']:
            if not self.request or not self.request.user.is_authenticated:
                return PublicThreadSerializer

            sender = self.request.user
            try:
                target = self.get_object()
                if target.user != sender:
                    if sender.is_staff or getattr(sender, 'role', None) == User.Role.ADMIN:
                        return AdminThreadSerializer
                    return UpdateModeratorThreadSerializer
            except Exception:
                pass
            return UpdateUserThreadSerializer
        
        if self.action in ['retrieve', 'top_views']: 
            if not self.request or not self.request.user.is_authenticated:
                return PublicThreadSerializer
            
            sender = self.request.user
            try:
                target = self.get_object()
            except Exception:
                return PublicThreadSerializer
            if (
                target.user == sender
                or sender.is_staff
                or getattr(sender, 'role', None) in [User.Role.ADMIN, User.Role.MODERATOR]
            ):
                return ThreadSerializer
            return DetailsUserThreadSerializer
        return PublicThreadSerializer
                
    #login gap
    def get_permissions(self):
        if self.action == 'create':
            return[permissions.IsAuthenticated()]

        if self.action in ['update','partial_update']:
            return [permissions.IsAuthenticated(), IsNormieOrBoss()]

        #deleted
        if self.action == 'destroy':
            return [IsAdmin()]

        if self.action == 'retrieve':
            return [permissions.AllowAny()]
        
        if self.action == 'suspend':
            return [IsModeratorOrAdmin()]

        return [permission() for permission in self.permission_classes]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Thread.objects.filter(pk=instance.pk).update(view_count=F('view_count') + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


    @action (detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        # """GET /api/threads/mine/ — the logged-in user's own threads."""
        threads = self.get_queryset().filter(user=request.user)
        page = self.paginate_queryset(threads)
        serializer = UserThreadSerializer(page or threads, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny],)
    def top_views(self, request):

        threads = self.get_queryset().order_by('-view_count')[:20]
        serializer = PublicThreadSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)