from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewSet, ThreadViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('threads', ThreadViewSet, basename='thread')

urlpatterns = [
    path('', include(router.urls)),
]