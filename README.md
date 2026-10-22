# Pastelería Mil Sabores

Aplicación web académica desarrollada para la **Evaluación Parcial 2 de DSY1104 – Desarrollo Fullstack II**. El proyecto adapta el template HTML del caso a una aplicación de una sola página (SPA) construida con React y Vite.

La tienda permite explorar un catálogo de productos de pastelería, gestionar un carrito y simular una compra. También incorpora un panel de administración para gestionar el catálogo y consultar la actividad de la tienda.

> **Importante:** es una demostración académica de frontend. La aplicación guarda los datos en el navegador y simula la autenticación y el pago; no está conectada a un backend ni procesa transacciones reales.

## Contenido

- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Comandos disponibles](#comandos-disponibles)
- [Funciones de la aplicación](#funciones-de-la-aplicación)
- [Recorrido de demostración](#recorrido-de-demostración)
- [Pruebas automatizadas](#pruebas-automatizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Persistencia y alcance](#persistencia-y-alcance)
- [Recursos multimedia](#recursos-multimedia)

## Tecnologías

- **React** para construir la interfaz mediante componentes y administrar el estado de la aplicación.
- **Vite** para ejecutar el servidor de desarrollo y generar la versión de producción.
- **JavaScript (ES modules)** para la lógica de la tienda.
- **Bootstrap 5** para apoyar el diseño adaptable de formularios, botones, cuadrículas y otros elementos; se complementa con estilos propios en `src/styles.css`.
- **localStorage** para persistir datos en el navegador.
- **Jasmine y Karma** para definir y ejecutar pruebas automatizadas. Webpack y Babel procesan los archivos de prueba, y Karma genera reportes de cobertura.

## Requisitos

- **Node.js 22.12 o superior**. También se admite Node.js 20.19 o superior, según los [requisitos oficiales de Vite 7](https://vite.dev/blog/announcing-vite7).
- **pnpm**, para instalar las dependencias definidas en `pnpm-lock.yaml`.
- **Google Chrome**, necesario para ejecutar las pruebas con Karma en modo `ChromeHeadless`.

Puedes comprobar las versiones instaladas con:

```bash
node -v
pnpm -v
```

## Instalación y ejecución

Abre una terminal en la carpeta raíz del proyecto, donde se encuentran `package.json` y `pnpm-lock.yaml`.

Instala las dependencias:

```bash
pnpm install
```

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

### Windows PowerShell

Si PowerShell bloquea el script `pnpm.ps1`, usa el lanzador `.cmd`:

```powershell
pnpm.cmd install
pnpm.cmd dev
```

Si usas un administrador de versiones de Node.js, asegúrate de que `node` y `pnpm` se ejecuten desde una instalación compatible. Este proyecto utiliza pnpm; evita mezclar instalaciones de dependencias con distintos gestores de paquetes.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm install` | Instala las dependencias del proyecto. |
| `pnpm dev` | Inicia el servidor de desarrollo de Vite. |
| `pnpm build` | Genera la versión de producción en `dist/`. |
| `pnpm preview` | Sirve localmente la versión de producción generada. |
| `pnpm test` | Ejecuta las pruebas con Karma y Chrome sin interfaz gráfica. |
| `pnpm test:coverage` | Ejecuta la tarea de pruebas con la opción de cobertura. |

Los reportes de cobertura HTML se generan en `coverage/html/`. La ejecución puede requerir que Google Chrome esté instalado y disponible para Karma.

## Funciones de la aplicación

### Tienda para clientes

- Portada con productos destacados, categorías, beneficios e información de la pastelería.
- Catálogo con búsqueda por nombre, código o categoría, filtros, ordenamiento y sección de ofertas.
- Detalle de producto con precio, stock disponible y selector de cantidad.
- Mensaje personalizado para productos de la categoría de tortas.
- Carrito con cantidades, eliminación de productos y resumen de importes.
- Checkout con datos de contacto, dirección, región, comuna, método de entrega y medio de pago.
- Resultado de compra aprobado o rechazado, con resumen de la orden.
- Páginas informativas de historia, blog y contacto.

### Cuenta de cliente

- Registro e inicio de sesión de demostración.
- Validación de nombre, correo, fecha de nacimiento y número de celular chileno.
- Código promocional opcional.

### Panel administrativo

- Resumen de indicadores de la tienda.
- Creación, edición y eliminación de productos.
- Administración de categorías.
- Consulta de stock crítico (cuatro unidades o menos).
- Consulta de órdenes y detalle de boletas.
- Consulta y edición del nombre de usuarios.
- Perfil de administración.
- Reportes de ventas y distribución de productos por categoría.
- Registro de auditoría para eventos de cuenta, pedidos, descuentos, inventario y pagos simulados.

## Recorrido de demostración

1. **Explora el catálogo.** Revisa categorías, ofertas, búsqueda, filtros y el detalle de un producto.
2. **Prueba el carrito.** Agrega uno o más productos. En el detalle de una torta, escribe un mensaje personalizado si corresponde.
3. **Completa el checkout.** Ingresa los datos solicitados y selecciona despacho o retiro.
4. **Prueba ambos resultados del pago.** Usa **Simular pago aprobado** para ver la confirmación y la boleta; usa **Probar pago rechazado** para revisar el flujo de rechazo. No se realiza ningún cobro real.
5. **Prueba el registro.** El formulario acepta nombres sin números ni signos, y correos de los dominios `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`. La fecha no puede ser futura y la contraseña debe tener entre 4 y 10 caracteres.
6. **Revisa el teléfono.** El checkout utiliza el formato chileno `+56912345678`. La fecha de nacimiento se obtiene de los datos de la cuenta y se muestra en el checkout sin permitir su edición allí.
7. **Comprueba el inventario.** Un pago aprobado descuenta del stock la cantidad comprada. Un pago rechazado no descuenta inventario. El carrito también valida las unidades disponibles antes de agregar más.
8. **Prueba los beneficios promocionales.** La lógica contempla un descuento del 50 % para clientes mayores de 50 años, un 10 % con el código `FELICES50` y un beneficio de cumpleaños Duoc equivalente a una torta, si se cumplen las condiciones definidas por el sistema. Los descuentos se aplican en secuencia y se detallan en el resumen.
9. **Entra al panel administrativo.** Utiliza la cuenta de demostración indicada a continuación para acceder al panel y probar la gestión de productos, categorías, usuarios, órdenes, stock y auditoría.
10. **Revisa la portada.** El video de elaboración se reproduce desde el archivo local `public/video/pasteleria.mp4`, sin incrustar YouTube.

### Cuenta demo de administración

- **Correo:** `admin@duoc.cl`
- **Contraseña:** `1234`

Estas credenciales son públicas y se incluyen solo para la demostración académica. No las uses como contraseña de una cuenta real.

## Pruebas automatizadas

Las pruebas están escritas con Jasmine y se ejecutan en el navegador mediante Karma. Para ejecutarlas:

```bash
pnpm test
```

Para la tarea de cobertura:

```bash
pnpm test:coverage
```

Las pruebas existentes cubren componentes de navegación y tarjetas de producto, operaciones de persistencia y carrito, validaciones, promociones y el flujo del checkout. Si una prueba falla, revisa el mensaje de Karma en la terminal para identificar el archivo y la comprobación que no se cumplió.

## Estructura del proyecto

```text
projecto_semestral/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.js                 # configuración de Vite
├── babel.config.cjs
├── karma.conf.cjs
├── public/
│   ├── img/                       # imágenes de la tienda
│   └── video/
│       └── pasteleria.mp4
├── src/
│   ├── main.jsx                   # punto de entrada de React
│   ├── App.jsx                    # estado, navegación y lógica general
│   ├── styles.css                 # estilos propios
│   ├── components/                # componentes reutilizables
│   │   └── admin/                 # componentes del panel administrativo
│   ├── data/
│   │   ├── products.js            # datos iniciales del catálogo
│   │   ├── persistence.js         # repositorios, carrito y stock
│   │   └── persistence.spec.jsx   # pruebas de persistencia
│   ├── utils/
│   │   ├── format.js              # formato de fechas y precios
│   │   ├── validation.js           # reglas de validación
│   │   ├── validation.spec.js
│   │   ├── promotions.js           # reglas promocionales
│   │   └── promotions.spec.js
│   └── views/                     # pantallas de tienda y checkout
│       └── *.spec.jsx              # pruebas de vistas
└── reference/                      # template HTML original para consulta
```

## Persistencia y alcance

La aplicación utiliza `localStorage` para guardar, en el navegador actual, el catálogo, las categorías, los usuarios, las órdenes, el carrito, la sesión de demostración y los eventos de auditoría. Los datos pueden mantenerse al recargar la página en ese mismo navegador, pero no se sincronizan entre dispositivos.

La autenticación y el pago son simulados. No hay API ni servidor conectado, y el formulario de contacto no envía correos reales. Por ese motivo, este proyecto demuestra el flujo de interfaz y la lógica del lado del cliente, pero no constituye un sistema de comercio electrónico listo para producción.

## Recursos multimedia

El video local `public/video/pasteleria.mp4` se atribuye a Marwan Tj para Pexels. Consulta la [licencia de Pexels](https://www.pexels.com/license/) y el [clip original](https://www.pexels.com/video/close-up-on-preparing-cake-for-cooking-10763507/).

Las imágenes de la tienda se encuentran en `public/img/`. La carpeta `reference/` conserva una copia de consulta del template original entregado para el caso.
