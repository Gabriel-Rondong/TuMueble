from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import OrdenProduccion, OrdenEtapa, OrdenMaterialConsumido, HistorialEstadoOrden


@receiver(pre_save, sender=OrdenProduccion)
def registrar_cambio_estado_orden(sender, instance, **kwargs):
    """Registra automáticamente en historial cuando cambia el estado."""
    if instance.pk:
        try:
            anterior = OrdenProduccion.objects.get(pk=instance.pk)
            if anterior.estado_general != instance.estado_general:
                HistorialEstadoOrden.objects.create(
                    orden=instance,
                    estado_anterior=anterior.estado_general,
                    estado_nuevo=instance.estado_general,
                    etapa_anterior=anterior.etapa_actual,
                    etapa_nueva=instance.etapa_actual,
                    observacion='Cambio automático de estado',
                )
        except OrdenProduccion.DoesNotExist:
            pass


@receiver(post_save, sender=OrdenMaterialConsumido)
def actualizar_costo_real_orden(sender, instance, created, **kwargs):
    """Recalcula el costo real de la orden cuando se registra un consumo."""
    if created:
        from django.db.models import Sum
        from apps.costos.models import CostoOrden
        orden = instance.orden
        # Suma materiales consumidos
        mat_total = OrdenMaterialConsumido.objects.filter(orden=orden).aggregate(
            total=Sum('subtotal')
        )['total'] or 0
        # Suma otros costos registrados
        otros = CostoOrden.objects.filter(
            orden=orden
        ).exclude(tipo_costo='material').aggregate(
            total=Sum('monto')
        )['total'] or 0
        orden.costo_real = mat_total + otros
        if orden.ingreso_total > 0:
            orden.utilidad = orden.ingreso_total - orden.costo_real
            orden.margen_porcentaje = (orden.utilidad / orden.ingreso_total) * 100
        orden.save(update_fields=['costo_real', 'utilidad', 'margen_porcentaje'])


@receiver(post_save, sender=OrdenEtapa)
def actualizar_avance_orden(sender, instance, **kwargs):
    """Recalcula el avance porcentual de la orden según etapas completadas."""
    orden = instance.orden
    total = orden.etapas_orden.count()
    if total > 0:
        completadas = orden.etapas_orden.filter(estado='completada').count()
        orden.avance_porcentaje = round((completadas / total) * 100, 2)
        orden.save(update_fields=['avance_porcentaje'])