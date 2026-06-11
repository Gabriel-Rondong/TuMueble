from rest_framework import serializers
from .models import (CategoriaProducto, Producto, ProductoMaterial,
                     EtapaProduccion, ProductoEtapa)


class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = '__all__'


class ProductoMaterialSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)
    cantidad_con_merma = serializers.ReadOnlyField()

    class Meta:
        model = ProductoMaterial
        fields = '__all__'


class ProductoEtapaSerializer(serializers.ModelSerializer):
    etapa_nombre = serializers.CharField(source='etapa.nombre', read_only=True)
    class Meta:
        model = ProductoEtapa
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    margen_estimado = serializers.ReadOnlyField()
    materiales_bom = ProductoMaterialSerializer(many=True, read_only=True)
    etapas_producto = ProductoEtapaSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ['empresa', 'creado_en']


class EtapaProduccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapaProduccion
        fields = '__all__'