from .models import Auditoria


class AuditoriaMiddleware:
    """
    Middleware que adjunta el usuario autenticado al request
    para facilitar el registro de auditoría en las vistas.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response


def registrar_auditoria(request, modulo, accion, tabla='', registro_id=None,
                        valor_anterior=None, valor_nuevo=None, descripcion=''):
    """Helper para registrar auditoría desde cualquier vista."""
    usuario = getattr(request, 'user', None)
    empresa = None

    if usuario and hasattr(usuario, 'empresas_usuario'):
        ue = usuario.empresas_usuario.filter(activo=True).first()
        if ue:
            empresa = ue.empresa

    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

    Auditoria.objects.create(
        empresa=empresa,
        usuario=usuario if usuario and usuario.is_authenticated else None,
        modulo=modulo,
        accion=accion,
        tabla_afectada=tabla,
        registro_id=registro_id,
        valor_anterior=valor_anterior,
        valor_nuevo=valor_nuevo,
        descripcion=descripcion,
        ip=ip,
        user_agent=request.META.get('HTTP_USER_AGENT', '')[:300],
    )
