# Mil Sabores — Evaluación Parcial 3 DSY1104

Proyecto full stack basado en la tienda React original, integrado con API REST Spring Boot, Spring Security/JWT y MySQL.

## Inicio rápido en Windows

1. Instala Docker Desktop y espera a que indique que está iniciado.
2. Abre PowerShell en la carpeta del proyecto.
3. Ejecuta:

```powershell
docker compose up --build
```

4. Abre `http://localhost`.

El primer inicio descarga las imágenes de MySQL, Java y Nginx. Swagger está en `http://localhost:8080/swagger-ui.html`.

## Cuentas locales

- Administrador: `admin.ep3@duoc.cl` / `Admin123!`
- Vendedor: `vendedor.ep3@duoc.cl` / `Vendedor123!`
- Cliente: regístrate desde **Iniciar sesión → Crear cuenta**.

El administrador administra el catálogo, las categorías, los usuarios y las boletas. El vendedor solo consulta productos y órdenes. El cliente usa la tienda y puede confirmar compras con sesión iniciada.

## Qué hace la aplicación

- Navegación de tienda, filtros, detalle de producto, carrito, checkout y vistas informativas.
- Registro e inicio de sesión con JWT en cookie HttpOnly; el backend valida los permisos de cada recurso.
- Operaciones CRUD de productos, categorías y usuarios desde el panel ADMIN.
- Consulta de productos y boletas desde el panel VENDEDOR, en modo lectura.
- Checkout que revalida precios y existencias en el servidor, guarda cabecera y detalles en MySQL, y descuenta stock en una transacción.
- Persistencia relacional para usuarios, categorías, productos, boletas y detalles.
- Swagger/OpenAPI para explorar los contratos REST versionados en `/api/v1`.

El método de pago es una demostración académica: no se conecta a un proveedor de pagos real. El carrito permanece en el navegador; las órdenes confirmadas y el inventario quedan en MySQL.

## Datos y seguridad

Docker Compose configura MySQL y crea un volumen persistente `mysql_data`. Los usuarios iniciales se crean con contraseñas BCrypt. Configura `ADMIN_PASSWORD`, `SELLER_PASSWORD`, `JWT_SECRET`, `DB_PASSWORD` y `MYSQL_ROOT_PASSWORD` antes de desplegar en un servidor compartido.

Para bajar los contenedores sin borrar los datos:

```powershell
docker compose down
```

Para volver a iniciar, usa `docker compose up`. Las variables de ejemplo y el modelo de tablas están en `backend/.env.example` y `docs/modelo_relacional.png`.

## Documentos de entrega

- `docs/ERS_TiendaOnline.docx`: requisitos y alcance.
- `docs/Manual_Usuario_TiendaOnline.docx`: guía de uso.
- `docs/Documentacion_APIs_Integracion_TiendaOnline.docx` y `.xlsx`: contratos e integración.
- `docs/modelo_relacional.png` y `docs/arquitectura_integracion.png`: diagramas.
- `docs/Matriz_de_Pruebas_y_Rubrica.md`: matriz para validar los requisitos de la pauta.
- `INTEGRACION_MIL_SABORES.md`: flujo técnico y permisos.

La compilación del frontend y las imágenes Docker se completó correctamente. Las pruebas automatizadas no se ejecutaron en esta sesión. Antes de presentar, recorre registro/login, compra, CRUD de administrador y consulta del vendedor; documenta capturas reales en el manual.
