from rest_framework import serializers
from .models import Documento, DocumentoDetalle


class DocumentoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentoDetalle
        fields = '__all__'


class DocumentoSerializer(serializers.ModelSerializer):
    detalles = DocumentoDetalleSerializer(many=True, read_only=True)
    tipo_display = serializers.CharField(source='get_tipo_documento_display', read_only=True)

    class Meta:
        model = Documento
        fields = '__all__'
        read_only_fields = ['empresa', 'creado_en', 'creado_por', 'total']