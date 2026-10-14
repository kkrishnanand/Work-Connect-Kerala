
from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )
    worker_name = serializers.CharField(
        source="worker.name",
        read_only=True
    )
    worker_email = serializers.EmailField(
        source="worker.email",
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "job_title",
            "worker",
            "worker_name",
            "worker_email",
            "status",
            "worker_confirmed_completion",
            "employer_confirmed_completion",
            "applied_at",
        ]
        read_only_fields = [
            "id",
            "worker",
            "status",
            "applied_at",
        ]
