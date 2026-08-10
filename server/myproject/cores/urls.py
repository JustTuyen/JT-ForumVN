from rest_framework.routers import DefaultRouter
from .views import StatusViewSet

router = DefaultRouter()
router.register('status',StatusViewSet, basename='status' )
urlpatterns = router.urls