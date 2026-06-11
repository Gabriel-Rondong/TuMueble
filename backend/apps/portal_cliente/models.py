from django.db import models


class EstadoCliente(models.Model):
    """Estados visibles para el cliente final (mapean los estados internos)."""
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    orden = models.PositiveIntegerField(default=0)
    icono = models.CharField(max_length=10, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'estados_cliente'
        ordering = ['orden']

    def __str__(self):
        return self.nombre


class SeguimientoCliente(models.Model):
    """Historial de actualizaciones visibles para el cliente."""
    orden = models.ForeignKey('produccion.OrdenProduccion', on_delete=models.CASCADE, related_name='seguimientos_cliente')
    estado_cliente = models.ForeignKey(EstadoCliente, on_delete=models.SET_NULL, null=True)
    mensaje = models.TextField(blank=True)
    avance_visible = models.PositiveIntegerField(default=0, help_text='0-100%')
    fecha_actualizacion = models.DateTimeField(auto_now_add=True)
    visible = models.BooleanField(default=True)
    imagen_publica = models.ImageField(upload_to='seguimiento_cliente/', blank=True, null=True)
    actualizado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'seguimiento_cliente'
        ordering = ['-fecha_actualizacion']
