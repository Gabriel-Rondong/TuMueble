from django.db import models


class Empresa(models.Model):
    ESTADOS = [('activa', 'Activa'), ('inactiva', 'Inactiva'), ('suspendida', 'Suspendida')]
    PLANES = [('basico', 'Básico'), ('profesional', 'Profesional'), ('enterprise', 'Enterprise')]

    nombre = models.CharField(max_length=200)
    rut = models.CharField(max_length=20, unique=True)
    razon_social = models.CharField(max_length=200, blank=True)
    giro = models.CharField(max_length=200, blank=True)
    direccion = models.CharField(max_length=300, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activa')
    plan = models.CharField(max_length=20, choices=PLANES, default='basico')
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_termino = models.DateField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'empresas'
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'

    def __str__(self):
        return self.nombre


class ModuloSistema(models.Model):
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True)
    icono = models.CharField(max_length=50, blank=True)
    orden = models.PositiveIntegerField(default=0)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'modulos_sistema'
        ordering = ['orden']
        verbose_name = 'Módulo del Sistema'

    def __str__(self):
        return self.nombre


class EmpresaModulo(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='modulos_habilitados')
    modulo = models.ForeignKey(ModuloSistema, on_delete=models.CASCADE)
    habilitado = models.BooleanField(default=True)
    fecha_habilitacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'empresa_modulos'
        unique_together = ('empresa', 'modulo')
