from django.db import models
from decimal import Decimal


class CategoriaProducto(models.Model):
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'categorias_producto'

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, related_name='productos')
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=200)
    codigo = models.CharField(max_length=50, blank=True)
    descripcion = models.TextField(blank=True)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    precio_venta_estimado = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    costo_estimado = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    tiempo_estimado_horas = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0'))
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    # Soft delete
    eliminado = models.BooleanField(default=False)

    class Meta:
        db_table = 'productos'
        verbose_name = 'Producto'

    def __str__(self):
        return self.nombre

    @property
    def margen_estimado(self):
        if self.precio_venta_estimado > 0:
            return ((self.precio_venta_estimado - self.costo_estimado) / self.precio_venta_estimado) * 100
        return Decimal('0')


class ProductoMaterial(models.Model):
    """BOM - Lista de Materiales por Producto."""
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='materiales_bom')
    material = models.ForeignKey('bodega.Material', on_delete=models.CASCADE)
    cantidad_estimada = models.DecimalField(max_digits=12, decimal_places=3)
    unidad_medida = models.ForeignKey('bodega.UnidadMedida', on_delete=models.SET_NULL, null=True)
    merma_estimada_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0'))
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = 'producto_materiales'
        unique_together = ('producto', 'material')

    @property
    def cantidad_con_merma(self):
        factor = 1 + (self.merma_estimada_porcentaje / 100)
        return self.cantidad_estimada * factor


class EtapaProduccion(models.Model):
    """Etapas configurables del flujo de producción."""
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=30, blank=True)
    descripcion = models.TextField(blank=True)
    orden = models.PositiveIntegerField(default=0)
    visible_cliente = models.BooleanField(default=False)
    estado_cliente_equivalente = models.CharField(max_length=100, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'etapas_produccion'
        ordering = ['orden']

    def __str__(self):
        return self.nombre


class ProductoEtapa(models.Model):
    """Etapas asignadas a un producto específico."""
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='etapas_producto')
    etapa = models.ForeignKey(EtapaProduccion, on_delete=models.CASCADE)
    orden = models.PositiveIntegerField(default=0)
    tiempo_estimado_horas = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0'))
    obligatorio = models.BooleanField(default=True)

    class Meta:
        db_table = 'producto_etapas'
        ordering = ['orden']
        unique_together = ('producto', 'etapa')
