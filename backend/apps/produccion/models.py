from django.db import models
from django.utils import timezone
from decimal import Decimal
import uuid


class OrdenProduccion(models.Model):
    ESTADOS = [
        ('pedido_recibido', 'Pedido Recibido'),
        ('materiales_pendientes', 'Materiales Pendientes'),
        ('materiales_preparados', 'Materiales Preparados'),
        ('en_produccion', 'En Producción'),
        ('en_terminaciones', 'En Terminaciones'),
        ('control_calidad', 'Control de Calidad'),
        ('listo_despacho', 'Listo para Despacho'),
        ('despachado', 'Despachado'),
        ('instalado', 'Instalado / Entregado'),
        ('cerrado', 'Cerrado'),
        ('cancelado', 'Cancelado'),
    ]
    PRIORIDADES = [('baja', 'Baja'), ('normal', 'Normal'), ('alta', 'Alta'), ('urgente', 'Urgente')]
    ESTADOS_PAGO = [('pendiente', 'Pendiente'), ('parcial', 'Parcial'), ('pagado', 'Pagado'), ('vencido', 'Vencido')]

    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, related_name='ordenes')
    numero_orden = models.CharField(max_length=30, unique=True)
    cliente = models.ForeignKey('clientes.Cliente', on_delete=models.SET_NULL, null=True, related_name='ordenes')
    producto = models.ForeignKey('productos.Producto', on_delete=models.SET_NULL, null=True)
    cantidad = models.PositiveIntegerField(default=1)

    # Fechas
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_entrega_estimada = models.DateField(null=True, blank=True)
    fecha_termino_real = models.DateTimeField(null=True, blank=True)

    # Estado y avance
    estado_general = models.CharField(max_length=30, choices=ESTADOS, default='pedido_recibido')
    etapa_actual = models.ForeignKey('productos.EtapaProduccion', on_delete=models.SET_NULL, null=True, blank=True)
    prioridad = models.CharField(max_length=10, choices=PRIORIDADES, default='normal')
    avance_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0'))

    # Responsable
    responsable = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, blank=True, related_name='ordenes_responsable')

    # Seguimiento cliente
    codigo_seguimiento = models.CharField(max_length=20, unique=True, blank=True)
    token_cliente = models.UUIDField(default=uuid.uuid4, unique=True)

    # Costos e ingresos
    costo_estimado = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    costo_real = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    ingreso_total = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    utilidad = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    margen_porcentaje = models.DecimalField(max_digits=7, decimal_places=2, default=Decimal('0'))
    estado_pago = models.CharField(max_length=20, choices=ESTADOS_PAGO, default='pendiente')

    observaciones = models.TextField(blank=True)

    # Auditoría
    creado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, related_name='ordenes_creadas')
    actualizado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, related_name='ordenes_actualizadas')
    actualizado_en = models.DateTimeField(auto_now=True)

    # Soft delete
    eliminado = models.BooleanField(default=False)

    class Meta:
        db_table = 'ordenes_produccion'
        ordering = ['-fecha_creacion']
        verbose_name = 'Orden de Producción'

    def __str__(self):
        return f'OP-{self.numero_orden}'

    def save(self, *args, **kwargs):
        if not self.codigo_seguimiento:
            import random, string
            self.codigo_seguimiento = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super().save(*args, **kwargs)

    def calcular_utilidad(self):
        self.utilidad = self.ingreso_total - self.costo_real
        if self.ingreso_total > 0:
            self.margen_porcentaje = (self.utilidad / self.ingreso_total) * 100
        self.save(update_fields=['utilidad', 'margen_porcentaje'])

    @property
    def esta_atrasado(self):
        if self.fecha_entrega_estimada and self.estado_general not in ['cerrado', 'cancelado', 'instalado']:
            return timezone.now().date() > self.fecha_entrega_estimada
        return False

    @property
    def dias_restantes(self):
        if self.fecha_entrega_estimada:
            delta = self.fecha_entrega_estimada - timezone.now().date()
            return delta.days
        return None


class OrdenEtapa(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('iniciada', 'Iniciada'),
        ('pausada', 'Pausada'),
        ('completada', 'Completada'),
        ('saltada', 'Saltada'),
    ]

    orden = models.ForeignKey(OrdenProduccion, on_delete=models.CASCADE, related_name='etapas_orden')
    etapa = models.ForeignKey('productos.EtapaProduccion', on_delete=models.CASCADE)
    responsable = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_termino = models.DateTimeField(null=True, blank=True)
    observaciones = models.TextField(blank=True)
    evidencia_imagen = models.ImageField(upload_to='evidencias/', blank=True, null=True)
    actualizado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True, related_name='etapas_actualizadas')
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orden_etapas'
        ordering = ['etapa__orden']

    def iniciar(self, usuario):
        self.estado = 'iniciada'
        self.fecha_inicio = timezone.now()
        self.actualizado_por = usuario
        self.save()

    def finalizar(self, usuario):
        self.estado = 'completada'
        self.fecha_termino = timezone.now()
        self.actualizado_por = usuario
        self.save()


class OrdenMaterialReservado(models.Model):
    ESTADOS = [('reservado', 'Reservado'), ('entregado', 'Entregado'), ('devuelto', 'Devuelto'), ('cancelado', 'Cancelado')]

    orden = models.ForeignKey(OrdenProduccion, on_delete=models.CASCADE, related_name='materiales_reservados')
    material = models.ForeignKey('bodega.Material', on_delete=models.CASCADE)
    lote = models.ForeignKey('bodega.LoteMaterial', on_delete=models.SET_NULL, null=True, blank=True)
    cantidad_reservada = models.DecimalField(max_digits=12, decimal_places=3)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    reservado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='reservado')

    class Meta:
        db_table = 'orden_materiales_reservados'


class OrdenMaterialConsumido(models.Model):
    orden = models.ForeignKey(OrdenProduccion, on_delete=models.CASCADE, related_name='materiales_consumidos')
    etapa = models.ForeignKey(OrdenEtapa, on_delete=models.SET_NULL, null=True, blank=True)
    material = models.ForeignKey('bodega.Material', on_delete=models.CASCADE)
    lote = models.ForeignKey('bodega.LoteMaterial', on_delete=models.SET_NULL, null=True, blank=True)
    cantidad_consumida = models.DecimalField(max_digits=12, decimal_places=3)
    costo_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0'))
    merma = models.DecimalField(max_digits=12, decimal_places=3, default=Decimal('0'))
    registrado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'orden_materiales_consumidos'

    def save(self, *args, **kwargs):
        self.subtotal = self.cantidad_consumida * self.costo_unitario
        super().save(*args, **kwargs)


class HistorialEstadoOrden(models.Model):
    orden = models.ForeignKey(OrdenProduccion, on_delete=models.CASCADE, related_name='historial_estados')
    estado_anterior = models.CharField(max_length=30, blank=True)
    estado_nuevo = models.CharField(max_length=30)
    etapa_anterior = models.ForeignKey('productos.EtapaProduccion', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    etapa_nueva = models.ForeignKey('productos.EtapaProduccion', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    usuario = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)
    observacion = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'historial_estado_orden'
        ordering = ['-fecha']
