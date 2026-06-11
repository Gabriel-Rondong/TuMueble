from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Usuario
from .serializers import UsuarioSerializer, UsuarioCreateSerializer
from apps.permisos.models import UsuarioEmpresa


class UsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.es_superusuario_plataforma:
            return Usuario.objects.all()
        # Admin de empresa: ve usuarios de su empresa
        empresa_id = self.request.query_params.get('empresa_id')
        if empresa_id:
            ids = UsuarioEmpresa.objects.filter(
                empresa_id=empresa_id, activo=True
            ).values_list('usuario_id', flat=True)
            return Usuario.objects.filter(id__in=ids)
        return Usuario.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioSerializer

    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'mensaje': f'Usuario {user.email} activado.'})

    @action(detail=True, methods=['post'])
    def desactivar(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'mensaje': f'Usuario {user.email} desactivado.'})
