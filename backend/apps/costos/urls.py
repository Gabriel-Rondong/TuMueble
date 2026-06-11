from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CostoOrdenViewSet, IngresoOrdenViewSet, NoConformidadViewSet

router = DefaultRouter()
router.register('costos', CostoOrdenViewSet, basename='costos')
router.register('ingresos', IngresoOrdenViewSet, basename='ingresos')
router.register('no-conformidades', NoConformidadViewSet, basename='no-conformidades')

urlpatterns = [path('', include(router.urls))]