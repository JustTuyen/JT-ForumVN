from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Bookmark
from threads.models import Thread
from .serializers import BookmarkSerializer
from django.db.models import Count, Prefetch
# Create your views here.
class BookmarkViewSet(viewsets.ModelViewSet):
    #queryset = Bookmark.objects.select_related('user','thread').all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    # def get_queryset(self):
    #     #Annotate reply_count directly on the Thread model
    #     threads_with_reply_count = (
    #         Thread.objects
    #         .select_related('status')
    #         .prefetch_related('images')
    #         .annotate(reply_count=Count('replies', distinct=True))
    #     )
    #     # 2. Prefetch the annotated threads into the Bookmark queryset
    #     return (
    #         Bookmark.objects
    #         .filter(user=self.request.user)
    #         .select_related('user', 'thread', 'thread__status')
    #         .annotate(thread_reply_count=Count('thread__replies', distinct=True))
    #     )
    def get_queryset(self):
        qs = (
            Bookmark.objects
            .filter(user=self.request.user)
            .select_related('user', 'thread', 'thread__status', 'thread__category')
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
            qs = qs.order_by('-created_at')   # default: most recently bookmarked first

        return qs

    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

   