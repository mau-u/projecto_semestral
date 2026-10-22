# Pastelería Mil Sabores

Tienda académica desarrollada para la Evaluación Parcial 2 de DSY1104. El template HTML del caso se migró a una aplicación de una sola página en React y Vite.

## Ejecutar el proyecto

Requisitos: Node.js 22 o superior, pnpm y Google Chrome (para las pruebas Karma).

```bash
pnpm install
pnpm dev
```

En PowerShell de Windows, si aparece un error indicando que `pnpm.ps1` está bloqueado, ejecuta los lanzadores `.cmd`:

```powershell
pnpm.cmd install
pnpm.cmd dev
```

Para crear la versión de entrega y ejecutar las pruebas:

```bash
pnpm build
pnpm test
pnpm test:coverage
```

El informe HTML de cobertura se genera en `coverage/html/`.

## Recorrido de demostración

1. Revisa el catálogo, categorías, ofertas y detalle de un producto.
2. Agrega productos al carrito. En el detalle de una torta se puede incluir un mensaje personalizado.
3. Completa el checkout. Usa **Simular pago aprobado** para ver la confirmación y la boleta, o **Probar pago rechazado** para mostrar el flujo de error.
4. Puedes crear una cuenta con nombre sin números ni signos, correo `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`, fecha de nacimiento no futura y contraseña de 4 a 10 caracteres. También puedes iniciar sesión con esa cuenta.
5. En el checkout ingresa el celular en formato `+56912345678`; el campo fija el prefijo y elimina letras. La fecha de nacimiento se muestra desde el perfil, sin permitir editarla en la entrega.
6. Al aprobar una compra se descuenta la cantidad comprada del stock del catálogo. El pago rechazado no modifica inventario; el carrito no permite agregar unidades sobre el stock disponible.
7. En el checkout se aplican los beneficios del caso: 50% para mayores de 50 años, 10% con `FELICES50` y una torta gratis en el cumpleaños de clientes Duoc, si el carrito contiene una torta. Los descuentos se calculan en secuencia y se muestran en el resumen.
8. Para el panel administrativo, inicia sesión con `admin@duoc.cl` y contraseña `1234`. Desde ahí se pueden crear, editar productos y su stock; gestionar categorías; revisar stock crítico, órdenes, usuarios, auditoría e indicadores.
9. La portada incluye un video MP4 local en `public/video/pasteleria.mp4`; se reproduce desde el proyecto, sin insertar un reproductor de YouTube.

## Estructura

- `src/views/`: vistas de tienda, compra, cuenta y contenido informativo.
- `src/components/`: navegación, tarjetas y componentes administrativos.
- `src/data/products.js`: catálogo inicial y datos de ejemplo.
- `src/data/persistence.js`: repositorios CRUD, catálogo persistente, auditoría y lógica del carrito.
- `src/utils/validation.js` y `src/utils/promotions.js`: reglas de validación y beneficios aplicados al pedido.
- `src/**/*.spec.jsx`: pruebas unitarias con Jasmine ejecutadas por Karma.
- `public/img/`: imágenes incluidas en el proyecto semestral original.
- `public/video/pasteleria.mp4`: video local de elaboración de pastelería, de Marwan Tj para Pexels, bajo la [licencia gratuita de Pexels](https://www.pexels.com/license/). El [clip original](https://www.pexels.com/video/close-up-on-preparing-cake-for-cooking-10763507/) se incluye en el proyecto para reproducirse sin YouTube.
- `reference/`: copia de consulta del template entregado en el ZIP.

## Persistencia y alcance

Los productos, categorías, usuarios, órdenes, eventos de auditoría y carrito se guardan en `localStorage`, por lo que los cambios permanecen al recargar el mismo navegador. La cuenta y las contraseñas son solo una simulación académica local: no uses una contraseña personal. Todavía no hay API ni backend conectado y el pago es una simulación.
