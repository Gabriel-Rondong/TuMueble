from rest_framework import serializers
from .models import OrdenProduccion, OrdenEtapa, OrdenMaterialConsumido, HistorialEstadoOrden


class OrdenEtapaSerializer(serializers.ModelSerializer):
    etapa_nombre = serializers.CharField(source='etapa.nombre', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)

    class Meta:
        model = OrdenEtapa
        fields = ['id', 'etapa', 'etapa_nombre', 'responsable', 'responsable_nombre',
                  'estado', 'fecha_inicio', 'fecha_termino', 'observaciones', 'evidencia_imagen']


class HistorialEstadoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)

    class Meta:
        model = HistorialEstadoOrden
        fields = ['id', 'estado_anterior', 'estado_nuevo', 'usuario_nombre', 'observacion', 'fecha']


class OrdenProduccionListSerializer(serializers.ModelSerializer):
    """Serializer ligero para listados."""
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    etapa_actual_nombre = serializers.CharField(source='etapa_actual.nombre', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.nombre_completo', read_only=True)
    esta_atrasado = serializers.ReadOnlyField()
    dias_restantes = serializers.ReadOnlyField()

    class Meta:
        model = OrdenProduccion
        fields = ['id', 'numero_orden', 'cliente_nombre', 'producto_nombre', 'cantidad',
                  'estado_general', 'etapa_actual_nombre', 'avance_porcentaje', 'prioridad',
                  'responsable_nombre', 'fecha_entrega_estimada', 'esta_atrasado',
                  'dias_restantes', 'estado_pago']


class OrdenProduccionDetalleSerializer(serializers.ModelSerializer):
    """Serializer completo para vista de detalle."""
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    etapas_orden = OrdenEtapaSerializer(many=True, read_only=True)
    historial_estados = HistorialEstadoSerializer(many=True, read_only=True)
    esta_atrasado = serializers.ReadOnlyField()
    dias_restantes = serializers.ReadOnlyField()

    class Meta:
        model = OrdenProduccion
        fields = '__all__'


class OrdenProduccionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenProduccion
        fields = ['cliente', 'producto', 'cantidad', 'fecha_entrega_estimada',
                  'prioridad', 'responsable', 'observaciones', 'costo_estimado']
