from rest_framework.routers import DefaultRouter
from .views import StatusViewSet, ActivityLogViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('status',StatusViewSet, basename='status' )
router.register('logs',ActivityLogViewSet, basename='log' )
urlpatterns = [
    path('', include(router.urls)),
]