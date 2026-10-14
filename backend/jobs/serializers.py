from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job

        fields = [
            "id",
            "employer",
            "title",
            "description",
            "category",
            "district",
            "location",
            "date",
            "start_time",
            "end_time",
            "payment",
            "workers_required",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "employer",
            "status",
            "created_at",
        ]