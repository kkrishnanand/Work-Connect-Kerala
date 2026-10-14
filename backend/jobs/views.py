
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

from .models import Job
from .serializers import JobSerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        # Django Admin / superuser can view all jobs.
        if user.is_authenticated and user.is_superuser:
            return Job.objects.all().order_by("-created_at")

        # Employers can view their own jobs.
        if user.is_authenticated and user.role == "employer":
            return Job.objects.filter(
                employer=user
            ).order_by("-created_at")

        # Workers and public visitors can browse active jobs.
        return Job.objects.filter(
            status="active"
        ).order_by("-created_at")

    def perform_create(self, serializer):
        user = self.request.user

        # Only employers can post jobs.
        if not user.is_authenticated or user.role != "employer":
            raise PermissionDenied(
                "Only employer accounts can post jobs."
            )

        serializer.save(employer=user)
