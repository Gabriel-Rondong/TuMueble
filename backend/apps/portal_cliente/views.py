from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from apps.produccion.models import OrdenProduccion
from .models import SeguimientoCliente


MAPA_ESTADOS_INTERNOS = {
    'pedido_recibido': {'visible': 'Pedido recibido', 'orden': 1},
    'materiales_pendientes': {'visible': 'Materiales en preparación', 'orden': 2},
    'materiales_preparados': {'visible': 'Materiales en preparación', 'orden': 2},
    'en_produccion': {'visible': 'En fabricación', 'orden': 3},
    'en_terminaciones': {'visible': 'En terminaciones', 'orden': 4},
    'control_calidad': {'visible': 'En revisión de calidad', 'orden': 5},
    'listo_despacho': {'visible': 'Listo para despacho', 'orden': 6},
    'despachado': {'visible': 'En camino', 'orden': 7},
    'instalado': {'visible': 'Entregado', 'orden': 8},
    'cerrado': {'visible': 'Entregado', 'orden': 8},
}


class ConsultarOrdenView(APIView):
    """POST /api/cliente/consultar-orden/ — Validar acceso con número de orden + código."""
    permission_classes = [AllowAny]

    def post(self, request):
        numero_orden = request.data.get('numero_orden', '').strip()
        codigo = request.data.get('codigo', '').strip()

        if not numero_orden or not codigo:
            return Response(
                {'detail': 'Debes ingresar el número de orden y el código de seguimiento.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            orden = OrdenProduccion.objects.get(
                numero_orden=numero_orden,
                codigo_seguimiento=codigo,
                eliminado=False
            )
        except OrdenProduccion.DoesNotExist:
            return Response(
                {'detail': 'No encontramos ningún pedido con esos datos. Verifica el número de orden y el código.'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            'token': str(orden.token_cliente),
            'numero_orden': orden.numero_orden,
        })


class EstadoOrdenClienteView(APIView):
    """GET /api/cliente/orden/{token}/ — Estado visible del pedido para el cliente."""
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            orden = OrdenProduccion.objects.get(token_cliente=token, eliminado=False)
        except OrdenProduccion.DoesNotExist:
            return Response({'detail': 'Pedido no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        estado_info = MAPA_ESTADOS_INTERNOS.get(orden.estado_general, {'visible': 'En proceso', 'orden': 1})

        # Línea de tiempo para cliente
        estados_timeline = [
            {'nombre': 'Pedido recibido', 'orden': 1, 'completado': True},
            {'nombre': 'Materiales en preparación', 'orden': 2, 'completado': estado_info['orden'] >= 2},
            {'nombre': 'En fabricación', 'orden': 3, 'completado': estado_info['orden'] >= 3},
            {'nombre': 'En terminaciones', 'orden': 4, 'completado': estado_info['orden'] >= 4},
            {'nombre': 'En revisión de calidad', 'orden': 5, 'completado': estado_info['orden'] >= 5},
            {'nombre': 'Listo para despacho', 'orden': 6, 'completado': estado_info['orden'] >= 6},
            {'nombre': 'Entregado', 'orden': 7, 'completado': estado_info['orden'] >= 8},
        ]

        # Último mensaje público
        ultimo_seguimiento = SeguimientoCliente.objects.filter(
            orden=orden, visible=True
        ).first()

        data = {
            'numero_orden': orden.numero_orden,
            'cliente_nombre': orden.cliente.nombre if orden.cliente else '',
            'producto_nombre': orden.producto.nombre if orden.producto else '',
            'estado_visible': estado_info['visible'],
            'avance_porcentaje': float(orden.avance_porcentaje),
            'fecha_entrega_estimada': orden.fecha_entrega_estimada,
            'timeline': estados_timeline,
            'mensaje': ultimo_seguimiento.mensaje if ultimo_seguimiento else '',
            'imagen_publica': request.build_absolute_uri(
                ultimo_seguimiento.imagen_publica.url
            ) if ultimo_seguimiento and ultimo_seguimiento.imagen_publica else None,
        }
        return Response(data)
