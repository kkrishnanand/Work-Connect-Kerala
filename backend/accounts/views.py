from rest_framework import generics
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated

from .models import WorkerProfile, EmployerProfile
from .serializers import (
    UserProfileSerializer,
    WorkerProfileSerializer,
    EmployerProfileSerializer,
)


class CurrentUserView(generics.RetrieveAPIView):
    """
    Return basic information about the currently logged-in user.
    Used by the existing login flow.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class MyProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update the authenticated user's own profile.
    Supports JSON updates and image uploads.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        user = self.request.user

        if user.role == "worker":
            try:
                return user.worker_profile
            except WorkerProfile.DoesNotExist:
                raise NotFound(
                    "Worker profile not found. Complete profile creation first."
                )

        if user.role == "employer":
            try:
                return user.employer_profile
            except EmployerProfile.DoesNotExist:
                raise NotFound(
                    "Employer profile not found. Complete profile creation first."
                )

        raise PermissionDenied(
            "Only worker and employer accounts have editable profiles."
        )

    def get_serializer_class(self):
        if self.request.user.role == "worker":
            return WorkerProfileSerializer

        return EmployerProfileSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
