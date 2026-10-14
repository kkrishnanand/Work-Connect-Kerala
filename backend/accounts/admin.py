
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, WorkerProfile, EmployerProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = ("email", "name", "role", "is_staff")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal information", {"fields": ("name", "role")}),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "name",
                "role",
                "password1",
                "password2",
            ),
        }),
    )


admin.site.register(WorkerProfile)
admin.site.register(EmployerProfile)
