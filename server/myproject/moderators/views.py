from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from .models import Bookmark, Like, Report
from threads.models import Thread, Reply
from users.models import User
from .serializers import BookmarkSerializer, LikeSerializer
from .serializers import (
    ReportSerializer,
    CreateReportSerializer, ReportListingSerializer,
    ModUpdateSerializer, UserUpdateSerializer, AdminUpdateSerializer
)
from django.db.models import Count, Prefetch
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.decorators import action
# Create your views here.
class BookmarkViewSet(viewsets.ModelViewSet):
    # queryset = Bookmark.objects.select_related('user','thread').all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        qs = (
            Bookmark.objects
            .filter(user=self.request.user)
            .select_related('user', 'thread', 'thread__status', 'thread__category')
            .prefetch_related('thread__images',Prefetch('thread__replies',queryset=Reply.objects.order_by('-created_at')))
            .annotate(thread_reply_count=Count('thread__replies', distinct=True))
        )

        status_id = self.request.query_params.get('status')
        if status_id:
            qs = qs.filter(thread__status_id=status_id)

        ordering = self.request.query_params.get('ordering')
        allowed_orderings = ['created_at', 'thread__created_at', 'thread__view_count', 'thread__like_count']
        if ordering and ordering.lstrip('-') in allowed_orderings:
            qs = qs.order_by(ordering)
        else:
            qs = qs.order_by('-created_at') 

        return qs

    #API Endpoint Handler
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response({
                "message": "this thread already been bookmarked by you"
            }, status=status.HTTP_400_BAD_REQUEST)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    #Database Execution Helper
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    
class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.select_related('user','thread','reply').all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]


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

class IsUserOrBoss(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        u = request.user
        return obj.user == u or u.is_staff or u.role in [User.Role.ADMIN, User.Role.MODERATOR]
    
class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.select_related('user','status').all()
    # serializer_class = ReportSerializer
    # permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateReportSerializer

        if self.action in ['update', 'partial_update']:
            sender = getattr(self.request, 'user', None)
            if not sender or not sender.is_authenticated:
                return UserUpdateSerializer
            try:
                target = self.get_object()
            except Exception:
                return UserUpdateSerializer
            if target == sender:
                return UserUpdateSerializer

            if getattr(sender, 'role', None) == User.Role.ADMIN:
                return AdminUpdateSerializer
            
            if getattr(sender, 'role', None) == User.Role.MODERATOR:
                return ModUpdateSerializer
            return UserUpdateSerializer
        
        if self.action in ['retrieve']:
            return ReportListingSerializer  

        return ReportListingSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsUserOrBoss()]
        if self.action == 'destroy':
            return [permissions.IsAuthenticated(), IsAdmin()]
        if self.action in ['retrieve','listing','my_report']:
            return [permissions.IsAuthenticated()]
        return [IsAdmin()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def listing(self, request):
        reports = (
            self.get_queryset()
            .select_related('status')
        )

        status_id = request.query_params.get('status')
        if status_id:
            reports = reports.filter(status_id=status_id)

        allowed_ordering = [ 'created_at', 'updated_at', 'violation_type', 'content_type']
        ordering = request.query_params.get('ordering', '-created_at')
        if ordering.lstrip('-') in allowed_ordering:
            reports = reports.order_by(ordering)

        page = self.paginate_queryset(reports)
        if page is not None:
            serializer = ReportListingSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = ReportListingSerializer(reports, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_report(self, request):
        reports = self.get_queryset().filter(user=request.user)

        status_id = request.query_params.get('status')
        if status_id:
            reports = reports.filter(status_id=status_id)
    
        ordering = request.query_params.get('ordering', '-created_at')
        if ordering.lstrip('-') in ['title','created_at']:
            reports = reports.order_by(ordering)
        page = self.paginate_queryset(reports)

        if page is not None:
            serializer = ReportListingSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = ReportListingSerializer(reports, many=True, context={'request': request})
        return Response(serializer.data)
    