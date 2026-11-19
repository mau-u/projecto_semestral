# Guía de pruebas locales: Pastelería Mil Sabores

Esta guía explica cómo iniciar la aplicación con Docker, probar la tienda, probar el API en Swagger y verificar en MySQL que una compra quedó guardada.

## 1. Iniciar la aplicación

1. Abre Docker Desktop y espera a que indique que Docker está activo.
2. Abre la carpeta del proyecto en VS Code (`projecto_semestral` si lo clonaste desde GitHub).
3. En la terminal de VS Code ejecuta:

   ```powershell
   docker compose up -d
   ```

   Si cambiaste código y quieres reconstruir las imágenes, ejecuta:

   ```powershell
   docker compose up -d --build
   ```

4. Comprueba en Docker Desktop, en **Containers**, que `mysql`, `backend` y `frontend` aparezcan activos.

Direcciones locales:

- Tienda: <http://localhost>
- Swagger: <http://localhost:8080/swagger-ui/index.html>
- API OpenAPI: <http://localhost:8080/v3/api-docs>

## 2. Cuentas de prueba

Cuenta de administración:

- Correo: `admin.ep3@duoc.cl`
- Contraseña: `Admin123!`

Cuenta de vendedor:

- Correo: `vendedor.ep3@duoc.cl`
- Contraseña: `Vendedor123!`

No hay una contraseña universal de cliente. Crea una cuenta en <http://localhost/#/registro> y luego usa el correo y la contraseña que elegiste.

## 3. Probar la tienda

1. Abre <http://localhost>.
2. Registra una cuenta de cliente o inicia sesión con la que ya creaste.
3. Entra a **Productos**, agrega uno al carrito y completa el checkout.
4. Selecciona un resultado de pago aprobado para que la compra se envíe al backend y se guarde en MySQL.
5. Abre **Mis compras**. La boleta y sus detalles deberían aparecer asociados a la cuenta del cliente que hizo la compra.

Un pago rechazado no crea una boleta.

## 4. Probar el API con Swagger

Haz las pruebas de autenticación y de endpoints protegidos en la misma pestaña del navegador.

### Iniciar sesión

1. Abre **POST `/api/v1/auth/login`**.
2. Pulsa **Try it out** y pega las credenciales de vendedor, por ejemplo:

   ```json
   {
     "email": "vendedor.ep3@duoc.cl",
     "password": "Vendedor123!"
   }
   ```

3. Pulsa **Execute**. Una respuesta `200` con “Autenticación exitosa” confirma el login.
4. No copies ni guardes un token del cuerpo: el backend lo guarda automáticamente en una cookie protegida `HttpOnly`.

### Pruebas según el rol

Los permisos se aplican en el backend, aunque Swagger muestre todos los endpoints:

| Rol | Pruebas permitidas |
| --- | --- |
| Administrador | GET, POST, PUT y DELETE de productos, categorías y usuarios; GET y DELETE de boletas. |
| Vendedor | Solo GET de productos (`/api/v1/products`) y boletas (`/api/v1/boletas`). |
| Cliente | Productos y categorías de la tienda; POST de checkout y GET de sus propias compras (`/api/v1/store/orders`). |

**GET `/api/v1/users` es solo para ADMIN.** Si iniciaste sesión como vendedor y ejecutas ese GET, el resultado esperado es `403 Forbidden`: el login funcionó, pero ese rol no tiene permiso para ver usuarios. Para probarlo, ejecuta de nuevo **POST `/api/v1/auth/login`** con la cuenta de administración en la misma pestaña:

```json
{
  "email": "admin.ep3@duoc.cl",
  "password": "Admin123!"
}
```

Luego ejecuta **GET `/api/v1/users`**. El nuevo inicio de sesión reemplaza la cookie de la sesión anterior.

Con la cuenta de vendedor puedes probar:

- **GET `/api/v1/products`**: consultar productos.
- **GET `/api/v1/boletas`**: consultar boletas.

Para probar compras de cliente:

1. Ejecuta **POST `/api/v1/auth/login`** con el correo y contraseña de la cuenta cliente.
2. Ejecuta **GET `/api/v1/store/orders`** para consultar las compras de ese cliente.
3. Ejecuta **GET `/api/v1/store/products`** para consultar productos de la tienda.

Para probar un checkout directamente desde Swagger, inicia sesión como cliente y usa **POST `/api/v1/store/checkout`**. Sustituye `productoId` por un ID que exista, consultándolo primero en **GET `/api/v1/store/products`**:

```json
{
  "items": [
    { "productoId": 1, "cantidad": 1 }
  ],
  "telefono": "+56912345678",
  "direccion": "Avenida de prueba 123",
  "region": "Región Metropolitana de Santiago",
  "comuna": "Providencia",
  "tipoEntrega": "despacho",
  "metodoPago": "Tarjeta",
  "promoCode": ""
}
```

Una respuesta `201` confirma que se creó la boleta. Después vuelve a ejecutar **GET `/api/v1/store/orders`** con la sesión del mismo cliente.

Si obtienes `401`, vuelve a iniciar sesión en esa misma pestaña de Swagger. Si obtienes `403`, el usuario inició sesión, pero su rol no tiene permiso para ese endpoint.

## 5. Verificar compras directamente en MySQL

No necesitas instalar XAMPP: MySQL ya se ejecuta dentro del contenedor Docker. En la terminal de VS Code, desde la carpeta del proyecto, ejecuta:

```powershell
docker compose exec mysql mysql -utienda -p tienda_online
```

Cuando MySQL solicite la contraseña, ingresa:

```text
tienda_dev_2026
```

Dentro de MySQL, lista las tablas y consulta las últimas boletas:

```sql
SHOW TABLES;

SELECT b.id, b.numero, b.fecha, b.total, b.estado, u.email
FROM boleta b
JOIN usuario u ON u.id = b.usuario_id
ORDER BY b.id DESC;
```

Para ver los productos y cantidades de cada boleta:

```sql
SELECT b.numero, p.nombre, d.cantidad, d.precio_unitario, d.subtotal
FROM detalle_boleta d
JOIN boleta b ON b.id = d.boleta_id
JOIN producto p ON p.id = d.producto_id
ORDER BY b.id DESC, d.id DESC;
```

Escribe `exit` para salir de MySQL. Las tablas principales son `usuario`, `producto`, `categoria`, `boleta` y `detalle_boleta`.

## 6. Detener la aplicación

Cuando termines las pruebas, desde la carpeta del proyecto ejecuta:

```powershell
docker compose stop
```

Esto detiene los contenedores y conserva los datos. Para volver a iniciar, usa `docker compose up -d`. Evita `docker compose down -v`, porque `-v` puede eliminar los datos de MySQL.
