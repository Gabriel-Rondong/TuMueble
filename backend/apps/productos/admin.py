from django.contrib import admin
from .models import CategoriaProducto, Producto, ProductoMaterial, EtapaProduccion, ProductoEtapa


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'categoria', 'precio_venta_estimado', 'costo_estimado', 'activo')
    list_filter = ('categoria', 'activo', 'empresa')
    search_fields = ('nombre', 'codigo')


@admin.register(EtapaProduccion)
class EtapaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'orden', 'visible_cliente', 'activo')
    list_editable = ('orden', 'visible_cliente')


admin.site.register(CategoriaProducto)
admin.site.register(ProductoMaterial)
admin.site.register(ProductoEtapa)