from rest_framework import serializers
from .models import CostoOrden, IngresoOrden, NoConformidad


class CostoOrdenSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_costo_display', read_only=True)
    class Meta:
        model = CostoOrden
        fields = '__all__'
        read_only_fields = ['registrado_por', 'creado_en']


class IngresoOrdenSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngresoOrden
        fields = '__all__'
        read_only_fields = ['registrado_por', 'creado_en']


class NoConformidadSerializer(serializers.ModelSerializer):
    gravedad_display = serializers.CharField(source='get_gravedad_display', read_only=True)
    class Meta:
        model = NoConformidad
        fields = '__all__'
        read_only_fields = ['empresa', 'registrado_por', 'fecha_registro']