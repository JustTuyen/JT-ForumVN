from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from .models import Plan, User, Subscription
from .serializers import PLanSerializers
from .serializers import SubscriptionSerializers
from .serializers import (
    RegisterSerializer, EmailTokenObtainPairSerializer,
    UserDataAdminSerializer,UserUpdateAdminSerializer,
    UserDataModeratorSerializer, UserUpdateModeratorSerializer,
    UserProfileSerializer, UserPublicDataSerializer, 
    UserUpdateImageSerializer, UserUpdatePasswordSerializer, UserUpdateProfileSerializer
)
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework.views import APIView
# from rest_framework_simplejwt.tokens import RefreshToken
from .models import Plan
from rest_framework.parsers import MultiPartParser, FormParser
from threads.models import Image

# Create your views here.
class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.select_related('status').all()
    serializer_class = PLanSerializers
    permission_classes = [permissions.AllowAny]
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related('user','plan','status').all()
    serializer_class = SubscriptionSerializers
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
        if not u.is_authenticated:
            return False
        return (
            obj == u
            or u.is_staff
            or u.role in [User.Role.ADMIN, User.Role.MODERATOR]
        )

#login
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


#user view set
User = get_user_model()
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('status','profile_image').all()
    # serializer_class = UserDataForAdminSerializer
    # permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):

        if self.action == 'create':
            return RegisterSerializer

        if self.action in ['update', 'partial_update']:
            
            sender = getattr(self.request, 'user', None)
            if not sender or not sender.is_authenticated:
                return UserUpdateProfileSerializer

            try:
                target = self.get_object()
            except Exception:
                return UserUpdateProfileSerializer
            
            #check if the the user is trying to update their own profile
            if target == sender:
                return UserUpdateProfileSerializer
            
            #Admin / Staff updating another user
            if getattr(sender, 'role', None) == User.Role.ADMIN:
                return UserUpdateAdminSerializer
                #login is moderator
            if getattr(sender, 'role', None) == User.Role.MODERATOR:
                return UserUpdateModeratorSerializer
            #fallback        
            return UserUpdateProfileSerializer

        if self.action == 'retrieve':
            sender = getattr(self.request, 'user', None)
            if not sender or not sender.is_authenticated:
                return UserPublicDataSerializer

            try:
                target = self.get_object()
            except Exception:
                return UserProfileSerializer
            
            #check if the the user is trying to view their own profile
            if target == sender:
                return UserProfileSerializer
            
            #Admin / Staff view another user
            if getattr(sender, 'role', None) == User.Role.ADMIN:
                return UserDataAdminSerializer
                #login is moderator
            if getattr(sender, 'role', None) == User.Role.MODERATOR:
                return UserDataModeratorSerializer
            #fallback        
            return UserPublicDataSerializer

        # if self.action == 'destroy':
        #     return [permissions.IsAuthenticated(), IsAdmin()]
        return UserPublicDataSerializer
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]

        if self.action in ['update', 'partial_update']:
            return[permissions.IsAuthenticated(),IsUserOrBoss()]

        if self.action == 'retrieve':
            return[permissions.AllowAny()]

        if self.action == 'destroy':
            return[permissions.IsAuthenticated(), IsAdmin()]

        if self.action == 'profile':
            return [permissions.IsAuthenticated()]
        
        if self.action == 'profileImage':
            return [permissions.IsAuthenticated()]
    
        return [IsAdmin()]
    

    #GET / PATCH / PUT /api/users/profile/
    @action(detail=False, methods=['get','patch'], permission_classes=[permissions.IsAuthenticated])
    def profile(self, request):
            user = request.user
            if request.method == 'GET':
                return Response(UserProfileSerializer(user, context={'request':request}).data)
            serializer = UserUpdateProfileSerializer(user, data=request.data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(UserProfileSerializer(user, context={'request': request}).data)

    #https/user/password
    @action(detail=True, methods=['patch', 'put'],  permission_classes=[permissions.IsAuthenticated, IsUserOrBoss])
    def password(self, request, pk=None):
        user = self.get_object()
        serializer = UserUpdatePasswordSerializer(
            user,
            data = request.data,
            partial = True,
            context = {'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            status=status.HTTP_200_OK
        )

    #https/user/:id/profile_image
    @action(detail=True, methods=['post'], 
        permission_classes=[permissions.IsAuthenticated, IsUserOrBoss],
        parser_classes=[MultiPartParser, FormParser])
    def profileImage(self, request, pk=None):
        user = self.get_object()
        serializer = UserUpdateImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uploaded_file = serializer.validated_data['profile_image']
        image = Image.objects.create(
            file = uploaded_file,
            upload_by = request.user,
            alt_text = f"{user.username}'s profile image"
        )
        oldImage = user.profile_image
        user.profile_image = image
        user.save(update_fields=['profile_image'])
        if oldImage:
            oldImage.delete()
        return Response(
            status=status.HTTP_200_OK,
        )


