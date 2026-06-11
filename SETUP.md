# TuMueble ERP — Guía de Instalación

## Requisitos previos
- Python 3.11+
- Node.js 20+
- MySQL 8+
- Git

---

## 1. Backend (Django)

```bash
# Clonar y entrar al proyecto
cd tumueble/backend

# Crear entorno virtual
python -m venv venv

# Activar (Linux/Mac)
source venv/bin/activate
# Activar (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos de MySQL

# Crear base de datos en MySQL
mysql -u root -p
CREATE DATABASE tumueble_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear datos iniciales (módulos, etapas, roles del sistema)
python manage.py loaddata fixtures/initial_data.json

# Crear superusuario de plataforma
python manage.py createsuperuser

# Levantar servidor
python manage.py runserver
# → http://localhost:8000
# → http://localhost:8000/api/docs/ (Swagger)
```

---

## 2. Frontend (React)

```bash
cd tumueble/frontend

# Instalar dependencias
npm install

# Levantar en modo desarrollo
npm run dev
# → http://localhost:5173

# Build para producción
npm run build
```

---

## 3. Estructura del proyecto

```
tumueble/
├── backend/
│   ├── config/
│   │   ├── settings.py         ← Configuración Django
│   │   ├── urls.py             ← URLs principales
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── accounts/           ← Usuarios, roles, permisos, JWT
│   │   ├── empresas/           ← Empresas, módulos (Superadmin)
│   │   ├── clientes/           ← Gestión de clientes
│   │   ├── proveedores/        ← Gestión de proveedores
│   │   ├── bodega/             ← Materiales, lotes, stock, movimientos
│   │   ├── productos/          ← Productos, BOM, etapas de producción
│   │   ├── produccion/         ← Órdenes, etapas, trazabilidad
│   │   ├── documentos/         ← Facturas, cotizaciones, documentos
│   │   ├── costos/             ← Costos, ingresos, no conformidades
│   │   ├── reportes/           ← Dashboard y centro de reportes
│   │   ├── auditoria/          ← Logs y auditoría de acciones
│   │   └── portal_cliente/     ← Portal público de consulta
│   ├── requirements.txt
│   ├── manage.py
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/                ← Módulos Axios por dominio
    │   │   ├── axios.js        ← Configuración + interceptors JWT
    │   │   ├── auth.js
    │   │   ├── produccion.js
    │   │   └── portal.js
    │   ├── contexts/
    │   │   └── AuthContext.jsx ← Estado global de autenticación
    │   ├── components/
    │   │   └── layout/
    │   │       ├── AppLayout.jsx
    │   │       ├── Sidebar.jsx ← Menú lateral por rol
    │   │       └── AuthLayout.jsx
    │   ├── pages/
    │   │   ├── auth/           ← Login
    │   │   ├── empresa/        ← Dashboard ERP
    │   │   ├── produccion/     ← Órdenes, Estado de Productos
    │   │   ├── platform/       ← Panel Superadmin
    │   │   └── portal/         ← Portal público del cliente
    │   ├── routes/             ← React Router con rutas protegidas
    │   └── styles/             ← CSS global + Tailwind
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## Paleta de colores (identidad TuMueble)

| Token            | Hex       | Uso                          |
|------------------|-----------|------------------------------|
| `tm-dark`        | `#111318` | Fondo principal              |
| `tm-surface`     | `#1A1D24` | Sidebar, inputs              |
| `tm-card`        | `#21252F` | Cards y paneles              |
| `tm-border`      | `#2D3240` | Bordes y divisores           |
| `tm-gold`        | `#C9963A` | Acento principal (logo)      |
| `tm-gold-light`  | `#E8B84B` | Hover de dorado              |
| `tm-text`        | `#E8EAF0` | Texto principal              |
| `tm-muted`       | `#7A8099` | Texto secundario             |

---

## Próximos pasos — Fase 1 pendiente

- [ ] Serializers completos para bodega y productos
- [ ] ViewSets bodega: materiales, lotes, movimientos, stock
- [ ] Fixtures con datos iniciales (módulos, etapas, roles)
- [ ] Pantalla de gestión de usuarios en frontend
- [ ] Pantalla de materiales y bodega
- [ ] Pantalla de productos con BOM
- [ ] Comando management para crear empresa inicial
