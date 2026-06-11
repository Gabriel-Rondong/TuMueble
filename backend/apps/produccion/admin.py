from django.contrib import admin
from .models import (OrdenProduccion, OrdenEtapa, OrdenMaterialReservado,
                     OrdenMaterialConsumido, HistorialEstadoOrden)


@admin.register(OrdenProduccion)
class OrdenAdmin(admin.ModelAdmin):
    list_display = ('numero_orden', 'cliente', 'producto', 'estado_general', 'prioridad',
                    'avance_porcentaje', 'fecha_entrega_estimada', 'esta_atrasado')
    list_filter = ('estado_general', 'prioridad', 'empresa')
    search_fields = ('numero_orden', 'cliente__nombre', 'producto__nombre')
    readonly_fields = ('numero_orden', 'token_cliente', 'codigo_seguimiento')


@admin.register(OrdenEtapa)
class OrdenEtapaAdmin(admin.ModelAdmin):
    list_display = ('orden', 'etapa', 'responsable', 'estado', 'fecha_inicio', 'fecha_termino')
    list_filter = ('estado', 'etapa')


admin.site.register(HistorialEstadoOrden)