from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from accounts.views import CurrentUserView, MyProfileView
from jobs.views import JobViewSet
from applications.views import ApplicationViewSet

router = DefaultRouter()

router.register(
    r"jobs",
    JobViewSet,
    basename="job",
)

router.register(
    r"applications",
    ApplicationViewSet,
    basename="application",
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Job, application, and account APIs
    path("api/", include(router.urls)),
    path(
        "api/accounts/me/",
        CurrentUserView.as_view(),
        name="current-user",
    ),
    path("api/accounts/profile/", MyProfileView.as_view(), name="my-profile"),

    # JWT authentication
    path(
        "api/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
