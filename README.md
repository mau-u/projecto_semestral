# Pastelería Mil Sabores

Aplicación full stack de tienda en línea. El frontend está construido con React y Vite; el backend usa Java y Spring Boot; MySQL guarda los usuarios, el catálogo y las compras. Docker Compose inicia los tres servicios juntos.

## Inicio rápido

1. Abre Docker Desktop y espera a que esté iniciado.
2. Abre esta carpeta en VS Code y usa **Terminal → New Terminal**.
3. Inicia los servicios:

   ```powershell
   docker compose up -d
   ```

   Si hiciste cambios en el código y quieres reconstruir las imágenes:

   ```powershell
   docker compose up -d --build
   ```

4. Abre la tienda en <http://localhost>.

Swagger está en <http://localhost:8080/swagger-ui/index.html>. La guía paso a paso para probar la tienda, Swagger y MySQL está en [docs/NOTA_PRUEBAS_LOCAL.md](docs/NOTA_PRUEBAS_LOCAL.md).

## Cómo funciona el programa

1. **Frontend:** el contenedor `frontend` sirve la tienda React. Ahí el cliente navega por el catálogo, administra el carrito, inicia sesión y completa el checkout.
2. **Comunicación con el backend:** las llamadas de la tienda usan el API REST versionada bajo `/api/v1`. Nginx envía las llamadas `/api` al contenedor `backend`.
3. **Backend:** Spring Boot valida los datos recibidos, aplica las reglas del negocio y comprueba la sesión y los permisos del rol.
4. **Base de datos:** el backend lee y guarda los datos en MySQL. En una compra aprobada, vuelve a validar precios y stock, guarda la boleta y sus detalles y descuenta el inventario dentro de una transacción.
5. **Mis compras:** el backend busca las boletas asociadas al cliente que inició sesión; por eso cada cliente ve sus propios pedidos.

El inicio de sesión entrega un JWT en una cookie protegida `HttpOnly`. En Swagger, inicia sesión desde **POST `/api/v1/auth/login`** y ejecuta las demás operaciones en la misma pestaña; no necesitas copiar el token. El flujo de pago es una demostración académica y no se conecta a un proveedor de pagos real.

## Roles y permisos

| Rol | Acceso principal |
| --- | --- |
| Administrador | CRUD de productos, categorías y usuarios; consulta y anulación de boletas. |
| Vendedor | Solo lectura de productos (`GET /api/v1/products`) y boletas (`GET /api/v1/boletas`). No puede consultar usuarios. |
| Cliente | Navegación de la tienda, checkout y consulta de sus compras (`GET /api/v1/store/orders`). |

El endpoint **GET `/api/v1/users`** está restringido al administrador. Si el vendedor intenta ejecutarlo en Swagger, recibe **403 Forbidden**: es el permiso esperado, no un fallo de Swagger. Para probar ese endpoint, inicia sesión como administrador en Swagger.

## Cuentas locales

- Administrador: `admin.ep3@duoc.cl` / `Admin123!`
- Vendedor: `vendedor.ep3@duoc.cl` / `Vendedor123!`
- Cliente: regístrate en <http://localhost/#/registro> y usa el correo y la contraseña que elegiste.

## Base de datos y contenedores

Docker Compose crea la base `tienda_online` y conserva los datos en el volumen `mysql_data`. No necesitas instalar XAMPP. Para consultar las tablas desde la terminal:

```powershell
docker compose exec mysql mysql -utienda -p tienda_online
```

La contraseña local de MySQL es `tienda_dev_2026`. La nota de pruebas incluye consultas para ver boletas y detalles.

Para detener los servicios sin borrar los datos:

```powershell
docker compose stop
```

Evita `docker compose down -v` si quieres conservar la base de datos.

## Documentación del proyecto

- [Guía para probar tienda, Swagger y MySQL](docs/NOTA_PRUEBAS_LOCAL.md)
- [Manual de usuario](docs/Manual_Usuario_TiendaOnline.docx)
- [Documento de evaluación DSY1104](README_DSY1104.md)
- [Flujo de integración](INTEGRACION_MIL_SABORES.md)
- [Requisitos del sistema](docs/ERS_TiendaOnline.docx)
- [Documentación de APIs e integración](docs/Documentacion_APIs_Integracion_TiendaOnline.docx)
- [Matriz de pruebas y rúbrica](docs/Matriz_de_Pruebas_y_Rubrica.md)
- Diagramas: `docs/modelo_relacional.png` y `docs/arquitectura_integracion.png`.

Para un despliegue compartido, cambia las contraseñas y el secreto JWT de ejemplo configurados en `docker-compose.yml`.
