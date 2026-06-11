from rest_framework import serializers
from .models import (CategoriaMaterial, UnidadMedida, Material,
                     UbicacionBodega, LoteMaterial, MovimientoBodega,
                     MovimientoBodegaDetalle)


class CategoriaMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaMaterial
        fields = '__all__'


class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadMedida
        fields = '__all__'


class MaterialSerializer(serializers.ModelSerializer):
    stock_actual = serializers.ReadOnlyField()
    alerta_stock = serializers.ReadOnlyField()
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    unidad_abreviatura = serializers.CharField(source='unidad_medida.abreviatura', read_only=True)

    class Meta:
        model = Material
        fields = '__all__'
        read_only_fields = ['empresa', 'creado_en']


class UbicacionBodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UbicacionBodega
        fields = '__all__'


class LoteMaterialSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    valor_total = serializers.ReadOnlyField()

    class Meta:
        model = LoteMaterial
        fields = '__all__'
        read_only_fields = ['empresa', 'creado_en']


class MovimientoDetalleSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)
    class Meta:
        model = MovimientoBodegaDetalle
        fields = '__all__'


class MovimientoBodegaSerializer(serializers.ModelSerializer):
    detalles = MovimientoDetalleSerializer(many=True, read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)

    class Meta:
        model = MovimientoBodega
        fields = '__all__'
        read_only_fields = ['empresa', 'fecha', 'usuario']