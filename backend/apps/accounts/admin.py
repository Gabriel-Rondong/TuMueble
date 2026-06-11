from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario, Rol, Permiso, RolPermiso, UsuarioEmpresa


@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    list_display = ('email', 'nombre', 'apellido', 'es_superusuario_plataforma', 'is_active', 'ultimo_acceso')
    list_filter = ('is_active', 'es_superusuario_plataforma', 'is_staff')
    search_fields = ('email', 'nombre', 'apellido')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': ('nombre', 'apellido', 'telefono', 'avatar')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'es_superusuario_plataforma', 'groups', 'user_permissions')}),
        ('Fechas', {'fields': ('last_login', 'ultimo_acceso')}),
    )
    add_fieldsets = (
        (None, {'classes': ('wide',), 'fields': ('email', 'nombre', 'apellido', 'password1', 'password2')}),
    )


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'empresa', 'es_rol_sistema', 'activo')
    list_filter = ('es_rol_sistema', 'activo')
    search_fields = ('nombre', 'empresa__nombre')


@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre', 'accion', 'modulo')
    list_filter = ('accion', 'modulo')
    search_fields = ('codigo', 'nombre')


@admin.register(UsuarioEmpresa)
class UsuarioEmpresaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'empresa', 'rol', 'activo', 'creado_en')
    list_filter = ('activo', 'empresa')
    search_fields = ('usuario__email', 'empresa__nombre')