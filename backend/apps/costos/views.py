from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import CostoOrden, IngresoOrden, NoConformidad
from .serializers import CostoOrdenSerializer, IngresoOrdenSerializer, NoConformidadSerializer
from apps.accounts.permissions import get_empresa_usuario


class CostoOrdenViewSet(viewsets.ModelViewSet):
    serializer_class = CostoOrdenSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['orden', 'tipo_costo']

    def get_queryset(self):
        return CostoOrden.objects.filter(orden__empresa=self._empresa()).order_by('-creado_en')

    def _empresa(self):
        return get_empresa_usuario(self.request.user)

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)


class IngresoOrdenViewSet(viewsets.ModelViewSet):
    serializer_class = IngresoOrdenSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['orden', 'tipo_ingreso']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return IngresoOrden.objects.filter(orden__empresa=empresa).order_by('-creado_en')

    def perform_create(self, serializer):
        serializer.save(registrado_por=self.request.user)


class NoConformidadViewSet(viewsets.ModelViewSet):
    serializer_class = NoConformidadSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['orden', 'tipo', 'gravedad', 'estado']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return NoConformidad.objects.filter(empresa=empresa).order_by('-fecha_registro')

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        serializer.save(empresa=empresa, registrado_por=self.request.user)