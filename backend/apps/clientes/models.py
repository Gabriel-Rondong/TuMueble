from django.db import models

class Cliente(models.Model):
    TIPOS = [('persona_natural', 'Persona Natural'), ('empresa', 'Empresa')]

    empresa = models.ForeignKey('empresas.Empresa', on_delete=models.CASCADE, related_name='clientes')
    nombre = models.CharField(max_length=200)
    rut = models.CharField(max_length=20, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    direccion = models.CharField(max_length=300, blank=True)
    comuna = models.CharField(max_length=100, blank=True)
    ciudad = models.CharField(max_length=100, blank=True)
    tipo_cliente = models.CharField(max_length=20, choices=TIPOS, default='persona_natural')
    observaciones = models.TextField(blank=True)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    creado_por = models.ForeignKey('accounts.Usuario', on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'clientes'
        verbose_name = 'Cliente'

    def __str__(self):
        return self.nombre
