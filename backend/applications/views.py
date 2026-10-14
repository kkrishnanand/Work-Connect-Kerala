
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Application
from .serializers import ApplicationSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    # Preserve the existing API methods.
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        user = self.request.user

        if user.role == "worker":
            return (
                Application.objects
                .filter(worker=user)
                .select_related("job", "worker")
                .order_by("-applied_at")
            )

        if user.role == "employer":
            return (
                Application.objects
                .filter(job__employer=user)
                .select_related("job", "worker")
                .order_by("-applied_at")
            )

        return Application.objects.none()

    def create(self, request, *args, **kwargs):
        if request.user.role != "worker":
            raise PermissionDenied(
                "Only worker accounts can apply for jobs."
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        job = serializer.validated_data["job"]

        if job.status != "active":
            raise ValidationError({
                "job": "You cannot apply for a job that is not active."
            })

        if Application.objects.filter(worker=user, job=job).exists():
            raise ValidationError({
                "job": "You have already applied for this job."
            })

        serializer.save(worker=user)

    @action(
        detail=True,
        methods=["patch"],
        url_path="status",
        permission_classes=[IsAuthenticated],
    )
    def update_status(self, request, pk=None):
        user = request.user

        if user.role != "employer":
            raise PermissionDenied(
                "Only employers can update application statuses."
            )

        application = self.get_object()
        new_status = request.data.get("status")

        if new_status not in ["accepted", "rejected"]:
            raise ValidationError({
                "status": "Status must be either 'accepted' or 'rejected'."
            })

        if application.status != "pending":
            raise ValidationError({
                "status": "Only pending applications can be updated."
            })

        application.status = new_status
        application.save(update_fields=["status"])

        return Response(
            ApplicationSerializer(application).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="confirm-completion",
        permission_classes=[IsAuthenticated],
    )
    def confirm_completion(self, request, pk=None):
        user = request.user

        # get_object() also ensures the application belongs
        # to this worker or to an employer's own job.
        application = self.get_object()

        if application.status not in ["accepted", "completed"]:
            raise ValidationError({
                "status": (
                    "Only accepted applications can have "
                    "completion confirmed."
                )
            })

        if user.role == "worker":
            if application.worker != user:
                raise PermissionDenied(
                    "You can only confirm your own application."
                )

            if application.worker_confirmed_completion:
                return Response(
                    ApplicationSerializer(application).data,
                    status=status.HTTP_200_OK,
                )

            application.worker_confirmed_completion = True

        elif user.role == "employer":
            if application.job.employer != user:
                raise PermissionDenied(
                    "You can only confirm completion for your own jobs."
                )

            if application.employer_confirmed_completion:
                return Response(
                    ApplicationSerializer(application).data,
                    status=status.HTTP_200_OK,
                )

            application.employer_confirmed_completion = True

        else:
            raise PermissionDenied(
                "Only workers and employers can confirm completion."
            )

        update_fields = []

        if user.role == "worker":
            update_fields.append("worker_confirmed_completion")
        else:
            update_fields.append("employer_confirmed_completion")

        # Complete this application only when both sides confirm.
        if (
            application.worker_confirmed_completion
            and application.employer_confirmed_completion
        ):
            application.status = "completed"
            update_fields.append("status")

        application.save(update_fields=update_fields)

        return Response(
            ApplicationSerializer(application).data,
            status=status.HTTP_200_OK,
        )
