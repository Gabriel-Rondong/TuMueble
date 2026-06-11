from django.contrib import admin
from .models import (CategoriaMaterial, UnidadMedida, Material,
                     UbicacionBodega, LoteMaterial, MovimientoBodega, MovimientoBodegaDetalle)


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'sku', 'categoria', 'stock_actual', 'stock_minimo', 'activo')
    list_filter = ('categoria', 'activo', 'empresa')
    search_fields = ('nombre', 'sku')


@admin.register(LoteMaterial)
class LoteAdmin(admin.ModelAdmin):
    list_display = ('numero_lote', 'material', 'proveedor', 'cantidad_disponible', 'costo_unitario', 'estado')
    list_filter = ('estado', 'proveedor')


@admin.register(MovimientoBodega)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('tipo_movimiento', 'estado', 'usuario', 'creado_en')
    list_filter = ('tipo_movimiento', 'estado')


admin.site.register(CategoriaMaterial)
admin.site.register(UnidadMedida)
admin.site.register(UbicacionBodega)