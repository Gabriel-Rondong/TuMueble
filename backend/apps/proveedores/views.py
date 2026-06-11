from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from .models import Proveedor
from .serializers import ProveedorSerializer
from apps.accounts.permissions import get_empresa_usuario


class ProveedorViewSet(viewsets.ModelViewSet):
    serializer_class = ProveedorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['nombre', 'rut', 'giro']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return Proveedor.objects.filter(empresa=empresa, eliminado=False).order_by('nombre')

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        serializer.save(empresa=empresa)