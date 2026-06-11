"""
Endpoint para generar QR de seguimiento del pedido por el cliente.
"""
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .models import OrdenProduccion
from apps.accounts.permissions import get_empresa_usuario


class QROrdenView(APIView):
    """GET /api/produccion/ordenes/{id}/qr/ — Genera imagen QR del enlace de seguimiento."""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        empresa = get_empresa_usuario(request.user)
        try:
            orden = OrdenProduccion.objects.get(pk=pk, empresa=empresa)
        except OrdenProduccion.DoesNotExist:
            return HttpResponse("Orden no encontrada", status=404)

        try:
            import qrcode
            import io
            base_url = request.build_absolute_uri("/").rstrip("/")
            url = f"{base_url}/mi-pedido/{orden.token_cliente}"
            img = qrcode.make(url)
            buffer = io.BytesIO()
            img.save(buffer, format="PNG")
            buffer.seek(0)
            response = HttpResponse(buffer.getvalue(), content_type="image/png")
            response["Content-Disposition"] = f'inline; filename="qr_orden_{orden.numero_orden}.png"'
            return response
        except ImportError:
            return HttpResponse("qrcode no instalado. Ejecuta: pip install qrcode[pil]", status=500)