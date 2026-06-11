from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Auditoria
from .serializers import AuditoriaSerializer
from apps.accounts.permissions import get_empresa_usuario, EsSuperusuarioPlataforma


class AuditoriaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditoriaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['modulo', 'accion', 'usuario']

    def get_queryset(self):
        user = self.request.user
        if user.es_superusuario_plataforma:
            return Auditoria.objects.all().order_by('-fecha')
        empresa = get_empresa_usuario(user)
        return Auditoria.objects.filter(empresa=empresa).order_by('-fecha')