from django.db import models

class Proveedor(models.Model):
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, related_name='proveedores')
    nombre = models.CharField(max_length=200)
    rut = models.CharField(max_length=20, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    direccion = models.CharField(max_length=300, blank=True)
    giro = models.CharField(max_length=200, blank=True)
    contacto_nombre = models.CharField(max_length=100, blank=True)
    observaciones = models.TextField(blank=True)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    # Soft delete
    eliminado = models.BooleanField(default=False)
    eliminado_en = models.DateTimeField(null=True, blank=True)
    eliminado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, blank=True, related_name='proveedores_eliminados')

    class Meta:
        db_table = 'proveedores'
        verbose_name = 'Proveedor'

    def __str__(self):
        return self.nombre
