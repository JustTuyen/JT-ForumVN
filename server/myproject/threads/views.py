from django.db.models import Q, Count, Prefetch,F
from rest_framework import viewsets, permissions, status
from .models import Category, Thread, Reply
from .serializers import CategorySerializer
from .serializers import ImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ( 
    ThreadDataAdminSerializer, ThreadUpdateAdminSerializer,
    ThreadDataModSerializer, ThreadUpdateModSerializer,
    CreateThreadSerializer, ListingThreadSerializer,
    UserPublicThreadSerializer, ThreadUpdateUserSerializer
    )
from .serializers import (
    CreateReplySerializer, ReplyUpdateSerializer,PublicReplySerializer
)
from rest_framework.response import Response
from threads.models import Image
from users.models import User
from rest_framework.decorators import action
#
from django.utils import timezone
import logging
#filter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.select_related('status').all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

#checking user role - permission
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
        if not u.is_authenticated:
            return False
        return (
            obj == u
            or u.is_staff
            or u.role in [User.Role.ADMIN, User.Role.MODERATOR]
        )

logger = logging.getLogger(__name__)
class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.select_related('user', 'category', 'status').prefetch_related('images',
        Prefetch(
            'replies',
            queryset=Reply.objects.order_by('-created_at')
        )).all()
    
    # serializer_class = UserPublicThreadSerializer   
    # permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateThreadSerializer

        if self.action in ['update', 'partial_update']:
            sender = getattr(self.request, 'user', None)
            if not sender or not sender.is_authenticated:
                return UserPublicThreadSerializer
            if getattr(sender, 'role', None) == User.Role.ADMIN:
                return ThreadUpdateAdminSerializer
            if getattr(sender, 'role', None) == User.Role.MODERATOR:
                return ThreadDataModSerializer
                
            return ThreadUpdateUserSerializer
        
        if self.action == 'retrieve':
            sender = getattr(self.request, 'user', None)
            if sender and sender.is_authenticated:
                if getattr(sender, 'role', None) == User.Role.ADMIN:
                    return ThreadDataAdminSerializer
                
                if getattr(sender, 'role', None) == User.Role.MODERATOR:
                    return ThreadDataModSerializer
            return UserPublicThreadSerializer
            #both for none login and normal user
        
        return UserPublicThreadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]

        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsUserOrBoss()]

        if self.action == 'destroy':
            return [permissions.IsAuthenticated(), IsAdmin()]

        if self.action == 'retrieve':
            return [permissions.AllowAny()]
        #custom api call
        if self.action == 'my_threads':
            return [permissions.IsAuthenticated()]    
        
        if self.action in ['listings', 'searcher','top_only']:
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_queryset(self):
        Thread.objects.filter(status_id=4, expire_at__lte=timezone.now()).update(status_id=6)
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Thread.objects.filter(pk=instance.pk).update(view_count=F('view_count') + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    
    #searching for user-threads
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_threads(self, request):
        #"""GET /api/threads/my_threads/ — the logged-in user's own threads."""
        threads = (
            self.get_queryset()
            .select_related('status')
            .prefetch_related('images')
            .annotate(reply_count=Count('replies', distinct=True))
            ).filter(user=request.user)

        status_id = request.query_params.get('status')
        if status_id:
            threads = threads.filter(status_id=status_id)

        letter = request.query_params.get('letter', '').strip()
        if letter:
            if letter == '#':
                threads = threads.filter(title__iregex=r'^[^a-zA-Z]')
            else:
                threads = threads.filter(title__istartswith=letter[0])
        
        ordering = request.query_params.get('ordering', '-created_at')
        if ordering.lstrip('-') in ['title','created_at', 'view_count', 'like_count']:
            threads = threads.order_by(ordering)

        page = self.paginate_queryset(threads)
        if page is not None:
            serializer = ListingThreadSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = ListingThreadSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data)

    
    #filtering a minimal threads listing, sorting through status, category and date
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def listings(self, request):
        #"""GET /api/threads/listings/?category=3 — all user can see all threads list"""
        threads = (
            self.get_queryset()
            .select_related('status')
            .prefetch_related('images')
            .annotate(reply_count=Count('replies', distinct=True))
        )

        #GET /api/threads/listings/?ordering=title
        # letter = request.query_params.get('letter', '').strip()
        # if letter:
        #     if letter == '#':
        #         threads = threads.filter(title__iregex=r'^[^a-zA-Z]')
        #     else:
        #         threads = threads.filter(title__istartswith=letter[0])
        


        category_id = request.query_params.get('category')
        if category_id:
            threads = threads.filter(category_id=category_id)

        # status_id = request.query_params.get('status')
        # if status_id:
        #     threads = threads.filter(status_id=status_id)

        if request.query_params.get('shuffle') == 'true':
            threads = threads.order_by('?')
        else:
            ordering = request.query_params.get('ordering', '-created_at')
            if ordering.lstrip('-') in ['created_at', 'view_count', 'like_count']:
                threads = threads.order_by(ordering)


        page = self.paginate_queryset(threads)
        if page is not None:
            serializer = ListingThreadSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = ListingThreadSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data)


    #searching through key words
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def searcher(self, request):
        #"""GET /api/threads/searcher/?q=keyword"""
        #http://127.0.0.1:8000/api/threads/searcher/?q=django&status=3
        keyword = request.query_params.get('q', '').strip()
        if not keyword:
            return Response({'detail': 'Query parameter "q" is required.'}, status=400)
        threads = (
            self.get_queryset()
            .filter(Q(title__icontains=keyword) | Q(context__icontains=keyword) | Q(name__icontains=keyword))
            .select_related('status')
            .prefetch_related('images')
            .annotate(reply_count=Count('replies', distinct=True))
        )

        category_id = request.query_params.get('category')
        if category_id:
            threads = threads.filter(category_id=category_id)

        status_id = request.query_params.get('status')
        if status_id:
            threads = threads.filter(status_id=status_id)

        ordering = request.query_params.get('ordering', 'created_at')
        if ordering.lstrip('-') in ['created_at', 'view_count', 'like_count']:
            threads = threads.order_by(ordering)

        page = self.paginate_queryset(threads)
        if page is not None:
            serializer = ListingThreadSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = ListingThreadSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def top_only(self, request):
        #"""GET /api/threads/top_only/ — top 20 threads with status=1"""
        threads = (
            self.get_queryset()
            .select_related('status')
            .prefetch_related('images')
            .filter(status_id = 2)
            .annotate(reply_count=Count('replies', distinct=True))
            .order_by('-view_count')[:5]
        )

        serializer = ListingThreadSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data)




class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.select_related('status','thread','user').all()
    # serializer_class = ReplySerializer
    # permission_classes = [permissions.AllowAny]
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateReplySerializer
        
        if self.action in ['update', 'partial_update']:
            sender = getattr(self.request, 'user', None)
            if not sender or not sender.is_authenticated:
                return PublicReplySerializer

            try:
                target = self.get_object()
            except Exception:
                return PublicReplySerializer

            if target == sender:
                return ReplyUpdateSerializer
            
            #Admin / Staff updating another user
            if getattr(sender, 'role', None) == User.Role.ADMIN:
                return ReplyUpdateSerializer
                #login is moderator
            if getattr(sender, 'role', None) == User.Role.MODERATOR:
                return ReplyUpdateSerializer
            #fallback        
            return PublicReplySerializer
        
        return PublicReplySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]

        if self.action in ['update', 'partial_update']:
            return[permissions.IsAuthenticated(),IsUserOrBoss()]
        
        if self.action == 'destroy':
            return[permissions.IsAuthenticated(), IsAdmin()]
        return [IsAdmin()]