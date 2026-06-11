from django.core.management.base import BaseCommand
from apps.empresas.models import Empresa, ModuloSistema, EmpresaModulo
from apps.accounts.models import Usuario, Rol, UsuarioEmpresa
from apps.bodega.models import UnidadMedida
from apps.productos.models import EtapaProduccion


MODULOS = [
    ('plataforma', 'Administración de Plataforma', '🏢', 1),
    ('empresa', 'Administración de Empresa', '⚙️', 2),
    ('usuarios', 'Usuarios, Roles y Permisos', '👥', 3),
    ('clientes', 'Clientes', '🤝', 4),
    ('proveedores', 'Proveedores', '🚚', 5),
    ('bodega', 'Bodega e Inventario', '📦', 6),
    ('materiales', 'Materiales', '🪵', 7),
    ('lotes', 'Lotes', '🏷️', 8),
    ('productos', 'Productos / Muebles', '🪑', 10),
    ('bom', 'Lista de Materiales (BOM)', '📋', 11),
    ('produccion', 'Órdenes de Producción', '🏭', 12),
    ('etapas', 'Etapas Productivas', '🔄', 13),
    ('estado_productos', 'Estado de Productos', '📊', 14),
    ('portal_cliente', 'Portal del Cliente', '🌐', 15),
    ('costos', 'Costos por Producto', '💰', 16),
    ('ingresos', 'Ingresos por Producto', '💵', 17),
    ('documentos', 'Facturas y Documentos', '🧾', 18),
    ('no_conformidades', 'No Conformidades', '⚠️', 19),
    ('dashboard', 'Dashboard Gerencial', '📈', 21),
    ('reportes', 'Centro de Reportes', '📄', 22),
    ('auditoria', 'Auditoría y Logs', '🔍', 23),
    ('configuracion', 'Configuración', '🛠️', 24),
]

UNIDADES = [
    ('Metro', 'm', 'longitud'),
    ('Metro cuadrado', 'm2', 'area'),
    ('Unidad', 'un', 'unidad'),
    ('Kilogramo', 'kg', 'peso'),
    ('Gramo', 'g', 'peso'),
    ('Litro', 'L', 'volumen'),
    ('Mililitro', 'ml', 'volumen'),
    ('Centímetro', 'cm', 'longitud'),
    ('Metro lineal', 'ml', 'longitud'),
    ('Plancha', 'pla', 'unidad'),
    ('Rollo', 'rol', 'unidad'),
    ('Caja', 'caj', 'unidad'),
    ('Kilómetro', 'km', 'longitud'),
]

ETAPAS_DEFAULT = [
    ('Dimensionado', 'DIM', 1),
    ('Corte', 'COR', 2),
    ('Enchapado', 'ENC', 3),
    ('Mecanizado / Perforado', 'MEC', 4),
    ('Armado', 'ARM', 5),
    ('Barnizado / Terminaciones', 'BAR', 6),
    ('Embalaje', 'EMB', 7),
    ('Control de Calidad', 'QC', 8),
    ('Despacho', 'DES', 9),
    ('Instalación', 'INS', 10),
]


class Command(BaseCommand):
    help = 'Configura datos iniciales: módulos, unidades de medida, etapas y empresa de ejemplo'

    def add_arguments(self, parser):
        parser.add_argument('--empresa', type=str, default='TuMueble', help='Nombre de la empresa')
        parser.add_argument('--rut', type=str, default='77.000.001-K')
        parser.add_argument('--admin-email', type=str, default='admin@tumueble.cl')
        parser.add_argument('--admin-password', type=str, default='Admin1234!')
        parser.add_argument('--superadmin-email', type=str, default='superadmin@plataforma.cl')
        parser.add_argument('--superadmin-password', type=str, default='Super1234!')

    def handle(self, *args, **options):
        self.stdout.write('🚀 Iniciando configuración del sistema TuMueble...')

        # 1. Módulos del sistema
        for codigo, nombre, icono, orden in MODULOS:
            ModuloSistema.objects.get_or_create(
                codigo=codigo,
                defaults={'nombre': nombre, 'icono': icono, 'orden': orden, 'activo': True}
            )
        self.stdout.write(self.style.SUCCESS(f'  ✓ {len(MODULOS)} módulos creados'))

        # 2. Unidades de medida
        for nombre, abr, tipo in UNIDADES:
            UnidadMedida.objects.get_or_create(abreviatura=abr, defaults={'nombre': nombre, 'tipo': tipo})
        self.stdout.write(self.style.SUCCESS(f'  ✓ {len(UNIDADES)} unidades de medida creadas'))

        # 3. Empresa
        empresa, _ = Empresa.objects.get_or_create(
            rut=options['rut'],
            defaults={
                'nombre': options['empresa'],
                'razon_social': options['empresa'],
                'giro': 'Fabricación de muebles y artículos de madera',
                'estado': 'activa',
                'plan': 'profesional',
            }
        )
        self.stdout.write(self.style.SUCCESS(f'  ✓ Empresa "{empresa.nombre}" creada'))

        # 4. Habilitar todos los módulos para la empresa
        for modulo in ModuloSistema.objects.all():
            EmpresaModulo.objects.get_or_create(empresa=empresa, modulo=modulo, defaults={'habilitado': True})
        self.stdout.write(self.style.SUCCESS('  ✓ Módulos habilitados para la empresa'))

        # 5. Etapas de producción
        for nombre, codigo, orden in ETAPAS_DEFAULT:
            EtapaProduccion.objects.get_or_create(
                empresa=empresa, codigo=codigo,
                defaults={'nombre': nombre, 'orden': orden, 'activo': True,
                         'visible_cliente': orden in [4, 5, 6]}
            )
        self.stdout.write(self.style.SUCCESS(f'  ✓ {len(ETAPAS_DEFAULT)} etapas de producción creadas'))

        # 6. Superusuario de plataforma
        superadmin, created = Usuario.objects.get_or_create(
            email=options['superadmin_email'],
            defaults={
                'nombre': 'Super',
                'apellido': 'Admin',
                'es_superusuario_plataforma': True,
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )
        if created:
            superadmin.set_password(options['superadmin_password'])
            superadmin.save()
            self.stdout.write(self.style.SUCCESS(f'  ✓ Superadmin creado: {superadmin.email}'))
        else:
            self.stdout.write(f'  → Superadmin ya existía: {superadmin.email}')

        # 7. Rol administrador
        rol_admin, _ = Rol.objects.get_or_create(
            empresa=empresa, codigo='administrador',
            defaults={'nombre': 'Administrador', 'descripcion': 'Acceso completo a la empresa', 'es_rol_sistema': True, 'activo': True}
        )

        # 8. Admin de empresa
        admin, created = Usuario.objects.get_or_create(
            email=options['admin_email'],
            defaults={'nombre': 'Admin', 'apellido': 'TuMueble', 'is_active': True}
        )
        if created:
            admin.set_password(options['admin_password'])
            admin.save()
        UsuarioEmpresa.objects.get_or_create(
            usuario=admin, empresa=empresa,
            defaults={'rol': rol_admin, 'activo': True}
        )
        self.stdout.write(self.style.SUCCESS(f'  ✓ Admin empresa creado: {admin.email}'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('✅ ¡Configuración inicial completada!'))
        self.stdout.write('')
        self.stdout.write(f'  🔐 Superadmin plataforma: {superadmin.email} / {options["superadmin_password"]}')
        self.stdout.write(f'  🏢 Admin empresa:         {admin.email} / {options["admin_password"]}')
        self.stdout.write(f'  📍 API Docs:               http://localhost:8000/api/docs/')
        self.stdout.write('')