import django_filters
from .models import Material, LoteMaterial, MovimientoBodega


class MaterialFilter(django_filters.FilterSet):
    categoria = django_filters.NumberFilter()
    activo = django_filters.BooleanFilter()
    con_alerta = django_filters.BooleanFilter(method="filter_alerta")

    class Meta:
        model = Material
        fields = ["categoria", "activo"]

    def filter_alerta(self, queryset, name, value):
        from django.db.models import Sum, OuterRef, Subquery, DecimalField
        from decimal import Decimal
        if value:
            result = []
            for m in queryset:
                if m.alerta_stock:
                    result.append(m.pk)
            return queryset.filter(pk__in=result)
        return queryset


class LoteMaterialFilter(django_filters.FilterSet):
    material = django_filters.NumberFilter()
    proveedor = django_filters.NumberFilter()
    estado = django_filters.CharFilter()
    fecha_desde = django_filters.DateFilter(field_name="fecha_ingreso", lookup_expr="gte")
    fecha_hasta = django_filters.DateFilter(field_name="fecha_ingreso", lookup_expr="lte")

    class Meta:
        model = LoteMaterial
        fields = ["material", "proveedor", "estado"]