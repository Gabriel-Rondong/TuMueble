import django_filters
from .models import OrdenProduccion


class OrdenProduccionFilter(django_filters.FilterSet):
    estado_general = django_filters.CharFilter()
    prioridad = django_filters.CharFilter()
    cliente = django_filters.NumberFilter()
    producto = django_filters.NumberFilter()
    responsable = django_filters.NumberFilter()
    fecha_desde = django_filters.DateFilter(field_name="fecha_entrega_estimada", lookup_expr="gte")
    fecha_hasta = django_filters.DateFilter(field_name="fecha_entrega_estimada", lookup_expr="lte")
    atrasadas = django_filters.BooleanFilter(method="filter_atrasadas")
    estado_pago = django_filters.CharFilter()

    class Meta:
        model = OrdenProduccion
        fields = ["estado_general", "prioridad", "cliente", "producto", "responsable", "estado_pago"]

    def filter_atrasadas(self, queryset, name, value):
        from django.utils import timezone
        hoy = timezone.now().date()
        if value:
            return queryset.filter(
                fecha_entrega_estimada__lt=hoy
            ).exclude(estado_general__in=["cerrado", "cancelado", "instalado"])
        return queryset