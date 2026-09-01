from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewSet, ThreadViewSet, ReplyViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('threads', ThreadViewSet, basename='thread')
router.register('replies', ReplyViewSet, basename='reply')
urlpatterns = [
    path('', include(router.urls)),
]