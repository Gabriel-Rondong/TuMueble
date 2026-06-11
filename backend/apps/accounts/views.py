from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario, Rol, Permiso, UsuarioEmpresa
from .serializers import (CustomTokenObtainPairSerializer, UsuarioSerializer,
                          UsuarioBasicoSerializer, RolSerializer, PermisoSerializer,
                          UsuarioEmpresaSerializer)
from .permissions import EsSuperusuarioPlataforma, EsAdminEmpresa, get_empresa_usuario


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — Retorna access + refresh token + datos de usuario."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class LogoutView(generics.GenericAPIView):
    """POST /api/auth/logout/ — Invalida el refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Sesión cerrada correctamente.'})
        except Exception:
            return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/me/ — Datos del usuario autenticado."""
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UsuarioViewSet(viewsets.ModelViewSet):
    """CRUD de usuarios. Solo admin de empresa."""
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsAdminEmpresa]

    def get_queryset(self):
        if self.request.user.es_superusuario_plataforma:
            return Usuario.objects.all().order_by('nombre')

        empresa = get_empresa_usuario(self.request.user)
        if not empresa:
            return Usuario.objects.none()

        usuario_ids = UsuarioEmpresa.objects.filter(
            empresa=empresa, activo=True
        ).values_list('usuario_id', flat=True)
        return Usuario.objects.filter(id__in=usuario_ids).order_by('nombre')

    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        usuario = self.get_object()
        usuario.is_active = True
        usuario.save()
        return Response({'detail': 'Usuario activado.'})

    @action(detail=True, methods=['post'])
    def desactivar(self, request, pk=None):
        usuario = self.get_object()
        usuario.is_active = False
        usuario.save()
        return Response({'detail': 'Usuario desactivado.'})

    @action(detail=True, methods=['post'])
    def resetear_password(self, request, pk=None):
        usuario = self.get_object()
        nueva_password = request.data.get('nueva_password')
        if not nueva_password or len(nueva_password) < 8:
            return Response({'detail': 'La contraseña debe tener al menos 8 caracteres.'}, status=400)
        usuario.set_password(nueva_password)
        usuario.save()
        return Response({'detail': 'Contraseña actualizada correctamente.'})


class RolViewSet(viewsets.ModelViewSet):
    serializer_class = RolSerializer
    permission_classes = [IsAuthenticated, EsAdminEmpresa]

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return Rol.objects.filter(empresa=empresa, activo=True)

    @action(detail=True, methods=['post'])
    def asignar_permisos(self, request, pk=None):
        from .models import RolPermiso
        rol = self.get_object()
        permiso_ids = request.data.get('permisos', [])
        RolPermiso.objects.filter(rol=rol).delete()
        for pid in permiso_ids:
            try:
                permiso = Permiso.objects.get(id=pid)
                RolPermiso.objects.create(rol=rol, permiso=permiso)
            except Permiso.DoesNotExist:
                pass
        return Response({'detail': f'{len(permiso_ids)} permisos asignados.'})


class PermisoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PermisoSerializer
    permission_classes = [IsAuthenticated]
    queryset = Permiso.objects.all().select_related('modulo')
