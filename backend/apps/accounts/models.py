from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('es_superusuario_plataforma', True)
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Usuario personalizado del sistema TuMueble.
    es_superusuario_plataforma: acceso al Panel Superadmin (nivel SaaS).
    Los demás usuarios se asocian a empresas mediante UsuarioEmpresa.
    """
    email = models.EmailField(unique=True, verbose_name='Email')
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    apellido = models.CharField(max_length=100, verbose_name='Apellido')
    telefono = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # Flags de estado
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    es_superusuario_plataforma = models.BooleanField(
        default=False,
        help_text='Acceso total al Panel de Plataforma SaaS'
    )

    # Auditoría
    ultimo_acceso = models.DateTimeField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido']

    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['nombre', 'apellido']

    def __str__(self):
        return f'{self.nombre} {self.apellido} <{self.email}>'

    @property
    def nombre_completo(self):
        return f'{self.nombre} {self.apellido}'


class UsuarioEmpresa(models.Model):
    """
    Relación entre usuario, empresa y rol.
    Un usuario puede pertenecer a múltiples empresas con distintos roles.
    """
    usuario = models.ForeignKey('accounts.Usuario', on_delete=models.CASCADE, related_name='empresas_usuario')
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, related_name='usuarios_empresa')
    rol = models.ForeignKey('accounts.Rol', on_delete=models.SET_NULL, null=True, related_name='usuarios_rol')
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    creado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, related_name='creaciones_usuario_empresa')

    class Meta:
        db_table = 'usuario_empresa'
        unique_together = ('usuario', 'empresa')
        verbose_name = 'Usuario de Empresa'
        verbose_name_plural = 'Usuarios de Empresa'

    def __str__(self):
        return f'{self.usuario.nombre_completo} → {self.empresa.nombre} [{self.rol}]'


class Rol(models.Model):
    """
    Roles por empresa. Pueden ser roles de sistema (predefinidos) o personalizados.
    """
    ROLES_SISTEMA = [
        ('administrador', 'Administrador'),
        ('gerente', 'Gerente'),
        ('bodega', 'Encargado de Bodega'),
        ('produccion', 'Encargado de Producción'),
        ('operario', 'Operario de Proceso'),
        ('ventas', 'Ventas'),
        ('finanzas', 'Finanzas'),
        ('solo_lectura', 'Solo Lectura'),
    ]

    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, related_name='roles', null=True, blank=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    codigo = models.CharField(max_length=50, blank=True, help_text='Código único para roles de sistema')
    es_rol_sistema = models.BooleanField(default=False, help_text='Rol predefinido, no editable')
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'roles'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.nombre


class Permiso(models.Model):
    """
    Permisos granulares por módulo y acción.
    """
    ACCIONES = [
        ('ver', 'Ver'),
        ('crear', 'Crear'),
        ('editar', 'Editar'),
        ('eliminar', 'Eliminar'),
        ('aprobar', 'Aprobar'),
        ('exportar', 'Exportar'),
        ('anular', 'Anular'),
        ('cerrar', 'Cerrar'),
        ('administrar', 'Administrar'),
    ]

    modulo = models.ForeignKey('empresas.ModuloSistema', on_delete=models.CASCADE, related_name='permisos')
    codigo = models.CharField(max_length=100, unique=True)
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    accion = models.CharField(max_length=20, choices=ACCIONES)

    class Meta:
        db_table = 'permisos'
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permisos'

    def __str__(self):
        return f'{self.modulo.nombre} → {self.accion}: {self.nombre}'


class RolPermiso(models.Model):
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='permisos_rol')
    permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)

    class Meta:
        db_table = 'rol_permisos'
        unique_together = ('rol', 'permiso')
