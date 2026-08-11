from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Plan
from .serializers import PLanSerializers
from .serializers import (
    UserSerializers, UserAdminSerializers, UserModeratorSerializers, PublicUserSerializers,
    UpdateUserSerializers, UserRegisterSerializers
)
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.
class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.select_related('status').all()
    serializer_class = PLanSerializers
    permission_classes = [permissions.AllowAny]


User = get_user_model()

#permission class for admin
#Returns True only if the user is authenticated and is either a Django staff member
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and (u.is_staff or u.role == User.Role.ADMIN)

    

#permission class for moderator/admin

class IsModeratorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and (u.is_staff or u.role in [User.Role.ADMIN, User.Role.MODERATOR])

#permission class for user / moderator / admin
class IsSelfOrModeratorOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        u = request.user
        return obj == u or u.is_staff or u.role in [User.Role.ADMIN, User.Role.MODERATOR]



class UserViewSet(viewsets.ModelViewSet):

    #executes an SQL JOIN to pre-fetch related ForeignKey objects (status and profile_image) in a single query,
    queryset = User.objects.select_related('status','profile_image').all()


    #Explanation: Determines which fields can be updated based on who is performing the edit:
    def get_serializer_class(self):
        # for all user with all role
        if self.action == 'create':
            return UserRegisterSerializers

       # update user info
        if self.action in ['update','partial_update']:
            #get the sender id
            requester = self.request.user
            
            #get the target id
            target = self.get_object()

            #if someone editing not their own profile, check if the user is either admin or mod
            if target != requester:
                return UserAdminSerializers if requester.role == User.Role.ADMIN or requester.is_staff else UserModeratorSerializers

            #if someone editing their own profile,
            return UpdateUserSerializers


        if self.action == 'retrieve':
            requester = self.request.user
            target = self.get_object()
            if requester.is_authenticated and (target == requester or requester.is_staff or requester.role in [User.Role.ADMIN, User.Role.MODERATOR]):
                #for staff
                return UserSerializers
            #for user
            return PublicUserSerializers
        #for all other actions (list, retrieve).
        return UserSerializers
    

    # logic gap
    def get_permissions(self):
        #create user
        if self.action == 'create':
            return [permissions.AllowAny()]

        #update - delete 
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsSelfOrModeratorOrAdmin()]

        if self.action in ['destroy']:
            return [IsAdmin()]
        
        #Any all user can view user details without login.
        if self.action == 'retrieve':
            return [permissions.AllowAny()]

        #action accessible to Moderators or Admins.
        if self.action == 'suspend':
            return [IsModeratorOrAdmin()]
        
        return [IsAdmin()]

    #Self Profile Endpoint
    @action(detail=False, methods=['get', 'patch'], permission_classes=[permissions.IsAuthenticated])
    #GET /users/me/
    def me(self, request):
        user = request.user
        if request.method == 'GET':
            return Response(UserSerializers(user, context={'request':request}).data)
        serializer = UpdateUserSerializers(user, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializers(user, context={'request': request}).data)

