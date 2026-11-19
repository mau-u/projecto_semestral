# Matriz de trazabilidad y pruebas — DSY1104 EP3

Esta matriz vincula los requisitos de la Evaluación Parcial 3 con componentes del proyecto y una verificación práctica. Los resultados deben marcarse después de ejecutar las pruebas en el computador del equipo.

## Situación evaluativa 1 — Entrega grupal (40%)

| Indicador | Implementación del proyecto | Verificación propuesta | Resultado |
|---|---|---|---|
| IE3.1.1 — Backend conectado a base de datos (8%) | Spring Boot, Spring Data JPA, MySQL; entidades Usuario, Boleta, DetalleBoleta, Producto y Categoria; servicios con reglas de negocio | Iniciar servicios; comprobar creación de tablas y datos semilla; registrar usuario; crear producto; realizar compra y comprobar stock/boleta | Pendiente de ejecución local |
| IE3.2.1 — API REST CRUD y Swagger (8%) | Controladores versionados `/api/v1`, operaciones CRUD para productos/categorías/usuarios y Swagger/OpenAPI | Abrir Swagger; ejecutar GET/POST/PUT/DELETE con rol ADMIN; comprobar respuestas 200/201/204 y validaciones 400 | Pendiente de ejecución local |
| IE3.2.2 — Integración REST (6%) | React `fetch`, cliente centralizado en `src/services/api.js`, Nginx reverse proxy y API JSON | Cargar catálogo, comprar como CLIENTE y revisar “Mis compras”; confirmar solicitudes en DevTools | Catálogo, OpenAPI y web respondieron HTTP 200; compra completa pendiente de recorrido |
| IE3.3.1 — Roles y JWT backend (6%) | Spring Security, BCrypt, JWT firmado, cookie HttpOnly y permisos ADMIN/VENDEDOR/CLIENTE | Comprobar perfiles contra endpoints de lectura y verificar que las rutas fuera de su rol rechacen el acceso | Login ADMIN/VENDEDOR y consultas de catálogo/productos/boletas confirmadas; ADMIN consultó usuarios; endpoint de usuarios rechazó VENDEDOR (401) |
| IE3.3.2 — Sesión frontend (6%) | `App.jsx` consulta `/auth/me`; el cliente REST usa `credentials: include`; JWT no se guarda en localStorage | Iniciar sesión, recargar la página y comprobar que sigue autenticado; cerrar sesión y verificar expiración de cookie | Pendiente de ejecución local |
| IE3.3.3 — Restricciones frontend (6%) | Enrutamiento de `App.jsx`, `Header.jsx`, panel ADMIN y vista VENDEDOR; autorización Spring Security | Comparar menú y rutas con ADMIN, VENDEDOR y CLIENTE; intentar entrar a una sección restringida | Pendiente de recorrido por cada rol |

## Situación evaluativa 2 — Presentación individual (60%)

| Indicador | Explicación que debe dominar cada integrante | Evidencia en el proyecto |
|---|---|---|
| IE3.1.2 (12%) | Conexión a MySQL, cinco entidades, relaciones, repositorios, transacción de compra, control de stock y precio histórico | Diagrama `modelo_relacional.png`, `backend/src/main/java/.../entity` y `service/BoletaService.java` |
| IE3.2.3 (12%) | Versionado REST, verbos CRUD, DTO, validación, códigos HTTP y documentación Swagger | Controladores `ProductoController`, `CategoriaController`, `UsuarioController`; Swagger UI |
| IE3.2.4 (10%) | Flujo desde componente React y `fetch` al controlador, servicio, repositorio y MySQL, con retorno JSON a la UI | `src/services/api.js`, vistas React y `arquitectura_integracion.png` |
| IE3.3.4 (10%) | Login, BCrypt, generación y validación JWT, cookie HttpOnly, filtro y permisos por rol | `AuthService`, `JwtService`, `JwtAuthenticationFilter` y `SecurityConfig` |
| IE3.3.5 (8%) | Restauración de usuario al recargar, cookie persistente y logout | `src/App.jsx`, `src/services/api.js` y `AuthController.java` |
| IE3.3.6 (8%) | Menús/rutas diferenciados por rol y autorización reforzada en backend | `src/App.jsx`, `src/components/Header.jsx`, `src/views/SellerView.jsx` y `SecurityConfig.java` |

## Casos de prueba manuales

### Arranque y disponibilidad

1. Ejecutar `docker compose up --build` desde la raíz.
2. Esperar a que el contenedor MySQL pase el healthcheck y el backend termine de iniciar.
3. Abrir `http://localhost` y comprobar que carga la tienda.
4. Abrir `http://localhost:8080/swagger-ui.html` y comprobar la documentación.

**Esperado:** frontend, backend y base de datos levantan sin errores. La primera carga inicializa el administrador de desarrollo y el catálogo de ejemplo.

### Registro, login y persistencia

1. Registrar un cliente con correo no utilizado y contraseña de al menos ocho caracteres.
2. Iniciar sesión con ese usuario.
3. Abrir DevTools → Application/Storage → Cookies; revisar que exista `TIENDA_ACCESS` y tenga atributo HttpOnly (no copiar el contenido del token).
4. Recargar la página y comprobar que el usuario permanece autenticado.
5. Cerrar sesión y comprobar que vuelve al acceso.

**Esperado:** el registro público asigna `CLIENTE`; el JWT no se expone en `localStorage` ni `sessionStorage`; el logout elimina la cookie.

### Compra e inventario

1. Iniciar sesión como CLIENTE.
2. Agregar un producto disponible al carrito y confirmar la compra.
3. Abrir “Mis compras” y revisar la boleta y sus detalles.
4. Consultar el catálogo nuevamente para revisar el stock.
5. Probar una cantidad mayor al stock disponible.

**Esperado:** se registra una boleta, se guarda cantidad/precio/subtotal y se descuenta stock. La solicitud con stock insuficiente debe ser rechazada y no debe crear una boleta parcial.

### Roles y permisos

| Usuario | Acción | Resultado esperado |
|---|---|---|
| ADMIN | GET/POST/PUT/DELETE `/api/v1/products` | Permitido |
| ADMIN | GET/POST/PUT/DELETE `/api/v1/categories` | Permitido |
| ADMIN | GET/POST/PUT/DELETE `/api/v1/users` | Permitido |
| VENDEDOR | GET `/api/v1/products` y GET `/api/v1/boletas` | Permitido |
| VENDEDOR | POST/PUT/DELETE productos, categorías administrativas, usuarios o DELETE boletas | 401/403 (acceso rechazado) |
| CLIENTE | GET tienda, POST `/api/v1/store/checkout`, GET `/api/v1/store/orders` | Permitido |
| CLIENTE | GET administración `/api/v1/users` o boletas generales `/api/v1/boletas` | 401/403 (acceso rechazado) |
| Sin sesión | GET ruta protegida | 401 |

### Códigos y validaciones

- 200: consulta/actualización correcta.
- 201: creación de recursos.
- 204: desactivación/eliminación correcta.
- 400: JSON inválido, campos incompletos, stock insuficiente o reglas de negocio incumplidas.
- 401: credenciales incorrectas o sesión no válida.
- POST `/api/v1/auth/refresh` con cookie vigente: 200 y nueva cookie HttpOnly.
- 403: usuario autenticado sin rol requerido.
- 404: ID no encontrado.

## Registro de resultados del equipo

Completar durante la prueba presencial o antes de entregar:

| Prueba | Fecha | Integrante | Resultado (OK/ERROR) | Observación/captura |
|---|---|---|---|---|
| Arranque Docker Compose | | | | |
| Swagger y CRUD | | | | |
| Registro/login/HttpOnly | | | | |
| Recarga y logout | | | | |
| Compra y stock | | | | |
| Permisos ADMIN | | | | |
| Permisos VENDEDOR | | | | |
| Permisos CLIENTE | | | | |
