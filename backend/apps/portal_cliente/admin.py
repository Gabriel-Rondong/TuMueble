from django.contrib import admin
from .models import EstadoCliente, SeguimientoCliente

@admin.register(EstadoCliente)
class EstadoClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'empresa', 'orden', 'activo')
    list_editable = ('orden',)

@admin.register(SeguimientoCliente)
class SeguimientoAdmin(admin.ModelAdmin):
    list_display = ('orden', 'estado_cliente', 'avance_visible', 'visible', 'fecha_actualizacion')
    list_filter = ('visible',)