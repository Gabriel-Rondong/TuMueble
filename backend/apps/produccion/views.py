from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (OrdenProduccion, OrdenEtapa, OrdenMaterialConsumido,
                     OrdenMaterialReservado, HistorialEstadoOrden)
from .serializers import (OrdenProduccionListSerializer, OrdenProduccionDetalleSerializer,
                          OrdenProduccionCreateSerializer)
from .filters import OrdenProduccionFilter
from apps.accounts.permissions import get_empresa_usuario
from apps.auditoria.middleware import registrar_auditoria


class OrdenProduccionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = OrdenProduccionFilter
    search_fields = ["numero_orden", "cliente__nombre", "producto__nombre", "codigo_seguimiento"]
    ordering_fields = ["fecha_creacion", "fecha_entrega_estimada", "prioridad", "avance_porcentaje"]
    ordering = ["-fecha_creacion"]

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        qs = OrdenProduccion.objects.filter(
            empresa=empresa, eliminado=False
        ).select_related("cliente", "producto", "etapa_actual", "responsable", "creado_por")
        # Operarios solo ven sus órdenes
        if self.request.query_params.get("mis_ordenes"):
            qs = qs.filter(etapas_orden__responsable=self.request.user).distinct()
        return qs

    def get_serializer_class(self):
        if self.action == "list":
            return OrdenProduccionListSerializer
        if self.action == "create":
            return OrdenProduccionCreateSerializer
        return OrdenProduccionDetalleSerializer

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        ultimo = OrdenProduccion.objects.filter(empresa=empresa).count()
        numero_orden = f"{empresa.id:02d}-{(ultimo + 1):05d}"
        orden = serializer.save(
            empresa=empresa,
            creado_por=self.request.user,
            numero_orden=numero_orden,
        )
        # Crear etapas automáticamente desde el producto
        if orden.producto:
            from apps.productos.models import ProductoEtapa
            for pe in ProductoEtapa.objects.filter(producto=orden.producto).order_by("orden"):
                OrdenEtapa.objects.create(orden=orden, etapa=pe.etapa, estado="pendiente")
        registrar_auditoria(self.request, "Producción", "crear",
                            "ordenes_produccion", orden.id, None,
                            {"numero_orden": orden.numero_orden})

    def perform_update(self, serializer):
        orden = serializer.save(actualizado_por=self.request.user)
        registrar_auditoria(self.request, "Producción", "editar",
                            "ordenes_produccion", orden.id)

    @action(detail=True, methods=["post"])
    def cambiar_estado(self, request, pk=None):
        orden = self.get_object()
        nuevo_estado = request.data.get("estado")
        observacion = request.data.get("observacion", "")
        if nuevo_estado not in dict(OrdenProduccion.ESTADOS):
            return Response({"detail": "Estado inválido."}, status=400)
        estado_anterior = orden.estado_general
        orden.estado_general = nuevo_estado
        orden.actualizado_por = request.user
        if nuevo_estado == "en_produccion" and not orden.fecha_inicio:
            orden.fecha_inicio = timezone.now()
        if nuevo_estado in ["cerrado", "instalado", "despachado"]:
            orden.fecha_termino_real = timezone.now()
        orden.save()
        registrar_auditoria(request, "Producción", "cambiar_estado",
                            "ordenes_produccion", orden.id,
                            {"estado": estado_anterior}, {"estado": nuevo_estado, "obs": observacion})
        return Response({"detail": f"Estado actualizado a: {nuevo_estado}"})

    @action(detail=True, methods=["post"])
    def iniciar_etapa(self, request, pk=None):
        orden = self.get_object()
        etapa_id = request.data.get("etapa_id")
        try:
            orden_etapa = OrdenEtapa.objects.get(orden=orden, etapa_id=etapa_id)
            orden_etapa.iniciar(request.user)
            orden.etapa_actual = orden_etapa.etapa
            orden.save(update_fields=["etapa_actual"])
            return Response({"detail": "Etapa iniciada correctamente."})
        except OrdenEtapa.DoesNotExist:
            return Response({"detail": "Etapa no encontrada."}, status=404)

    @action(detail=True, methods=["post"])
    def finalizar_etapa(self, request, pk=None):
        orden = self.get_object()
        etapa_id = request.data.get("etapa_id")
        observaciones = request.data.get("observaciones", "")
        try:
            orden_etapa = OrdenEtapa.objects.get(orden=orden, etapa_id=etapa_id)
            orden_etapa.observaciones = observaciones
            orden_etapa.finalizar(request.user)
            # Pasar a siguiente etapa si existe
            siguiente = OrdenEtapa.objects.filter(
                orden=orden, estado="pendiente",
                etapa__orden__gt=orden_etapa.etapa.orden
            ).order_by("etapa__orden").first()
            if siguiente:
                orden.etapa_actual = siguiente.etapa
                orden.save(update_fields=["etapa_actual"])
            return Response({"detail": "Etapa completada."})
        except OrdenEtapa.DoesNotExist:
            return Response({"detail": "Etapa no encontrada."}, status=404)

    @action(detail=True, methods=["post"])
    def consumir_material(self, request, pk=None):
        orden = self.get_object()
        data = request.data
        consumo = OrdenMaterialConsumido.objects.create(
            orden=orden,
            etapa_id=data.get("etapa_id"),
            material_id=data["material_id"],
            lote_id=data.get("lote_id"),
            cantidad_consumida=data["cantidad_consumida"],
            costo_unitario=data.get("costo_unitario", 0),
            merma=data.get("merma", 0),
            registrado_por=request.user,
        )
        return Response({"detail": "Consumo registrado.", "id": consumo.id})

    @action(detail=True, methods=["get"])
    def trazabilidad(self, request, pk=None):
        orden = self.get_object()
        return Response({
            "orden": {
                "numero_orden": orden.numero_orden,
                "estado_general": orden.estado_general,
                "avance_porcentaje": float(orden.avance_porcentaje),
                "costo_real": float(orden.costo_real),
                "ingreso_total": float(orden.ingreso_total),
                "utilidad": float(orden.utilidad),
                "esta_atrasado": orden.esta_atrasado,
            },
            "etapas": [
                {
                    "etapa": e.etapa.nombre,
                    "estado": e.estado,
                    "responsable": e.responsable.nombre_completo if e.responsable else None,
                    "inicio": str(e.fecha_inicio) if e.fecha_inicio else None,
                    "termino": str(e.fecha_termino) if e.fecha_termino else None,
                }
                for e in orden.etapas_orden.all().order_by("etapa__orden")
            ],
            "materiales_consumidos": list(
                orden.materiales_consumidos.values(
                    "material__nombre", "cantidad_consumida",
                    "costo_unitario", "subtotal", "merma", "lote__numero_lote"
                )
            ),
            "historial_estados": list(
                orden.historial_estados.values(
                    "estado_anterior", "estado_nuevo", "fecha", "observacion"
                ).order_by("fecha")
            ),
        })

    @action(detail=True, methods=["post"])
    def reportar_problema(self, request, pk=None):
        orden = self.get_object()
        from apps.costos.models import NoConformidad
        nc = NoConformidad.objects.create(
            empresa=orden.empresa,
            orden=orden,
            producto=orden.producto,
            etapa_id=request.data.get("etapa_id"),
            descripcion=request.data.get("descripcion", ""),
            tipo=request.data.get("tipo", "error_proceso"),
            gravedad=request.data.get("gravedad", "media"),
            registrado_por=request.user,
        )
        return Response({"detail": "Problema registrado.", "id": nc.id})