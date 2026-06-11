from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import LoteMaterial, MovimientoBodegaDetalle


@receiver(post_save, sender=LoteMaterial)
def actualizar_disponibilidad_lote(sender, instance, created, **kwargs):
    """Cuando se crea un lote nuevo, la cantidad disponible = cantidad_inicial."""
    if created and instance.cantidad_disponible == 0:
        LoteMaterial.objects.filter(pk=instance.pk).update(
            cantidad_disponible=instance.cantidad_inicial
        )


@receiver(post_save, sender=MovimientoBodegaDetalle)
def aplicar_movimiento_a_lote(sender, instance, created, **kwargs):
    """Actualiza la cantidad disponible del lote según el tipo de movimiento."""
    if not created:
        return
    mov = instance.movimiento
    lote = instance.lote
    if not lote:
        return

    tipo = mov.tipo_movimiento
    if tipo in ("entrada",):
        lote.cantidad_disponible += instance.cantidad
    elif tipo in ("salida", "consumo", "reserva"):
        lote.cantidad_disponible = max(0, lote.cantidad_disponible - instance.cantidad)
    elif tipo == "devolucion":
        lote.cantidad_disponible += instance.cantidad
    elif tipo == "ajuste_positivo":
        lote.cantidad_disponible += instance.cantidad
    elif tipo == "ajuste_negativo":
        lote.cantidad_disponible = max(0, lote.cantidad_disponible - instance.cantidad)

    if lote.cantidad_disponible <= 0:
        lote.estado = "agotado"
    lote.save(update_fields=["cantidad_disponible", "estado"])