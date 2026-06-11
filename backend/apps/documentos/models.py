from django.db import models
from decimal import Decimal


class Documento(models.Model):
    TIPOS = [
        ('cotizacion', 'Cotización'),
        ('orden_compra', 'Orden de Compra'),
        ('factura_compra', 'Factura de Compra'),
        ('factura_venta', 'Factura de Venta'),
        ('boleta', 'Boleta'),
        ('guia_despacho', 'Guía de Despacho'),
        ('comprobante_pago', 'Comprobante de Pago'),
        ('nota_credito', 'Nota de Crédito'),
    ]
    ESTADOS_PAGO = [('pendiente', 'Pendiente'), ('parcial', 'Parcial'), ('pagado', 'Pagado'), ('vencido', 'Vencido'), ('anulado', 'Anulado')]

    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    tipo_documento = models.CharField(max_length=20, choices=TIPOS)
    numero_documento = models.CharField(max_length=50, blank=True)
    proveedor = models.ForeignKey('proveedores.Proveedor', on_delete=models.SET_NULL, null=True, blank=True)
    cliente = models.ForeignKey('clientes.Cliente', on_delete=models.SET_NULL, null=True, blank=True)
    orden = models.ForeignKey('produccion.OrdenProduccion', on_delete=models.SET_NULL, null=True, blank=True, related_name='documentos')
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField(null=True, blank=True)
    monto_neto = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    iva = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    total = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    estado_pago = models.CharField(max_length=20, choices=ESTADOS_PAGO, default='pendiente')
    archivo_pdf = models.FileField(upload_to='documentos/', blank=True, null=True)
    observacion = models.TextField(blank=True)
    creado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    # Soft delete
    eliminado = models.BooleanField(default=False)
    eliminado_en = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'documentos'
        ordering = ['-creado_en']

    def __str__(self):
        return f'{self.get_tipo_documento_display()} N°{self.numero_documento}'

    def save(self, *args, **kwargs):
        self.total = self.monto_neto + self.iva
        super().save(*args, **kwargs)


class DocumentoDetalle(models.Model):
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE, related_name='detalles')
    material = models.ForeignKey('bodega.Material', on_delete=models.SET_NULL, null=True, blank=True)
    producto = models.ForeignKey('productos.Producto', on_delete=models.SET_NULL, null=True, blank=True)
    descripcion = models.CharField(max_length=300)
    cantidad = models.DecimalField(max_digits=10, decimal_places=3)
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        db_table = 'documento_detalle'

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)
