from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (MaterialViewSet, LoteMaterialViewSet, MovimientoBodegaViewSet,
                    CategoriaMaterialViewSet, UbicacionBodegaViewSet, UnidadMedidaViewSet)

router = DefaultRouter()
router.register('materiales', MaterialViewSet, basename='materiales')
router.register('lotes', LoteMaterialViewSet, basename='lotes')
router.register('movimientos', MovimientoBodegaViewSet, basename='movimientos-bodega')
router.register('categorias', CategoriaMaterialViewSet, basename='categorias-material')
router.register('ubicaciones', UbicacionBodegaViewSet, basename='ubicaciones')
router.register('unidades-medida', UnidadMedidaViewSet, basename='unidades-medida')

urlpatterns = [path('', include(router.urls))]