from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from .models import Plan, User, Subscription
from .serializers import PLanSerializers
from .serializers import SubscriptionSerializers
from .serializers import (
    UserSerializers, ProfileUserSerializers,UserManagerSerializers,
    RegisterSerializers, EmailTokenObtainPairSerializer, DetailsUserSerializers, 
    AdminUserSerializers, ModeratorUserSerializers, UpdateUserSerializers
)
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.select_related('status').all()
    serializer_class = PLanSerializers
    permission_classes = [permissions.AllowAny]
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related('user','plan','status').all()
    serializer_class = SubscriptionSerializers
    permission_classes = [permissions.AllowAny]


#user - permissions segment
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    

class LogoutViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

#return TRUE only if the user has role = admin
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and (u.is_staff or u.role == User.Role.ADMIN)

#return TRUE only if the user has role = Moderator or Admin
class IsModeratorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and (
            u.is_staff or u.role in [User.Role.ADMIN, User.Role.MODERATOR]
        )
class IsNormieOrBoss(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        u = request.user
        if not u.is_authenticated:
            return False
        return (
            obj == u
            or u.is_staff
            or u.role in [User.Role.ADMIN, User.Role.MODERATOR]
        )

class UserViewSet(viewsets.ModelViewSet):
    #executes an SQL JOIN to pre-fetch related ForeignKey objects (status and profile_image) in a single query,
    queryset = User.objects.select_related('status','profile_image').all()
    # serializer_class = DetailsUserSerializers
    # permission_classes = [permissions.AllowAny]

    #which field can be update depend on who performing the task
    def get_serializer_class(self):
        #register for all user
        if self.action == 'create':
            return RegisterSerializers

        #update information for 
        if self.action in ['update','partial_update']:
            #check for sender and target id
            sender = self.request.user
            try:
                target = self.get_object()
            except Exception:
                return UpdateUserSerializers
            
            if target != sender:
                if sender.is_authenticated and (
                    sender.is_staff or sender.role == User.Role.ADMIN
                ):
                    return AdminUserSerializers
                return ModeratorUserSerializers
            #else self-update
            return UpdateUserSerializers

        #deleted
        # if self.action == 'destroy':
        #     return [permissions.IsAuthenticated(), IsAdmin()]

        #get 
        if self.action == 'retrieve':
            #check for sender and target id
            sender = self.request.user
            try:
                target = self.get_object()
            except Exception:
                return ProfileUserSerializers
            
            if sender.is_authenticated and (
                target == sender
                or sender.is_staff
                or sender.role in [User.Role.ADMIN, User.Role.MODERATOR]
            ):
                return UserManagerSerializers
            return ProfileUserSerializers
        return DetailsUserSerializers

        # #suspend
        # if self.action == 'suspend':
        #     return [permissions.IsAuthenticated(), IsModeratorOrAdmin()]
        # return [IsAdmin()]

    #login gap
    def get_permissions(self):
        #post
        if self.action == 'create':
            return [permissions.AllowAny()]

        #up
        if self.action in ['update','partial_update']:
            return [permissions.IsAuthenticated(), IsNormieOrBoss()]

        #deleted
        if self.action == 'destroy':
            return [IsAdmin()]

        #get - with and without login
        if self.action == 'retrieve':
           return [permissions.AllowAny()]

        #suspend
        if self.action == 'suspend':
            return [IsModeratorOrAdmin()]
        
        return [IsAdmin()]

    #https/user/:id
    @action (detail=False, methods=['get','patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user
        if request.method == 'GET':
            return Response(UserSerializers(user, context={'request':request}).data)
        serializer = UpdateUserSerializers(user, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializers(user, context={'request': request}).data)
