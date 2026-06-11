from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Empresa, ModuloSistema, EmpresaModulo
from .serializers import EmpresaSerializer, ModuloSistemaSerializer, EmpresaModuloSerializer
from apps.accounts.permissions import EsSuperusuarioPlataforma, EsAdminEmpresa, get_empresa_usuario


class EmpresaViewSet(viewsets.ModelViewSet):
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated, EsAdminEmpresa]

    def get_queryset(self):
        user = self.request.user
        if user.es_superusuario_plataforma:
            return Empresa.objects.all()
        empresa = get_empresa_usuario(user)
        return Empresa.objects.filter(id=empresa.id) if empresa else Empresa.objects.none()

    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        empresa = self.get_object()
        empresa.estado = 'activa'
        empresa.save()
        return Response({'detail': 'Empresa activada.'})

    @action(detail=True, methods=['post'])
    def desactivar(self, request, pk=None):
        empresa = self.get_object()
        empresa.estado = 'inactiva'
        empresa.save()
        return Response({'detail': 'Empresa desactivada.'})


class ModuloSistemaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ModuloSistemaSerializer
    permission_classes = [IsAuthenticated]
    queryset = ModuloSistema.objects.filter(activo=True)


class EmpresaModuloViewSet(viewsets.ModelViewSet):
    serializer_class = EmpresaModuloSerializer
    permission_classes = [IsAuthenticated, EsSuperusuarioPlataforma]

    def get_queryset(self):
        empresa_id = self.request.query_params.get('empresa')
        qs = EmpresaModulo.objects.all()
        if empresa_id:
            qs = qs.filter(empresa_id=empresa_id)
        return qs