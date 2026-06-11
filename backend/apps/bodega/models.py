from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class CategoriaMaterial(models.Model):
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'categorias_material'

    def __str__(self):
        return self.nombre


class UnidadMedida(models.Model):
    TIPOS = [('longitud', 'Longitud'), ('area', 'Área'), ('volumen', 'Volumen'),
             ('peso', 'Peso'), ('unidad', 'Unidad'), ('otro', 'Otro')]

    nombre = models.CharField(max_length=50)
    abreviatura = models.CharField(max_length=10)
    tipo = models.CharField(max_length=20, choices=TIPOS)

    class Meta:
        db_table = 'unidades_medida'

    def __str__(self):
        return f'{self.nombre} ({self.abreviatura})'


class Material(models.Model):
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, related_name='materiales')
    categoria = models.ForeignKey(CategoriaMaterial, on_delete=models.SET_NULL, null=True)
    unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)
    proveedor_principal = models.ForeignKey('proveedores.Proveedor', on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, blank=True)
    descripcion = models.TextField(blank=True)
    costo_unitario_referencial = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    stock_minimo = models.DecimalField(max_digits=12, decimal_places=3, default=Decimal('0'))
    imagen = models.ImageField(upload_to='materiales/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    # Soft delete
    eliminado = models.BooleanField(default=False)

    class Meta:
        db_table = 'materiales'
        verbose_name = 'Material'

    def __str__(self):
        return f'{self.nombre} ({self.sku})'

    @property
    def stock_actual(self):
        """Suma de cantidad disponible en todos los lotes activos."""
        return self.lotes.filter(estado='activo').aggregate(
            total=models.Sum('cantidad_disponible')
        )['total'] or Decimal('0')

    @property
    def alerta_stock(self):
        return self.stock_actual <= self.stock_minimo


class UbicacionBodega(models.Model):
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    codigo = models.CharField(max_length=20, blank=True)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'ubicaciones_bodega'

    def __str__(self):
        return self.nombre


class LoteMaterial(models.Model):
    ESTADOS = [('activo', 'Activo'), ('agotado', 'Agotado'), ('devuelto', 'Devuelto'), ('anulado', 'Anulado')]

    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='lotes')
    proveedor = models.ForeignKey('proveedores.Proveedor', on_delete=models.SET_NULL, null=True, blank=True)
    ubicacion = models.ForeignKey(UbicacionBodega, on_delete=models.SET_NULL, null=True, blank=True)
    numero_lote = models.CharField(max_length=100)
    fecha_ingreso = models.DateField()
    cantidad_inicial = models.DecimalField(max_digits=12, decimal_places=3)
    cantidad_disponible = models.DecimalField(max_digits=12, decimal_places=3)
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    documento_compra = models.ForeignKey('documentos.Documento', on_delete=models.SET_NULL, null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')
    observaciones = models.TextField(blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'lotes_material'
        verbose_name = 'Lote de Material'

    def __str__(self):
        return f'{self.material.nombre} - Lote {self.numero_lote}'

    @property
    def valor_total(self):
        return self.cantidad_disponible * self.costo_unitario


class MovimientoBodega(models.Model):
    TIPOS = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste_positivo', 'Ajuste Positivo'),
        ('ajuste_negativo', 'Ajuste Negativo'),
        ('reserva', 'Reserva'),
        ('consumo', 'Consumo en Producción'),
        ('devolucion', 'Devolución'),
    ]
    ESTADOS = [('pendiente', 'Pendiente'), ('confirmado', 'Confirmado'), ('anulado', 'Anulado')]

    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    tipo_movimiento = models.CharField(max_length=20, choices=TIPOS)
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, related_name='movimientos_bodega')
    orden_produccion = models.ForeignKey('produccion.OrdenProduccion', on_delete=models.SET_NULL, null=True, blank=True)
    documento = models.ForeignKey('documentos.Documento', on_delete=models.SET_NULL, null=True, blank=True)
    observacion = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='confirmado')
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'movimientos_bodega'
        ordering = ['-creado_en']

    def __str__(self):
        return f'{self.get_tipo_movimiento_display()} - {self.fecha}'


class MovimientoBodegaDetalle(models.Model):
    movimiento = models.ForeignKey(MovimientoBodega, on_delete=models.CASCADE, related_name='detalles')
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    lote = models.ForeignKey(LoteMaterial, on_delete=models.SET_NULL, null=True, blank=True)
    cantidad = models.DecimalField(max_digits=12, decimal_places=3)
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    observacion = models.TextField(blank=True)

    class Meta:
        db_table = 'movimiento_bodega_detalle'

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.costo_unitario
        super().save(*args, **kwargs)
