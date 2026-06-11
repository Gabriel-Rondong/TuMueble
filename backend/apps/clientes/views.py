from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import Cliente
from .serializers import ClienteSerializer
from apps.accounts.permissions import get_empresa_usuario


class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['activo', 'tipo_cliente']
    search_fields = ['nombre', 'rut', 'email', 'telefono']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return Cliente.objects.filter(empresa=empresa, activo=True).order_by('nombre')

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        serializer.save(empresa=empresa, creado_por=self.request.user)