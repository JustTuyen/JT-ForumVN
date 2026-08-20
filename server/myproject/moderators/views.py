from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Bookmark
from .serializers import BookmarkSerializer
from django.db.models import Count
# Create your views here.
class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.select_related('user','thread').all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.select_related('user', 'thread').filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    # def my_bookmarks(self, request):
    #     bookmarks = (
    #         self.get_queryset()
    #         .select_related('status')
    #         .prefetch_related('images')
    #         .annotate(thread_count=Count('threads', distinct=True))
    #     ).filter(user=request.user)

        