from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from .models import Bookmark, Like
from threads.models import Thread, Reply
from .serializers import BookmarkSerializer, LikeSerializer
from django.db.models import Count, Prefetch
from django.db import IntegrityError
from rest_framework.response import Response
# Create your views here.
class BookmarkViewSet(viewsets.ModelViewSet):
    #queryset = Bookmark.objects.select_related('user','thread').all()
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

    