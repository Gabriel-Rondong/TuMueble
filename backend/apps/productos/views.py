from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import CategoriaProducto, Producto, ProductoMaterial, EtapaProduccion
from .serializers import (CategoriaProductoSerializer, ProductoSerializer,
                          ProductoMaterialSerializer, EtapaProduccionSerializer)
from apps.accounts.permissions import get_empresa_usuario


class ProductoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['categoria', 'activo']
    search_fields = ['nombre', 'codigo', 'descripcion']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return Producto.objects.filter(empresa=empresa, eliminado=False).prefetch_related(
            'materiales_bom', 'etapas_producto'
        ).order_by('nombre')

    def perform_create(self, serializer):
        serializer.save(empresa=get_empresa_usuario(self.request.user))


class EtapaProduccionViewSet(viewsets.ModelViewSet):
    serializer_class = EtapaProduccionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return EtapaProduccion.objects.filter(empresa=empresa, activo=True).order_by('orden')

    def perform_create(self, serializer):
        serializer.save(empresa=get_empresa_usuario(self.request.user))


class CategoriaProductoViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaProductoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return CategoriaProducto.objects.filter(empresa=empresa, activo=True)

    def perform_create(self, serializer):
        serializer.save(empresa=get_empresa_usuario(self.request.user))