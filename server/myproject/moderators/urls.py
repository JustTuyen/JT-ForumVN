from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import BookmarkViewSet, LikeViewSet, ReportViewSet
router = DefaultRouter()
router.register('bookmarks', BookmarkViewSet, basename='bookmark')
router.register('likes', LikeViewSet, basename='like')
router.register('reports', ReportViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls))
]