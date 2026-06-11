from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Documento
from .serializers import DocumentoSerializer
from apps.accounts.permissions import get_empresa_usuario


class DocumentoViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['tipo_documento', 'estado_pago', 'proveedor', 'cliente']

    def get_queryset(self):
        empresa = get_empresa_usuario(self.request.user)
        return Documento.objects.filter(empresa=empresa, eliminado=False).order_by('-creado_en')

    def perform_create(self, serializer):
        empresa = get_empresa_usuario(self.request.user)
        serializer.save(empresa=empresa, creado_por=self.request.user)

    @action(detail=True, methods=['post'])
    def adjuntar_pdf(self, request, pk=None):
        documento = self.get_object()
        archivo = request.FILES.get('archivo')
        if not archivo:
            return Response({'detail': 'No se adjuntó ningún archivo.'}, status=400)
        documento.archivo_pdf = archivo
        documento.save()
        return Response({'detail': 'PDF adjuntado correctamente.'})