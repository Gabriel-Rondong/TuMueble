from rest_framework.permissions import BasePermission
from .models import UsuarioEmpresa


class EsSuperusuarioPlataforma(BasePermission):
    """Solo superusuarios de plataforma."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and
                    request.user.es_superusuario_plataforma)


class EsAdminEmpresa(BasePermission):
    """Administradores de empresa o superusuario de plataforma."""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.es_superusuario_plataforma:
            return True
        return UsuarioEmpresa.objects.filter(
            usuario=request.user,
            rol__codigo='administrador',
            activo=True
        ).exists()


class TienePermiso(BasePermission):
    """
    Permiso genérico que verifica si el usuario tiene un permiso específico.
    Uso: permission_classes = [TienePermiso]
    Se puede combinar con required_permissions en la vista.
    """
    required_permissions = []

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.es_superusuario_plataforma:
            return True

        required = getattr(view, 'required_permissions', [])
        if not required:
            return True

        # Obtener permisos del usuario via rol
        ue = UsuarioEmpresa.objects.filter(
            usuario=request.user, activo=True
        ).select_related('rol').first()

        if not ue:
            return False

        user_perms = set(
            ue.rol.permisos_rol.values_list('permiso__codigo', flat=True)
        )
        return all(p in user_perms for p in required)


def get_empresa_usuario(user):
    """Retorna la empresa activa del usuario."""
    ue = UsuarioEmpresa.objects.filter(usuario=user, activo=True).select_related('empresa').first()
    return ue.empresa if ue else None


def get_rol_usuario(user):
    """Retorna el rol del usuario en su empresa activa."""
    ue = UsuarioEmpresa.objects.filter(usuario=user, activo=True).select_related('rol').first()
    return ue.rol if ue else None
