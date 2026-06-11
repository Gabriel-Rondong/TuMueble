from django.contrib import admin
from .models import CostoOrden, IngresoOrden, NoConformidad

@admin.register(CostoOrden)
class CostoAdmin(admin.ModelAdmin):
    list_display = ('orden', 'tipo_costo', 'monto', 'fecha')
    list_filter = ('tipo_costo',)

@admin.register(IngresoOrden)
class IngresoAdmin(admin.ModelAdmin):
    list_display = ('orden', 'tipo_ingreso', 'monto', 'metodo_pago', 'fecha')

@admin.register(NoConformidad)
class NoConformidadAdmin(admin.ModelAdmin):
    list_display = ('orden', 'tipo', 'gravedad', 'estado', 'costo_asociado', 'fecha_registro')
    list_filter = ('tipo', 'gravedad', 'estado')