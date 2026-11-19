# Backend — Tienda Online API (DSY1104)

API REST desarrollada con Java 21 y Spring Boot 3.3.5.

## Requisitos

- Java 21.
- Apache Maven 3.9+ (el archivo `mvnw` incluido es un lanzador simple y requiere Maven instalado).
- MySQL 8+.

## Configuración local

Crear una base de datos `tienda_online` y configurar las variables indicadas en `.env.example` en el entorno de ejecución. `application.yml` contiene valores de desarrollo local para conexión MySQL; deben cambiarse para cada equipo.

En PowerShell, dentro de la carpeta backend:

```powershell
mvn spring-boot:run
```

Swagger: `http://localhost:8080/swagger-ui.html`
OpenAPI: `http://localhost:8080/v3/api-docs`
API versionada: `http://localhost:8080/api/v1`

## Pruebas

```powershell
mvn test
```

La suite contiene pruebas de integración de registro, login, cookie HttpOnly, renovación JWT y autorización por roles. El proyecto incluye configuración de perfil de test con H2.

## Variables importantes

`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (mínimo 32 bytes), `JWT_EXPIRATION_MS`, `COOKIE_SECURE`, `FRONTEND_URL`, `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
