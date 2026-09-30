from django.conf import settings
from django.db import models


class Job(models.Model):

    CATEGORY_CHOICES = (
        ("Event", "Event Staff"),
        ("Catering", "Catering"),
        ("Parking", "Parking"),
        ("Cleaning", "Cleaning"),
        ("Loading", "Loading & Unloading"),
        ("Delivery", "Delivery"),
        ("Construction", "Construction"),
        ("Technical", "Technical"),
        ("Hospitality", "Hospitality"),
        ("Photography", "Photography"),
        ("Other", "Other"),
    )

    STATUS_CHOICES = (
        ("active", "Active"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="jobs",
        limit_choices_to={"role": "employer"},
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
    )

    district = models.CharField(max_length=100)

    location = models.CharField(max_length=255)

    date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    payment = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    workers_required = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active",
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title