from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, F
from .models import (CategoriaMaterial, UnidadMedida, Material,
                     UbicacionBodega, LoteMaterial, MovimientoBodega,
                     MovimientoBodegaDetalle)
from .serializers import (CategoriaMaterialSerializer, UnidadMedidaSerializer,
                          MaterialSerializer, UbicacionBodegaSerializer,
                          LoteMaterialSerializer, MovimientoBodegaSerializer)
from apps.accounts.permissions import get_empresa_usuario


class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['categoria', 'activo']
    search_fields = ['nombre', 'sku', 'descripcion']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return Material.objects.filter(empresa=empresa, eliminado=False).select_related(
            'categoria', 'unidad_medida', 'proveedor_principal'
        ).order_by('nombre')

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        serializer.save(empresa=empresa)

    @action(detail=False, methods=['get'])
    def stock_critico(self, request):
        empresa = get_empresa_usuario(request.user)
        materiales = Material.objects.filter(empresa=empresa, eliminado=False, activo=True)
        criticos = [m for m in materiales if m.alerta_stock]
        data = MaterialSerializer(criticos, many=True).data
        return Response(data)

    @action(detail=False, methods=['get'])
    def alertas(self, request):
        return self.stock_critico(request)


class LoteMaterialViewSet(viewsets.ModelViewSet):
    serializer_class = LoteMaterialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['material', 'proveedor', 'estado']
    search_fields = ['numero_lote']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return LoteMaterial.objects.filter(empresa=empresa).select_related(
            'material', 'proveedor', 'ubicacion'
        ).order_by('-fecha_ingreso')

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        lote = serializer.save(empresa=empresa)
        # Actualizar cantidad disponible del material al ingresar lote
        return lote


class MovimientoBodegaViewSet(viewsets.ModelViewSet):
    serializer_class = MovimientoBodegaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo_movimiento', 'estado']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return MovimientoBodega.objects.filter(empresa=empresa).order_by('-creado_en')

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        serializer.save(empresa=empresa, usuario=self.request.user)


class CategoriaMaterialViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaMaterialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return CategoriaMaterial.objects.filter(empresa=empresa, activo=True)

    def perform_create(self, serializer):
        serializer.save(empresa=get_empresa_usuario(self.request.user))


class UbicacionBodegaViewSet(viewsets.ModelViewSet):
    serializer_class = UbicacionBodegaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return UbicacionBodega.objects.filter(empresa=empresa, activo=True)

    def perform_create(self, serializer):
        serializer.save(empresa=get_empresa_usuario(self.request.user))


class UnidadMedidaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UnidadMedidaSerializer
    permission_classes = [IsAuthenticated]
    queryset = UnidadMedida.objects.all()