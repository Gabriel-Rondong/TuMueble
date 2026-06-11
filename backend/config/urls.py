from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Auth
    path('api/auth/', include('apps.accounts.urls')),

    # Platform (Superadmin)
    path('api/platform/', include('apps.empresas.urls_platform')),

    # Core empresa
    path('api/empresas/', include('apps.empresas.urls')),
    path('api/usuarios/', include('apps.accounts.urls_usuarios')),
    path('api/clientes/', include('apps.clientes.urls')),
    path('api/proveedores/', include('apps.proveedores.urls')),

    # Operación
    path('api/bodega/', include('apps.bodega.urls')),
    path('api/productos/', include('apps.productos.urls')),
    path('api/produccion/', include('apps.produccion.urls')),

    # Finanzas y documentos
    path('api/documentos/', include('apps.documentos.urls')),
    path('api/costos/', include('apps.costos.urls')),

    # Reportes y dashboard
    path('api/reportes/', include('apps.reportes.urls')),
    path('api/dashboard/', include('apps.reportes.urls_dashboard')),

    # Portal cliente (público)
    path('api/cliente/', include('apps.portal_cliente.urls')),

    # Auditoría
    path('api/auditoria/', include('apps.auditoria.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
