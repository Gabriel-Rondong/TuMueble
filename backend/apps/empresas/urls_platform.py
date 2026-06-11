from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmpresaViewSet, ModuloSistemaViewSet, EmpresaModuloViewSet

router = DefaultRouter()
router.register('empresas', EmpresaViewSet, basename='platform-empresas')
router.register('modulos', ModuloSistemaViewSet, basename='platform-modulos')
router.register('empresa-modulos', EmpresaModuloViewSet, basename='platform-empresa-modulos')

urlpatterns = [path('', include(router.urls))]