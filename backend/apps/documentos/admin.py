from django.contrib import admin
from .models import Documento, DocumentoDetalle

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ('numero_documento', 'tipo_documento', 'cliente', 'proveedor', 'total', 'estado_pago', 'fecha_emision')
    list_filter = ('tipo_documento', 'estado_pago', 'empresa')
    search_fields = ('numero_documento',)