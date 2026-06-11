from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentoViewSet

router = DefaultRouter()
router.register('', DocumentoViewSet, basename='documentos')
urlpatterns = [path('', include(router.urls))]