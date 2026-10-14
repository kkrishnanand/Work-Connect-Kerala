from rest_framework import serializers

from .models import User, WorkerProfile, EmployerProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role"]
        read_only_fields = fields


class WorkerProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = WorkerProfile
        fields = [
            "id",
            "user",
            "district",
            "skills",
            "availability",
            "photo",
        ]
        read_only_fields = ["id", "user"]


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = EmployerProfile
        fields = [
            "id",
            "user",
            "business_name",
            "district",
            "phone",
            "photo",
        ]
        read_only_fields = ["id", "user"]
