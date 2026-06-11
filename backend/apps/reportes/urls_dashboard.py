from django.urls import path
from .views import (
    DashboardGerencialView, DashboardProduccionView,
    DashboardBodegaView, DashboardFinanzasView,
)

urlpatterns = [
    path("gerencial/", DashboardGerencialView.as_view()),
    path("produccion/", DashboardProduccionView.as_view()),
    path("bodega/", DashboardBodegaView.as_view()),
    path("finanzas/", DashboardFinanzasView.as_view()),
]