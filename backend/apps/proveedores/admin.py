from django.contrib import admin
from .models import Proveedor

@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'rut', 'email', 'telefono', 'activo')
    list_filter = ('activo', 'empresa')
    search_fields = ('nombre', 'rut', 'giro')