from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'rut', 'email', 'telefono', 'tipo_cliente', 'activo')
    list_filter = ('tipo_cliente', 'activo', 'empresa')
    search_fields = ('nombre', 'rut', 'email')