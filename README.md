# Pastelería Mil Sabores

Tienda en línea para explorar productos de pastelería, comprar y consultar pedidos. Incluye una interfaz React, una API en Java y una base de datos MySQL. Docker Compose conecta los servicios para ejecutar la aplicación localmente.

Para iniciar sesión y seguir los pasos de prueba, consulta la [guía rápida de uso](README_DSY1104.md). Para revisar consultas SQL y pruebas de Swagger con más detalle, consulta la [nota de pruebas](docs/NOTA_PRUEBAS_LOCAL.md).

## Tecnologías

- **Frontend:** React 19, JavaScript, Vite 7 y Bootstrap 5.
- **Backend:** Java 21, Spring Boot 3, Spring Security y API REST.
- **Autenticación:** JWT en cookie `HttpOnly` y autorización basada en roles.
- **Base de datos:** MySQL 8.4 con persistencia relacional.
- **Ejecución local:** Docker Compose y Nginx.
- **Documentación del API:** Swagger UI y OpenAPI.

## Cómo está construido

El frontend presenta las vistas y recoge las acciones del usuario. `src/App.jsx` mantiene el estado general de la tienda, interpreta las rutas y coordina el acceso a los servicios. `src/services/api.js` hace las llamadas al backend. Nginx sirve los archivos de React y redirige las solicitudes `/api` al backend.

Spring Boot recibe esas solicitudes en los controladores, valida los datos, aplica las reglas de negocio y comprueba el rol del usuario. Los servicios ejecutan las operaciones y los repositorios consultan las entidades de MySQL.

En un checkout aprobado, el backend obtiene los precios actuales desde la base de datos, valida stock, crea una boleta y sus detalles y descuenta las unidades en una transacción. Cuando el cliente abre **Mis compras**, el backend devuelve las boletas asociadas a su cuenta.

## Navegación de la tienda

El recorrido normal del cliente es:

**Inicio → Productos o Categorías → Detalle del producto → Carrito → Checkout → Resultado de pago → Mis compras.**

La navegación también incluye ofertas, Nosotros, Blog y Contacto. Las vistas principales se abren con rutas hash, por ejemplo `#/productos`, `#/carrito` y `#/mis-compras`.

| Ruta | Vista |
| --- | --- |
| `#/` | Portada de la tienda. |
| `#/productos`, `#/categorias`, `#/categoria/:slug`, `#/ofertas` | Catálogo, categorías y ofertas. |
| `#/producto/:id` | Detalle de un producto. |
| `#/carrito`, `#/checkout` | Carrito y confirmación del pedido. |
| `#/pago/exito`, `#/pago/fallido` | Resultado del pago simulado. |
| `#/login`, `#/registro`, `#/mis-compras` | Cuenta del cliente y su historial. |
| `#/vendedor` | Panel de consulta del vendedor. |
| `#/admin/inicio`, `#/admin/productos`, `#/admin/categorias`, `#/admin/ordenes`, `#/admin/usuarios` | Secciones del panel de administración. También incluye stock crítico, auditoría, reportes y perfil. |

| Área | Qué permite hacer |
| --- | --- |
| Tienda | Explorar y filtrar el catálogo, ver productos y categorías, usar el carrito y completar el checkout. |
| Cliente | Registrarse, iniciar sesión y consultar sus propias compras. |
| Vendedor | Consultar productos y boletas desde su panel. |
| Administrador | Administrar productos, categorías y usuarios, revisar órdenes y consultar informes. |

## Roles y permisos

- **Administrador:** acceso de gestión a productos, categorías y usuarios; puede consultar y anular boletas.
- **Vendedor:** solo consulta productos y boletas. No tiene permiso para ver usuarios; por eso `GET /api/v1/users` responde `403 Forbidden` con este rol.
- **Cliente:** compra en la tienda y consulta sus propios pedidos mediante `GET /api/v1/store/orders`.

Los productos y categorías públicos se consultan bajo `/api/v1/store`. El inicio de sesión en `POST /api/v1/auth/login` guarda el JWT en una cookie protegida. En Swagger, las operaciones autenticadas deben probarse en la misma pestaña después del login.

## Estructura del proyecto

```text
projecto_semestral/
├── backend/
│   └── src/
│       ├── main/java/cl/dsy1104/tienda/
│       │   ├── config/       # Seguridad, OpenAPI y datos iniciales
│       │   ├── controller/   # Endpoints REST /api/v1
│       │   ├── dto/          # Formatos de entrada y salida del API
│       │   ├── entity/       # Usuario, producto, categoría y boleta
│       │   ├── repository/   # Consultas a MySQL con Spring Data
│       │   ├── security/     # JWT, cookie y contexto del usuario
│       │   └── service/      # Reglas de negocio y operaciones
│       ├── main/resources/   # Configuración de Spring
│       └── test/             # Pruebas del backend
├── docs/                     # Manual, requisitos, modelo y guías de prueba
├── public/                   # Imágenes y recursos estáticos
├── reference/                # Plantillas HTML originales de referencia
├── src/
│   ├── components/           # Componentes reutilizables e interfaz admin
│   ├── data/                 # Datos base, carrito y persistencia local
│   ├── services/api.js       # Cliente HTTP para el backend
│   ├── utils/                # Validación, formato y promociones
│   ├── views/                # Pantallas de tienda y paneles
│   ├── App.jsx               # Navegación y coordinación de vistas
│   └── styles.css            # Estilos de la aplicación
├── docker-compose.yml        # MySQL, backend y frontend
├── Dockerfile                # Construcción del frontend
└── nginx.conf                # Sitio estático y proxy hacia el API
```

## API y modelo de datos

El API está versionado bajo `/api/v1`. Sus grupos principales son:

- `/auth`: registro, login, perfil y cierre de sesión.
- `/store`: catálogo público, checkout y compras del cliente autenticado.
- `/products`, `/categories`, `/users`: operaciones de administración según el rol.
- `/boletas`: consulta de boletas y anulación administrativa.

Las tablas principales son `usuario`, `producto`, `categoria`, `boleta` y `detalle_boleta`. Una boleta pertenece a un usuario y contiene sus líneas de detalle. Docker Compose mantiene la base en el volumen `mysql_data` para conservar los datos cuando se detienen los contenedores.

## Alcance de la demostración

El pago es simulado para fines académicos: no se conecta a un proveedor de pagos real. El carrito se mantiene en el navegador; las cuentas, catálogo, inventario, boletas y detalles confirmados se guardan en MySQL.

Las pruebas existentes están en `src/**/*.spec.*` y `backend/src/test`. En esta entrega se verificó la compilación del frontend y de las imágenes Docker; las pruebas automatizadas no se ejecutaron.

## Documentación relacionada

- [Guía rápida: entrar y probar la aplicación](README_DSY1104.md)
- [Nota detallada: tienda, Swagger y MySQL](docs/NOTA_PRUEBAS_LOCAL.md)
- [Manual de usuario](docs/Manual_Usuario_TiendaOnline.docx)
- [Requisitos del sistema](docs/ERS_TiendaOnline.docx)
- [Documentación de APIs e integración](docs/Documentacion_APIs_Integracion_TiendaOnline.docx)
- [Matriz de pruebas y rúbrica](docs/Matriz_de_Pruebas_y_Rubrica.md)
- Diagramas: `docs/modelo_relacional.png` y `docs/arquitectura_integracion.png`.
