from django.contrib import admin
from .models import Empresa, ModuloSistema, EmpresaModulo


@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'rut', 'estado', 'plan', 'fecha_inicio')
    list_filter = ('estado', 'plan')
    search_fields = ('nombre', 'rut')


@admin.register(ModuloSistema)
class ModuloSistemaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'orden', 'activo')
    list_editable = ('activo', 'orden')


@admin.register(EmpresaModulo)
class EmpresaModuloAdmin(admin.ModelAdmin):
    list_display = ('empresa', 'modulo', 'habilitado')
    list_filter = ('habilitado', 'empresa')