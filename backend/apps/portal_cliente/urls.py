from django.urls import path
from .views import ConsultarOrdenView, EstadoOrdenClienteView

urlpatterns = [
    path('consultar-orden/', ConsultarOrdenView.as_view(), name='consultar-orden'),
    path('orden/<uuid:token>/', EstadoOrdenClienteView.as_view(), name='estado-orden-cliente'),
]
