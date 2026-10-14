from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email address is required.")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):

    ROLE_CHOICES = (
        ("worker", "Worker"),
        ("employer", "Employer"),
    )

    username = None

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        blank=True,
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class WorkerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="worker_profile",
    )

    district = models.CharField(max_length=100)
    skills = models.TextField(blank=True)
    availability = models.BooleanField(default=True)

    # Optional worker profile photo
    photo = models.ImageField(
        upload_to="profile_photos/workers/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"Worker Profile - {self.user.email}"


class EmployerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="employer_profile",
    )

    business_name = models.CharField(max_length=150)
    district = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)

    # Optional employer profile photo
    photo = models.ImageField(
        upload_to="profile_photos/employers/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"Employer Profile - {self.business_name}"