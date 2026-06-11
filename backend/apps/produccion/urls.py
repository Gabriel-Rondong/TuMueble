from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrdenProduccionViewSet

router = DefaultRouter()
router.register('ordenes', OrdenProduccionViewSet, basename='ordenes')

urlpatterns = [path('', include(router.urls))]
