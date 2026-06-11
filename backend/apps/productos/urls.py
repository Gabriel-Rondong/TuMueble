from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, EtapaProduccionViewSet, CategoriaProductoViewSet

router = DefaultRouter()
router.register('productos', ProductoViewSet, basename='productos')
router.register('etapas', EtapaProduccionViewSet, basename='etapas-produccion')
router.register('categorias', CategoriaProductoViewSet, basename='categorias-producto')

urlpatterns = [path('', include(router.urls))]