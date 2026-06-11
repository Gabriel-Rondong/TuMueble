from rest_framework import serializers
from .models import Empresa, ModuloSistema, EmpresaModulo


class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = '__all__'


class ModuloSistemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuloSistema
        fields = '__all__'


class EmpresaModuloSerializer(serializers.ModelSerializer):
    modulo_nombre = serializers.CharField(source='modulo.nombre', read_only=True)
    class Meta:
        model = EmpresaModulo
        fields = ['id', 'empresa', 'modulo', 'modulo_nombre', 'habilitado', 'fecha_habilitacion']