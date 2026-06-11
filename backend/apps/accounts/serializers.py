from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import Usuario, Rol, Permiso, RolPermiso, UsuarioEmpresa


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT con datos extra del usuario en el token."""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['nombre_completo'] = user.nombre_completo
        token['email'] = user.email
        token['es_superusuario_plataforma'] = user.es_superusuario_plataforma
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # Actualizar último acceso
        user.ultimo_acceso = timezone.now()
        user.save(update_fields=['ultimo_acceso'])

        # Agregar datos del usuario en la respuesta
        data['usuario'] = UsuarioBasicoSerializer(user).data
        return data


class UsuarioBasicoSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'apellido', 'nombre_completo',
                  'telefono', 'avatar', 'es_superusuario_plataforma', 'ultimo_acceso']
        read_only_fields = ['ultimo_acceso']


class UsuarioSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'apellido', 'nombre_completo',
                  'telefono', 'avatar', 'is_active', 'es_superusuario_plataforma',
                  'password', 'ultimo_acceso', 'creado_en']
        read_only_fields = ['ultimo_acceso', 'creado_en']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class PermisoSerializer(serializers.ModelSerializer):
    modulo_nombre = serializers.CharField(source='modulo.nombre', read_only=True)

    class Meta:
        model = Permiso
        fields = ['id', 'codigo', 'nombre', 'descripcion', 'accion', 'modulo', 'modulo_nombre']


class RolSerializer(serializers.ModelSerializer):
    permisos = PermisoSerializer(source='permisos_rol__permiso', many=True, read_only=True)

    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion', 'codigo', 'es_rol_sistema', 'activo', 'empresa', 'permisos']


class UsuarioEmpresaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)

    class Meta:
        model = UsuarioEmpresa
        fields = ['id', 'usuario', 'usuario_nombre', 'empresa', 'empresa_nombre',
                  'rol', 'rol_nombre', 'activo', 'creado_en']
