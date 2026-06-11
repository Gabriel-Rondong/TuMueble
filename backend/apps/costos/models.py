from django.db import models
from decimal import Decimal


class CostoOrden(models.Model):
    TIPOS = [
        ('material', 'Material'),
        ('mano_obra', 'Mano de Obra'),
        ('servicio_externo', 'Servicio Externo'),
        ('transporte', 'Transporte'),
        ('embalaje', 'Embalaje'),
        ('instalacion', 'Instalación'),
        ('otro', 'Otro'),
    ]

    orden = models.ForeignKey('produccion.OrdenProduccion', on_delete=models.CASCADE, related_name='costos')
    tipo_costo = models.CharField(max_length=20, choices=TIPOS)
    descripcion = models.CharField(max_length=300)
    monto = models.DecimalField(max_digits=14, decimal_places=2)
    fecha = models.DateField()
    registrado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'costos_orden'

    def __str__(self):
        return f'{self.get_tipo_costo_display()}: ${self.monto:,.0f}'


class IngresoOrden(models.Model):
    TIPOS = [('abono', 'Abono'), ('pago_total', 'Pago Total'), ('anticipo', 'Anticipo'), ('otro', 'Otro')]
    METODOS_PAGO = [('transferencia', 'Transferencia'), ('efectivo', 'Efectivo'), ('cheque', 'Cheque'), ('tarjeta', 'Tarjeta')]

    orden = models.ForeignKey('produccion.OrdenProduccion', on_delete=models.CASCADE, related_name='ingresos')
    tipo_ingreso = models.CharField(max_length=20, choices=TIPOS)
    descripcion = models.CharField(max_length=300, blank=True)
    monto = models.DecimalField(max_digits=14, decimal_places=2)
    metodo_pago = models.CharField(max_length=20, choices=METODOS_PAGO, blank=True)
    fecha = models.DateField()
    documento = models.ForeignKey('documentos.Documento', on_delete=models.SET_NULL, null=True, blank=True)
    registrado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ingresos_orden'


class NoConformidad(models.Model):
    TIPOS = [('defecto_material', 'Defecto de Material'), ('error_proceso', 'Error de Proceso'),
             ('dano_transporte', 'Daño en Transporte'), ('rechazo_cliente', 'Rechazo de Cliente'), ('otro', 'Otro')]
    GRAVEDADES = [('baja', 'Baja'), ('media', 'Media'), ('alta', 'Alta'), ('critica', 'Crítica')]
    ESTADOS = [('registrada', 'Registrada'), ('en_proceso', 'En Proceso'), ('resuelta', 'Resuelta'), ('cerrada', 'Cerrada')]

    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE)
    orden = models.ForeignKey('produccion.OrdenProduccion', on_delete=models.SET_NULL, null=True, blank=True)
    producto = models.ForeignKey('productos.Producto', on_delete=models.SET_NULL, null=True, blank=True)
    etapa = models.ForeignKey('productos.EtapaProduccion', on_delete=models.SET_NULL, null=True, blank=True)
    material = models.ForeignKey('bodega.Material', on_delete=models.SET_NULL, null=True, blank=True)
    lote = models.ForeignKey('bodega.LoteMaterial', on_delete=models.SET_NULL, null=True, blank=True)
    proveedor = models.ForeignKey('proveedores.Proveedor', on_delete=models.SET_NULL, null=True, blank=True)
    descripcion = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPOS)
    gravedad = models.CharField(max_length=10, choices=GRAVEDADES, default='media')
    costo_asociado = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0'))
    accion_correctiva = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='registrada')
    evidencia_imagen = models.ImageField(upload_to='no_conformidades/', blank=True, null=True)
    responsable = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, related_name='no_conformidades_responsable')
    registrado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, related_name='no_conformidades_registradas')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'no_conformidades'
        ordering = ['-fecha_registro']
