from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg, Q, F
from django.utils import timezone
from datetime import timedelta
from apps.accounts.permissions import get_empresa_usuario
from apps.produccion.models import OrdenProduccion, OrdenMaterialConsumido
from apps.bodega.models import Material, LoteMaterial, MovimientoBodega
from apps.costos.models import CostoOrden, IngresoOrden, NoConformidad
from apps.productos.models import Producto
from .exporters import exportar_excel, exportar_pdf_simple


class DashboardGerencialView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        hoy = timezone.now().date()
        inicio_mes = hoy.replace(day=1)
        inicio_año = hoy.replace(month=1, day=1)

        ordenes = OrdenProduccion.objects.filter(empresa=empresa, eliminado=False)
        activas = ordenes.exclude(estado_general__in=["cerrado", "cancelado"])

        ingresos_mes = IngresoOrden.objects.filter(
            orden__empresa=empresa, fecha__gte=inicio_mes
        ).aggregate(total=Sum("monto"))["total"] or 0

        costos_mes = CostoOrden.objects.filter(
            orden__empresa=empresa, fecha__gte=inicio_mes
        ).aggregate(total=Sum("monto"))["total"] or 0

        ingresos_año = IngresoOrden.objects.filter(
            orden__empresa=empresa, fecha__gte=inicio_año
        ).aggregate(total=Sum("monto"))["total"] or 0

        atrasadas = sum(1 for o in activas if o.esta_atrasado)
        materiales = Material.objects.filter(empresa=empresa, activo=True, eliminado=False)
        stock_critico = sum(1 for m in materiales if m.alerta_stock)

        # Órdenes por estado
        por_estado = list(activas.values("estado_general").annotate(total=Count("id")))

        # Merma del mes
        merma_mes = OrdenMaterialConsumido.objects.filter(
            orden__empresa=empresa,
            fecha_registro__date__gte=inicio_mes
        ).aggregate(total=Sum("merma"))["total"] or 0

        # Top 5 productos más vendidos (por cantidad de órdenes)
        top_productos = list(
            ordenes.exclude(estado_general="cancelado")
            .values("producto__nombre")
            .annotate(total=Count("id"))
            .order_by("-total")[:5]
        )

        return Response({
            "ordenes_activas": activas.count(),
            "ordenes_atrasadas": atrasadas,
            "ordenes_cerradas_mes": ordenes.filter(
                estado_general="cerrado",
                fecha_termino_real__date__gte=inicio_mes
            ).count(),
            "ingresos_mes": float(ingresos_mes),
            "costos_mes": float(costos_mes),
            "utilidad_mes": float(ingresos_mes - costos_mes),
            "margen_mes": round(
                ((ingresos_mes - costos_mes) / ingresos_mes * 100) if ingresos_mes else 0, 2
            ),
            "ingresos_año": float(ingresos_año),
            "stock_critico_count": stock_critico,
            "merma_mes_kg": float(merma_mes),
            "ordenes_por_estado": por_estado,
            "top_productos": top_productos,
            "no_conformidades_abiertas": NoConformidad.objects.filter(
                empresa=empresa, estado__in=["registrada", "en_proceso"]
            ).count(),
        })


class DashboardProduccionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        ordenes = OrdenProduccion.objects.filter(empresa=empresa, eliminado=False)
        activas = ordenes.exclude(estado_general__in=["cerrado", "cancelado"])

        atrasadas_list = [o for o in activas if o.esta_atrasado]

        return Response({
            "total_activas": activas.count(),
            "por_estado": list(activas.values("estado_general").annotate(total=Count("id"))),
            "por_prioridad": list(activas.values("prioridad").annotate(total=Count("id"))),
            "atrasadas": [
                {
                    "numero_orden": o.numero_orden,
                    "cliente": o.cliente.nombre if o.cliente else "",
                    "producto": o.producto.nombre if o.producto else "",
                    "etapa_actual": o.etapa_actual.nombre if o.etapa_actual else "",
                    "dias_restantes": o.dias_restantes,
                    "prioridad": o.prioridad,
                }
                for o in atrasadas_list[:10]
            ],
            "avance_promedio": float(
                activas.aggregate(avg=Avg("avance_porcentaje"))["avg"] or 0
            ),
        })


class DashboardBodegaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        materiales = Material.objects.filter(empresa=empresa, activo=True, eliminado=False)
        lotes = LoteMaterial.objects.filter(empresa=empresa, estado="activo")

        criticos = [m for m in materiales if m.alerta_stock]
        valor_stock = sum(
            float(l.cantidad_disponible * l.costo_unitario)
            for l in lotes
        )

        return Response({
            "total_materiales": materiales.count(),
            "stock_critico": len(criticos),
            "lotes_activos": lotes.count(),
            "valor_stock_estimado": round(valor_stock, 2),
            "materiales_criticos": [
                {
                    "id": m.id,
                    "nombre": m.nombre,
                    "sku": m.sku,
                    "stock_actual": float(m.stock_actual),
                    "stock_minimo": float(m.stock_minimo),
                    "unidad": m.unidad_medida.abreviatura if m.unidad_medida else "",
                }
                for m in criticos[:10]
            ],
        })


class DashboardFinanzasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        hoy = timezone.now().date()
        inicio_mes = hoy.replace(day=1)

        ordenes_empresa = {"orden__empresa": empresa}

        ingresos_mes = IngresoOrden.objects.filter(
            fecha__gte=inicio_mes, **ordenes_empresa
        ).aggregate(total=Sum("monto"))["total"] or 0

        costos_mes = CostoOrden.objects.filter(
            fecha__gte=inicio_mes, **ordenes_empresa
        ).aggregate(total=Sum("monto"))["total"] or 0

        # Evolución mensual últimos 6 meses
        evolucion = []
        for i in range(5, -1, -1):
            fecha = hoy.replace(day=1) - timedelta(days=i * 28)
            mes_inicio = fecha.replace(day=1)
            if fecha.month == 12:
                mes_fin = fecha.replace(year=fecha.year + 1, month=1, day=1)
            else:
                mes_fin = fecha.replace(month=fecha.month + 1, day=1)

            ing = IngresoOrden.objects.filter(
                fecha__gte=mes_inicio, fecha__lt=mes_fin, **ordenes_empresa
            ).aggregate(total=Sum("monto"))["total"] or 0
            cos = CostoOrden.objects.filter(
                fecha__gte=mes_inicio, fecha__lt=mes_fin, **ordenes_empresa
            ).aggregate(total=Sum("monto"))["total"] or 0

            evolucion.append({
                "mes": mes_inicio.strftime("%b %Y"),
                "ingresos": float(ing),
                "costos": float(cos),
                "utilidad": float(ing - cos),
            })

        return Response({
            "ingresos_mes": float(ingresos_mes),
            "costos_mes": float(costos_mes),
            "utilidad_mes": float(ingresos_mes - costos_mes),
            "margen_mes": round(
                (ingresos_mes - costos_mes) / ingresos_mes * 100 if ingresos_mes else 0, 2
            ),
            "evolucion_mensual": evolucion,
        })


class OrdenesAtrasadasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        ordenes = OrdenProduccion.objects.filter(
            empresa=empresa, eliminado=False
        ).exclude(estado_general__in=["cerrado", "cancelado"])

        atrasadas = [o for o in ordenes if o.esta_atrasado]
        data = [{
            "numero_orden": o.numero_orden,
            "cliente": o.cliente.nombre if o.cliente else "",
            "producto": o.producto.nombre if o.producto else "",
            "fecha_entrega_estimada": str(o.fecha_entrega_estimada),
            "dias_restantes": o.dias_restantes,
            "prioridad": o.prioridad,
            "estado": o.estado_general,
            "avance": float(o.avance_porcentaje),
        } for o in atrasadas]

        fmt = request.query_params.get("formato")
        if fmt == "excel":
            return exportar_excel(data, "Órdenes Atrasadas",
                ["numero_orden", "cliente", "producto", "fecha_entrega_estimada",
                 "dias_restantes", "prioridad", "estado"])
        if fmt == "pdf":
            return exportar_pdf_simple(data, "Órdenes Atrasadas",
                ["numero_orden", "cliente", "producto", "dias_restantes", "prioridad"])

        return Response(data)


class StockCriticoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        materiales = Material.objects.filter(empresa=empresa, activo=True, eliminado=False)
        criticos = [{
            "id": m.id,
            "nombre": m.nombre,
            "sku": m.sku,
            "stock_actual": float(m.stock_actual),
            "stock_minimo": float(m.stock_minimo),
            "unidad": m.unidad_medida.abreviatura if m.unidad_medida else "",
            "porcentaje": round(
                float(m.stock_actual) / float(m.stock_minimo) * 100
                if m.stock_minimo else 0, 1
            ),
            "proveedor": m.proveedor_principal.nombre if m.proveedor_principal else "",
        } for m in materiales if m.alerta_stock]

        fmt = request.query_params.get("formato")
        if fmt == "excel":
            return exportar_excel(criticos, "Stock Crítico",
                ["nombre", "sku", "stock_actual", "stock_minimo", "unidad", "proveedor"])
        return Response(criticos)


class RentabilidadProductosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        ordenes = OrdenProduccion.objects.filter(
            empresa=empresa, eliminado=False, estado_general="cerrado"
        ).select_related("producto")

        productos_data = {}
        for o in ordenes:
            if not o.producto:
                continue
            nombre = o.producto.nombre
            if nombre not in productos_data:
                productos_data[nombre] = {
                    "producto": nombre,
                    "ordenes": 0,
                    "ingresos": 0,
                    "costos": 0,
                    "utilidad": 0,
                }
            productos_data[nombre]["ordenes"] += 1
            productos_data[nombre]["ingresos"] += float(o.ingreso_total)
            productos_data[nombre]["costos"] += float(o.costo_real)
            productos_data[nombre]["utilidad"] += float(o.utilidad)

        result = sorted(
            [
                {**v, "margen": round(v["utilidad"] / v["ingresos"] * 100, 2) if v["ingresos"] else 0}
                for v in productos_data.values()
            ],
            key=lambda x: x["utilidad"], reverse=True
        )

        fmt = request.query_params.get("formato")
        if fmt == "excel":
            return exportar_excel(result, "Rentabilidad por Producto",
                ["producto", "ordenes", "ingresos", "costos", "utilidad", "margen"])
        if fmt == "pdf":
            return exportar_pdf_simple(result, "Rentabilidad por Producto",
                ["producto", "ordenes", "ingresos", "utilidad", "margen"])
        return Response(result)


class TrazabilidadOrdenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        numero_orden = request.query_params.get("numero_orden")
        if not numero_orden:
            return Response({"detail": "Parámetro numero_orden requerido."}, status=400)
        try:
            orden = OrdenProduccion.objects.get(empresa=empresa, numero_orden=numero_orden)
        except OrdenProduccion.DoesNotExist:
            return Response({"detail": "Orden no encontrada."}, status=404)

        return Response({
            "orden": {
                "numero_orden": orden.numero_orden,
                "cliente": orden.cliente.nombre if orden.cliente else "",
                "producto": orden.producto.nombre if orden.producto else "",
                "estado_general": orden.estado_general,
                "avance_porcentaje": float(orden.avance_porcentaje),
                "costo_estimado": float(orden.costo_estimado),
                "costo_real": float(orden.costo_real),
                "ingreso_total": float(orden.ingreso_total),
                "utilidad": float(orden.utilidad),
                "margen_porcentaje": float(orden.margen_porcentaje),
                "esta_atrasado": orden.esta_atrasado,
                "dias_restantes": orden.dias_restantes,
            },
            "etapas": [
                {
                    "etapa": e.etapa.nombre,
                    "estado": e.estado,
                    "responsable": e.responsable.nombre_completo if e.responsable else None,
                    "inicio": str(e.fecha_inicio) if e.fecha_inicio else None,
                    "termino": str(e.fecha_termino) if e.fecha_termino else None,
                    "observaciones": e.observaciones,
                }
                for e in orden.etapas_orden.all().order_by("etapa__orden")
            ],
            "materiales_consumidos": list(
                orden.materiales_consumidos.values(
                    "material__nombre", "cantidad_consumida",
                    "costo_unitario", "subtotal", "merma",
                    "lote__numero_lote"
                )
            ),
            "historial_estados": list(
                orden.historial_estados.values(
                    "estado_anterior", "estado_nuevo", "fecha", "observacion"
                ).order_by("fecha")
            ),
            "no_conformidades": list(
                NoConformidad.objects.filter(orden=orden).values(
                    "tipo", "gravedad", "descripcion", "estado", "costo_asociado"
                )
            ),
        })


class TrazabilidadLoteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        numero_lote = request.query_params.get("numero_lote")
        if not numero_lote:
            return Response({"detail": "Parámetro numero_lote requerido."}, status=400)
        try:
            lote = LoteMaterial.objects.get(empresa=empresa, numero_lote=numero_lote)
        except LoteMaterial.DoesNotExist:
            return Response({"detail": "Lote no encontrado."}, status=404)

        consumos = OrdenMaterialConsumido.objects.filter(lote=lote).select_related("orden", "orden__cliente", "orden__producto")

        return Response({
            "lote": {
                "numero_lote": lote.numero_lote,
                "material": lote.material.nombre,
                "proveedor": lote.proveedor.nombre if lote.proveedor else "",
                "fecha_ingreso": str(lote.fecha_ingreso),
                "cantidad_inicial": float(lote.cantidad_inicial),
                "cantidad_disponible": float(lote.cantidad_disponible),
                "costo_unitario": float(lote.costo_unitario),
                "estado": lote.estado,
                "ubicacion": lote.ubicacion.nombre if lote.ubicacion else "",
            },
            "ordenes_donde_se_uso": [
                {
                    "numero_orden": c.orden.numero_orden,
                    "cliente": c.orden.cliente.nombre if c.orden.cliente else "",
                    "producto": c.orden.producto.nombre if c.orden.producto else "",
                    "cantidad_consumida": float(c.cantidad_consumida),
                    "fecha": str(c.fecha_registro),
                }
                for c in consumos
            ],
        })


class NoConformidadesResumenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        empresa = get_empresa_usuario(request.user)
        nc = NoConformidad.objects.filter(empresa=empresa)

        return Response({
            "total": nc.count(),
            "por_estado": list(nc.values("estado").annotate(total=Count("id"))),
            "por_gravedad": list(nc.values("gravedad").annotate(total=Count("id"))),
            "por_tipo": list(nc.values("tipo").annotate(total=Count("id"))),
            "costo_total": float(nc.aggregate(total=Sum("costo_asociado"))["total"] or 0),
            "por_proveedor": list(
                nc.exclude(proveedor=None)
                .values("proveedor__nombre")
                .annotate(total=Count("id"))
                .order_by("-total")[:5]
            ),
            "por_etapa": list(
                nc.exclude(etapa=None)
                .values("etapa__nombre")
                .annotate(total=Count("id"))
                .order_by("-total")[:5]
            ),
        })