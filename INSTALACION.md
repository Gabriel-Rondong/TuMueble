# TuMueble ERP — Guía de Instalación

## Prerrequisitos
- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Git

---

## BACKEND (Django)

### 1. Crear y activar entorno virtual
```bash
cd tumueble/backend
python -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\activate           # Windows
```

### 2. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus datos de MySQL
```

### 4. Crear base de datos MySQL
```sql
CREATE DATABASE tumueble_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tumueble_user'@'localhost' IDENTIFIED BY 'tu_password_segura';
GRANT ALL PRIVILEGES ON tumueble_db.* TO 'tumueble_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Ejecutar migraciones
```bash
python manage.py makemigrations accounts empresas permisos clientes proveedores bodega productos produccion documentos costos portal_cliente auditoria
python manage.py migrate
```

### 6. Crear superusuario de plataforma
```bash
python manage.py shell -c "
from apps.accounts.models import Usuario
u = Usuario.objects.create_superuser(
    email='admin@tumueble.cl',
    password='Admin123!',
    nombre='Super',
    apellido='Admin',
    es_superusuario_plataforma=True
)
print(f'Superusuario creado: {u.email}')
"
```

### 7. Levantar servidor
```bash
python manage.py runserver 8000
```
API disponible en: http://localhost:8000/api/
Docs (Swagger): http://localhost:8000/api/docs/

---

## FRONTEND (React + Vite)

### 1. Instalar dependencias
```bash
cd tumueble/frontend
npm install
```

### 2. Configurar entorno
```bash
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api
```

### 3. Levantar frontend
```bash
npm run dev
```
App disponible en: http://localhost:5173

---

## URLs del sistema

| URL | Descripción |
|-----|-------------|
| http://localhost:5173/login | Login del sistema |
| http://localhost:5173/dashboard | Dashboard principal |
| http://localhost:5173/pedido | Portal público del cliente |
| http://localhost:8000/api/docs/ | Documentación API (Swagger) |
| http://localhost:8000/admin/ | Admin Django |
