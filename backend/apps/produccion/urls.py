from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdenProduccionViewSet
from .qr_views import QROrdenView

router = DefaultRouter()
router.register("ordenes", OrdenProduccionViewSet, basename="ordenes")

urlpatterns = [
    path("", include(router.urls)),
    path("ordenes/<int:pk>/qr/", QROrdenView.as_view(), name="orden-qr"),
]