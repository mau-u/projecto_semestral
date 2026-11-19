# Integración Mil Sabores

## Arquitectura

- **Frontend:** React 19 y Vite. Las vistas de tienda y paneles consumen `/api/v1` con `fetch` y cookies.
- **Backend:** Spring Boot 3, Spring Security, JWT HttpOnly, JPA y validaciones Jakarta.
- **Persistencia:** MySQL 8.4. Hibernate crea y actualiza las tablas `usuario`, `boleta`, `detalle_boleta`, `producto` y `categoria`.
- **Despliegue local:** Docker Compose levanta MySQL, API y frontend con Nginx.

## Recorridos integrados

1. Catálogo y categorías públicas se consultan desde la base de datos. Si la API no está disponible, la interfaz permite revisar el catálogo de respaldo del navegador.
2. Registro crea un usuario CLIENTE. Inicio de sesión emite una cookie JWT HttpOnly; `/auth/me` restaura el rol al recargar y logout elimina la cookie.
3. El cliente confirma la compra con su sesión. La API vuelve a validar productos y stock, calcula el total desde los precios en MySQL, crea la boleta y sus detalles, y descuenta las existencias dentro de la transacción.
4. ADMIN puede crear, actualizar y eliminar productos y categorías, listar y anular boletas, y administrar usuarios.
5. VENDEDOR solo obtiene consultas de productos y boletas. El frontend presenta una vista de lectura con listado y detalle; los endpoints de escritura permanecen restringidos al ADMIN.
6. CLIENTE tiene acceso a la tienda y a crear/listar sus propias compras; Spring Security restringe el checkout a este rol.

## Endpoints principales

La API está versionada en `/api/v1`. La especificación y la interfaz Swagger están disponibles en `/v3/api-docs` y `/swagger-ui.html`.

| Recurso | Endpoints | Acceso |
| --- | --- | --- |
| Sesión | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` | Público para registro/login; autenticado para sesión |
| Catálogo | `GET /store/products`, `GET /store/categories` | Público |
| Gestión de productos | `GET/POST /products`, `PUT/DELETE /products/{id}` | GET ADMIN/VENDEDOR; escritura ADMIN |
| Categorías | `GET/POST /categories`, `PUT/DELETE /categories/{id}` | ADMIN |
| Compra | `POST /store/checkout`, `GET /store/orders` | CLIENTE |
| Boletas | `GET /boletas`, `GET /boletas/{id}`, `DELETE /boletas/{id}` | GET ADMIN/VENDEDOR; anulación ADMIN |
| Usuarios | `GET/POST /users`, `PUT/DELETE /users/{id}` | ADMIN |

## Cuentas de demostración

- Administrador: `admin.ep3@duoc.cl` / `Admin123!`
- Vendedor: `vendedor.ep3@duoc.cl` / `Vendedor123!`
- Cliente: crea una cuenta desde la pantalla Registro.

Las contraseñas de demostración están pensadas para el entorno local. Configura variables propias antes de publicar el sistema.

## Ejecución

Desde la raíz de este proyecto:

```powershell
docker compose up --build
```

- Tienda: `http://localhost`
- Swagger: `http://localhost:8080/swagger-ui.html`
- Documentación OpenAPI: `http://localhost:8080/v3/api-docs`

Al detenerlo, `docker compose down` conserva la base de datos en el volumen `mysql_data`. Para reiniciar los datos demo, elimina ese volumen desde Docker Desktop.

## Límites de la simulación

El formulario registra la entrega y el método escogido como parte de la boleta, pero no conecta con una pasarela de pago real ni envía pedidos a un servicio de despacho. El resultado de pago rechazado es una simulación de interfaz y no crea una boleta ni descuenta stock. El panel de auditoría histórica del prototipo sigue guardando eventos en el navegador; las entidades de negocio principales sí quedan persistidas en MySQL.
