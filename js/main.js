document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('registerForm');

    if (form) {

        form.addEventListener('submit', (e) => {

            e.preventDefault();

            document.getElementById('errorName').textContent = '';
            document.getElementById('errorEmail').textContent = '';
            document.getElementById('errorAge').textContent = '';
            document.getElementById('formSuccess').textContent = '';

            let isValid = true;

            const fullName = document.getElementById('fullName').value.trim();

            if (fullName === '') {
                document.getElementById('errorName').textContent =
                    'El nombre completo es obligatorio.';
                isValid = false;
            }

            const email = document.getElementById('email').value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                document.getElementById('errorEmail').textContent =
                    'Ingrese un correo electrónico válido.';
                isValid = false;
            }

            const age = parseInt(document.getElementById('age').value);

            if (isNaN(age) || age < 1) {
                document.getElementById('errorAge').textContent =
                    'Ingrese una edad válida.';
                isValid = false;
            }

            if (isValid) {

                let benefits = [];

                if (age >= 50) {
                    benefits.push(
                        '50% de descuento por ser mayor de 50 años'
                    );
                }

                const promoCode =
                    document.getElementById('promoCode').value.trim();

                if (promoCode.toUpperCase() === 'FELICES50') {
                    benefits.push(
                        '10% de descuento de por vida'
                    );
                }

                if (
                    email.endsWith('@duocuc.cl') ||
                    email.endsWith('@alumnos.duoc.cl')
                ) {
                    benefits.push(
                        'Torta gratis en tu cumpleaños (Estudiante Duoc UC)'
                    );
                }

                let msg = '¡Registro exitoso!';

                if (benefits.length > 0) {
                    msg +=
                        ' Beneficios aplicados: ' +
                        benefits.join(', ') +
                        '.';
                }

                document.getElementById('formSuccess').textContent = msg;

                form.reset();
            }

        });

    }

});


const productos = [
    {
        codigo: "TC001",
        nombre: "Torta Cuadrada de Chocolate",
        precio: 45000
    },
    {
        codigo: "TC002",
        nombre: "Torta Cuadrada de Frutas",
        precio: 50000
    },
    {
        codigo: "TT001",
        nombre: "Torta Circular de Vainilla",
        precio: 40000
    },
    {
        codigo: "TT002",
        nombre: "Torta Circular de Manjar",
        precio: 42000
    },
    {
        codigo: "PI001",
        nombre: "Mousse de Chocolate",
        precio: 5000
    },
    {
        codigo: "PI002",
        nombre: "Tiramisú Clásico",
        precio: 5500
    },
    {
        codigo: "PSA001",
        nombre: "Torta Sin Azúcar de Naranja",
        precio: 48000
    },
    {
        codigo: "PSA002",
        nombre: "Cheesecake Sin Azúcar",
        precio: 47000
    },
    {
        codigo: "PT001",
        nombre: "Empanada de Manzana",
        precio: 3000
    },
    {
        codigo: "PT002",
        nombre: "Tarta de Santiago",
        precio: 6000
    },
    {
        codigo: "PG001",
        nombre: "Brownie Sin Gluten",
        precio: 4000
    },
    {
        codigo: "PG002",
        nombre: "Pan Sin Gluten",
        precio: 3500
    },
    {
        codigo: "PV001",
        nombre: "Torta Vegana de Chocolate",
        precio: 50000
    },
    {
        codigo: "PV002",
        nombre: "Galletas Veganas de Avena",
        precio: 4500
    },
    {
        codigo: "TE001",
        nombre: "Torta Especial de Cumpleaños",
        precio: 55000
    },
    {
        codigo: "TE002",
        nombre: "Torta Especial de Boda",
        precio: 60000
    }
];


const productContainer = document.getElementById('productContainer');

if (productContainer) {

    productos.forEach((producto) => {

        const card = document.createElement('article');

        card.classList.add('product-card');

        card.innerHTML = `
            <img
                src="https://via.placeholder.com/200"
                alt="${producto.nombre}"
            >

            <h3>${producto.nombre}</h3>

            <p class="code">
                Código: ${producto.codigo}
            </p>

            <p class="price">
                $${producto.precio.toLocaleString('es-CL')} CLP
            </p>

            <button onclick="verDetalle('${producto.codigo}')">
                Ver detalle
            </button>
        `;

        productContainer.appendChild(card);

    });

}


function verDetalle(codigo) {

    window.location.href = `detalle.html?codigo=${codigo}`;

}


const parametros = new URLSearchParams(window.location.search);

const codigo = parametros.get('codigo');

const producto = productos.find(
    (producto) => producto.codigo === codigo
);


const productDetail = document.getElementById('productDetail');

if (productDetail && producto) {

    productDetail.innerHTML = `
        <img
            src="https://via.placeholder.com/400"
            alt="${producto.nombre}"
        >

        <h2>${producto.nombre}</h2>

        <p class="code">
            Código: ${producto.codigo}
        </p>

        <p class="price">
            $${producto.precio.toLocaleString('es-CL')} CLP
        </p>

        <button onclick="agregarAlCarrito('${producto.codigo}')">
            Añadir al carrito
        </button>
    `;

}


function obtenerCarrito() {

    const carritoGuardado = localStorage.getItem('carrito');

    if (carritoGuardado) {
        return JSON.parse(carritoGuardado);
    }

    return [];

}


function guardarCarrito(carrito) {

    localStorage.setItem('carrito', JSON.stringify(carrito));

}


function agregarAlCarrito(codigo) {

    const producto = productos.find(
        (producto) => producto.codigo === codigo
    );

    if (!producto) {
        return;
    }

    const carrito = obtenerCarrito();

    const productoExistente = carrito.find(
        (item) => item.codigo === codigo
    );

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });

    }

    guardarCarrito(carrito);

    alert('Producto agregado al carrito');

}


function cambiarCantidad(codigo, cambio) {

    const carrito = obtenerCarrito();

    const producto = carrito.find(
        (item) => item.codigo === codigo
    );

    if (!producto) {
        return;
    }
];

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {

        const nuevoCarrito = carrito.filter(
            (item) => item.codigo !== codigo
        );

        guardarCarrito(nuevoCarrito);

    } else {

        guardarCarrito(carrito);

    }

    mostrarCarrito();

}


function eliminarDelCarrito(codigo) {

    const carrito = obtenerCarrito();

    const nuevoCarrito = carrito.filter(
        (item) => item.codigo !== codigo
    );

    guardarCarrito(nuevoCarrito);

    mostrarCarrito();

}


const cartContainer = document.getElementById('cartContainer');

const cartTotal = document.getElementById('cartTotal');


function mostrarCarrito() {

    if (!cartContainer) {
        return;
    }

    const carrito = obtenerCarrito();

    cartContainer.innerHTML = '';

    if (carrito.length === 0) {

        cartContainer.innerHTML = `
            <p>Tu carrito está vacío.</p>
        `;

        if (cartTotal) {
            cartTotal.innerHTML = '';
        }

        return;
    }


    carrito.forEach((producto) => {

        const item = document.createElement('article');

        item.classList.add('product-card');

        item.innerHTML = `
            <h3>${producto.nombre}</h3>

            <p class="code">
                Código: ${producto.codigo}
            </p>

            <p class="price">
                $${producto.precio.toLocaleString('es-CL')} CLP
            </p>

            <div>
                <button onclick="cambiarCantidad('${producto.codigo}', -1)">
                    -
                </button>

                <span>
                    Cantidad: ${producto.cantidad}
                </span>

                <button onclick="cambiarCantidad('${producto.codigo}', 1)">
                    +
                </button>
            </div>

            <br>

            <button onclick="eliminarDelCarrito('${producto.codigo}')">
                Eliminar
            </button>
        `;

        cartContainer.appendChild(item);

    });


    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );


    if (cartTotal) {

        cartTotal.innerHTML = `
            <h3>
                Total: $${total.toLocaleString('es-CL')} CLP
            </h3>
        `;

    }

}


mostrarCarrito();
