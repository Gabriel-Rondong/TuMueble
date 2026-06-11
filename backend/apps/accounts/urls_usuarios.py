from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, RolViewSet, PermisoViewSet

router = DefaultRouter()
router.register('', UsuarioViewSet, basename='usuarios')

urlpatterns = [path('', include(router.urls))]
