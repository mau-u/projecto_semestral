# Guía rápida para entrar y probar Mil Sabores

Usa esta guía para iniciar la tienda, entrar con una cuenta de prueba y revisar el API o la base de datos. Para conocer cómo se organiza el código y cómo funciona cada parte, revisa el [README principal](README.md).

## 1. Iniciar el proyecto

1. Abre Docker Desktop y espera a que esté iniciado.
2. Abre esta carpeta del proyecto en VS Code y crea una terminal nueva.
3. Inicia MySQL, el backend y el frontend:

   ```powershell
   docker compose up -d
   ```

   Si modificaste código, reconstruye las imágenes al iniciar:

   ```powershell
   docker compose up -d --build
   ```

4. En Docker Desktop, abre **Containers** y confirma que `mysql`, `backend` y `frontend` estén activos.

| Servicio | Dirección |
| --- | --- |
| Tienda | <http://localhost> |
| Swagger | <http://localhost:8080/swagger-ui/index.html> |
| OpenAPI JSON | <http://localhost:8080/v3/api-docs> |

No necesitas instalar XAMPP. MySQL ya corre en Docker.

## 2. Entrar a la tienda

1. Abre <http://localhost>.
2. Para probar como cliente, entra a **Iniciar sesión → Crear cuenta** y registra un usuario. Después inicia sesión con ese correo y contraseña.
3. En **Productos**, agrega un artículo al carrito y completa el checkout con un resultado aprobado.
4. Abre **Mis compras** para ver las boletas del cliente. Una compra rechazada no crea una boleta.

Cuentas de demostración:

- Administrador: `admin.ep3@duoc.cl` / `Admin123!`
- Vendedor: `vendedor.ep3@duoc.cl` / `Vendedor123!`
- Cliente: usa las credenciales elegidas al registrarte.

## 3. Probar Swagger

1. Abre Swagger y busca **POST `/api/v1/auth/login`**.
2. Pulsa **Try it out**, ingresa el correo y contraseña de una de las cuentas anteriores y pulsa **Execute**.
3. Una respuesta `200` indica que el inicio de sesión funcionó. El JWT queda en una cookie `HttpOnly`: no copies nada de la respuesta.
4. En la misma pestaña, prueba un endpoint permitido al rol que inició sesión.

| Cuenta | Ejemplos de endpoints permitidos |
| --- | --- |
| Administrador | `GET /api/v1/users`, `GET /api/v1/products`, `GET /api/v1/boletas` |
| Vendedor | `GET /api/v1/products`, `GET /api/v1/boletas` |
| Cliente | `GET /api/v1/store/products`, `GET /api/v1/store/orders` |

El vendedor no puede consultar usuarios. **GET `/api/v1/users`** con sesión de vendedor responde `403 Forbidden`; es una restricción intencional. Para probarlo, inicia sesión en Swagger como administrador.

Si recibes `401`, vuelve a iniciar sesión en la misma pestaña. `403` significa que la sesión existe, pero el rol no tiene permiso para esa operación.

## 4. Revisar la base de datos

En la terminal de VS Code, dentro de la carpeta del proyecto, ejecuta:

```powershell
docker compose exec mysql mysql -utienda -p tienda_online
```

Contraseña local: `tienda_dev_2026`. Dentro de MySQL puedes listar las tablas y revisar las boletas:

```sql
SHOW TABLES;

SELECT b.id, b.numero, b.fecha, b.total, b.estado, u.email
FROM boleta b
JOIN usuario u ON u.id = b.usuario_id
ORDER BY b.id DESC;
```

Escribe `exit` para salir. La [nota detallada de pruebas](docs/NOTA_PRUEBAS_LOCAL.md) contiene una consulta para ver también las líneas de cada boleta.

## 5. Detener el proyecto

Desde la misma carpeta, ejecuta:

```powershell
docker compose stop
```

Los contenedores se detienen y MySQL conserva los datos. Evita `docker compose down -v`, porque puede borrar el volumen de la base.

## Manual de usuario

El manual con las instrucciones para usar la tienda está en [docs/Manual_Usuario_TiendaOnline.docx](docs/Manual_Usuario_TiendaOnline.docx).
