from django.urls import path
from .views import (
    OrdenesAtrasadasView, StockCriticoView,
    RentabilidadProductosView, TrazabilidadOrdenView,
    TrazabilidadLoteView, NoConformidadesResumenView,
)

urlpatterns = [
    path("ordenes-atrasadas/", OrdenesAtrasadasView.as_view()),
    path("stock-critico/", StockCriticoView.as_view()),
    path("rentabilidad/", RentabilidadProductosView.as_view()),
    path("trazabilidad-orden/", TrazabilidadOrdenView.as_view()),
    path("trazabilidad-lote/", TrazabilidadLoteView.as_view()),
    path("no-conformidades/", NoConformidadesResumenView.as_view()),
]