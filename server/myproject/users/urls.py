from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PlanViewSet
from .views import UserViewSet
router = DefaultRouter()
router.register('plans', PlanViewSet, basename='plan')
router.register('users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]