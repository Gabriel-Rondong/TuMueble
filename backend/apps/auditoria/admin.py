from django.contrib import admin
from .models import Auditoria

@admin.register(Auditoria)
class AuditoriaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'modulo', 'accion', 'tabla_afectada', 'ip', 'fecha')
    list_filter = ('modulo', 'accion')
    readonly_fields = ('usuario', 'modulo', 'accion', 'tabla_afectada', 'registro_id',
                       'valor_anterior', 'valor_nuevo', 'ip', 'fecha')
    search_fields = ('usuario__email', 'modulo', 'accion')