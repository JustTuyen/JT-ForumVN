from django.db.models import Q, Count, Prefetch,F
from django.db import transaction
from rest_framework import viewsets, permissions, status
from .models import Category, Thread, Reply
from .serializers import CategorySerializer
from .serializers import ImageSerializer
from django.db.models.functions import Greatest
from django.contrib.contenttypes.models import ContentType
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
from rest_framework.pagination import PageNumberPagination
from cores.models import Status, Activity_Log, log_activity
from rest_framework.response import Response
from threads.models import Image
from users.models import User
from moderators.models import Like, Bookmark
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
        return obj.user == u or u.is_staff or u.role in [User.Role.ADMIN, User.Role.MODERATOR]

logger = logging.getLogger(__name__)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000

class ThreadViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
    queryset = Thread.objects.select_related('user', 'category', 'status').prefetch_related('images',
        Prefetch(
            'replies',
            queryset=Reply.objects.order_by('created_at')
        )).all()
    
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
        
        return UserPublicThreadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]

        if self.action in ['update', 'partial_update','archive', 'soft_delete']:
            return [permissions.IsAuthenticated(), IsUserOrBoss()]

        if self.action == 'destroy':
            return [permissions.IsAuthenticated(), IsAdmin()]

        if self.action == 'retrieve':
            return [permissions.AllowAny()]
        #custom api call
        if self.action in ['my_threads', 'like_thread','thread_bookmark']:
            return [permissions.IsAuthenticated()]    
        
        if self.action in ['listings', 'searcher','top_only']:
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_queryset(self):
        qs = self.queryset
        user = getattr(self.request, 'user', None)
        is_privileged = (
            user and user.is_authenticated
            and getattr(user, 'role', None) in (User.Role.ADMIN, User.Role.MODERATOR)
        )

        if not is_privileged:
            qs = qs.exclude(status__status_name='Suspend')

        return qs

    def expire_stale_threads(self):
        Thread.objects.filter(
            status__status_name='Active',
            expire_at__lte=timezone.now()
        ).exclude(status__status_name='Archived').update(
            status_id=Status.objects.get(status_name='Archived').id
        )

    def retrieve(self, request, *args, **kwargs):
        self.expire_stale_threads()
        instance = self.get_object()
        Thread.objects.filter(pk=instance.pk).update(view_count=F('view_count') + 1)
        instance = self.get_queryset().get(pk=instance.pk)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        log_activity(
            self.request,
            Activity_Log.ActionType.CREATE_THREAD,
            target=instance,
        )


    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like_thread(self, request, pk=None):
        thread = self.get_object()

        with transaction.atomic():
            like, created = Like.objects.get_or_create(user=request.user, thread=thread)
            if not created:
                like.delete()
                Thread.objects.filter(pk=thread.pk).update(
                like_count=Greatest(F('like_count') - 1, 0))
                is_liked = False
            else:
                Thread.objects.filter(pk=thread.pk).update(
                    like_count=F('like_count') + 1
                )
                is_liked = True

        thread.refresh_from_db()
        log_activity(
            request,
            Activity_Log.ActionType.LIKE_THREAD if is_liked else Activity_Log.ActionType.UNLIKE_THREAD,
            target = thread
        )
        return Response(
            {
                'is_liked': is_liked,
                'like_count': thread.like_count
            },
            status=status.HTTP_200_OK
        )
    
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


        category_id = request.query_params.get('category')
        if category_id:
            if not category_id.isdigit():
                return Response({'detail': 'Invalid category id.'}, status=status.HTTP_400_BAD_REQUEST)
            threads = threads.filter(category_id=category_id)

       
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
            .filter(status__status_name='Active')
            .annotate(reply_count=Count('replies', distinct=True))
            .order_by('-view_count')[:20]
        )

        serializer = ListingThreadSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data)

    def _set_thread_status(self, request, pk, status_name, action_label):
        thread = self.get_object()
        if thread.user != request.user:
            return Response({'detail': f'You can only {action_label} your own threads.'}, status=status.HTTP_403_FORBIDDEN)

        target_status = Status.objects.filter(status_name=status_name).first()
        if not target_status:
            return Response({'detail': f"'{status_name}' status is not configured."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        Thread.objects.filter(pk=thread.pk).update(status=target_status)
        thread.refresh_from_db()

        #log
        log_activity(request, action_type, target=thread)

        return Response({'detail': f'Thread {action_label}d.', 'status': thread.status_id}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def archive(self, request, pk=None):
        return self._set_thread_status(request, pk, 'Archived', 'archive', Activity_Log.ActionType.ARCHIVE_THREAD)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def soft_delete(self, request, pk=None):
        return self._set_thread_status(request, pk, 'Suspend', 'suspend', Activity_Log.ActionType.SOFT_DELETE_THREAD)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def thread_bookmark(self, request, pk=None):
        thread = self.get_object()
        note = request.data.get('note', '')
        bookmark, created = Bookmark.objects.get_or_create(
        user=request.user, 
        thread=thread, 
        defaults={'note': note})
        log_activity(
            request,
            Activity_Log.ActionType.BOOKMARK_THREAD if bookmark_thread else Activity_Log.ActionType.UNBOOKMARK_THREAD,
            target = thread
        )

        if not created:
            bookmark.delete()
            is_bookmarked = False
        else:
            is_bookmarked = True


        return Response({
            'is_bookmarked': is_bookmarked
        },
            status=status.HTTP_200_OK
        )
            
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def user_threads(self, request):
        #"""GET /api/threads/user_threads/?user_id=123"""
        user_id = request.query_params.get('user_id')

        if not user_id or not user_id.isdigit():
            return Response(
                {"detail": "A valid numeric user_id query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        threads = (
            self.get_queryset()
            .filter(user_id=user_id)
            .select_related('status')
            .prefetch_related('images')
            .annotate(reply_count=Count('replies', distinct=True))
            .order_by('-created_at')
        )

        # log_activity(
        #     request,
        #     Activity_Log.ActionType.VIEW_USER,
        #     target = threads
        # )

        status_id = request.query_params.get('status')
        if status_id and status_id != 'all':
            threads = threads.filter(status_id=status_id)

        ordering = request.query_params.get('ordering', '-created_at')
        if ordering.lstrip('-') in ['created_at', 'title', 'view_count']:
            threads = threads.order_by(ordering)


        page = self.paginate_queryset(threads)
        if page is not None:
            serializer = ListingThreadSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

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
        if self.action in ['create', 'like_reply']:
            return [permissions.IsAuthenticated()]

        if self.action in ['update', 'partial_update', 'hide_reply']:
            return[permissions.IsAuthenticated(),IsUserOrBoss()]
        
        if self.action == 'destroy':
            return[permissions.IsAuthenticated(), IsAdmin()]
        return [IsAdmin()]

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        log_activity(
            self.request,
            Activity_Log.ActionType.CREATE_REPLY,
            target=instance,
        )
   
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like_reply(self, request, pk=None):
        reply = self.get_object()

        with transaction.atomic():
            like, created = Like.objects.get_or_create(user=request.user, reply=reply)
            if not created:
                like.delete()
                Reply.objects.filter(pk=reply.pk).update(
                like_count=Greatest(F('like_count') - 1, 0))
                is_liked = False
            else:
                Reply.objects.filter(pk=reply.pk).update(
                    like_count=F('like_count') + 1
                )
                is_liked = True

        reply.refresh_from_db()

        log_activity(
            request,
            Activity_Log.ActionType.LIKE_REPLY if is_liked else Activity_Log.ActionType.UNLIKE_Reply,
            target = reply
        )
        
        return Response(
            {
                'is_liked': is_liked,
                'like_count': reply.like_count
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, IsModeratorOrAdmin])
    def hide_reply(self, request, pk=None):
        reply = self.get_object()
        
        Reply.objects.filter(pk=reply.pk).update(status_id=7)
        reply.refresh_from_db()

        #log
        log_activity(
            request,
            Activity_Log.ActionType.SOFT_DELETE_REPLY,
            target = reply
        )

        return Response(status=status.HTTP_200_OK)
        


   