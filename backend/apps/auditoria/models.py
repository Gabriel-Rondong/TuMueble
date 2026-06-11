from django.db import models


class Auditoria(models.Model):
    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.SET_NULL, null=True, blank=True)
    usuario = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)
    modulo = models.CharField(max_length=100)
    accion = models.CharField(max_length=100)
    tabla_afectada = models.CharField(max_length=100, blank=True)
    registro_id = models.BigIntegerField(null=True, blank=True)
    valor_anterior = models.JSONField(null=True, blank=True)
    valor_nuevo = models.JSONField(null=True, blank=True)
    descripcion = models.TextField(blank=True)
    ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'auditoria'
        ordering = ['-fecha']
        verbose_name = 'Auditoría'

    def __str__(self):
        return f'{self.usuario} → {self.accion} en {self.modulo} ({self.fecha})'
