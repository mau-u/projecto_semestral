const productos = [
  {
    codigo: "TC001",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Chocolate",
    precio: 45000,
    imagen: "img/TC001.svg",
    descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales."
  },
  {
    codigo: "TC002",
    categoria: "Tortas Cuadradas",
    nombre: "Torta Cuadrada de Frutas",
    precio: 50000,
    imagen: "img/TC002.svg",
    descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones."
  },
  {
    codigo: "TT001",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Vainilla",
    precio: 40000,
    imagen: "img/TT001.svg",
    descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión."
  },
  {
    codigo: "TT002",
    categoria: "Tortas Circulares",
    nombre: "Torta Circular de Manjar",
    precio: 42000,
    imagen: "img/TT002.svg",
    descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos."
  },
  {
    codigo: "PI001",
    categoria: "Postres Individuales",
    nombre: "Mousse de Chocolate",
    precio: 5000,
    imagen: "img/PI001.svg",
    descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate."
  },
  {
    codigo: "PI002",
    categoria: "Postres Individuales",
    nombre: "Tiramisú Clásico",
    precio: 5500,
    imagen: "img/PI002.svg",
    descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida."
  },
  {
    codigo: "PSA001",
    categoria: "Productos Sin Azúcar",
    nombre: "Torta Sin Azúcar de Naranja",
    precio: 48000,
    imagen: "img/PSA001.svg",
    descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables."
  },
  {
    codigo: "PSA002",
    categoria: "Productos Sin Azúcar",
    nombre: "Cheesecake Sin Azúcar",
    precio: 47000,
    imagen: "img/PSA002.svg",
    descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa."
  },
  {
    codigo: "PT001",
    categoria: "Pastelería Tradicional",
    nombre: "Empanada de Manzana",
    precio: 3000,
    imagen: "img/PT001.svg",
    descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda."
  },
  {
    codigo: "PT002",
    categoria: "Pastelería Tradicional",
    nombre: "Tarta de Santiago",
    precio: 6000,
    imagen: "img/PT002.svg",
    descripcion: "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos."
  },
  {
    codigo: "PG001",
    categoria: "Productos Sin Gluten",
    nombre: "Brownie Sin Gluten",
    precio: 4000,
    imagen: "img/PG001.svg",
    descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor."
  },
  {
    codigo: "PG002",
    categoria: "Productos Sin Gluten",
    nombre: "Pan Sin Gluten",
    precio: 3500,
    imagen: "img/PG002.svg",
    descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida."
  },
  {
    codigo: "PV001",
    categoria: "Productos Vegana",
    nombre: "Torta Vegana de Chocolate",
    precio: 50000,
    imagen: "img/PV001.svg",
    descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos."
  },
  {
    codigo: "PV002",
    categoria: "Productos Vegana",
    nombre: "Galletas Veganas de Avena",
    precio: 4500,
    imagen: "img/PV002.svg",
    descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano."
  },
  {
    codigo: "TE001",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Cumpleaños",
    precio: 55000,
    imagen: "img/TE001.svg",
    descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos."
  },
  {
    codigo: "TE002",
    categoria: "Tortas Especiales",
    nombre: "Torta Especial de Boda",
    precio: 60000,
    imagen: "img/TE002.svg",
    descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda."
  }
];

const regionesComunas = {
  "Región Metropolitana": ["Santiago", "Ñuñoa", "Providencia", "Maipú", "Puente Alto"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"],
  "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica"]
};

function formatoPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')} CLP`;
}

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const cantidad = obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cantidad);
}

function agregarAlCarrito(codigo, cantidad = 1, mensaje = '') {
  const producto = productos.find(p => p.codigo === codigo);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find(item => item.codigo === codigo && (item.mensaje || '') === mensaje);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad,
      mensaje
    });
  }

  guardarCarrito(carrito);
  alert('Producto agregado al carrito.');
}

function cambiarCantidad(codigo, cambio, mensaje = '') {
  const carrito = obtenerCarrito();
  const item = carrito.find(p => p.codigo === codigo && (p.mensaje || '') === mensaje);
  if (!item) return;

  item.cantidad += cambio;
  const nuevo = carrito.filter(p => p.cantidad > 0);
  guardarCarrito(nuevo);
  mostrarCarrito();
}

function eliminarDelCarrito(codigo, mensaje = '') {
  const carrito = obtenerCarrito().filter(p => !(p.codigo === codigo && (p.mensaje || '') === mensaje));
  guardarCarrito(carrito);
  mostrarCarrito();
}

function verDetalle(codigo) {
  window.location.href = `detalle.html?codigo=${encodeURIComponent(codigo)}`;
}

function crearTarjetaProducto(producto) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <p class="category">${producto.categoria}</p>
    <h3>${producto.nombre}</h3>
    <p class="code">Código: ${producto.codigo}</p>
    <p class="price">${formatoPrecio(producto.precio)}</p>
    <div class="card-actions">
      <button type="button" class="secondary-btn" onclick="verDetalle('${producto.codigo}')">Ver detalle</button>
      <button type="button" onclick="agregarAlCarrito('${producto.codigo}')">Añadir</button>
    </div>
  `;
  return card;
}

function mostrarProductos(lista = productos) {
  const contenedor = document.getElementById('productContainer');
  if (!contenedor) return;
  contenedor.innerHTML = '';
  lista.forEach(producto => contenedor.appendChild(crearTarjetaProducto(producto)));

  const sinResultados = document.getElementById('sinResultados');
  if (sinResultados) sinResultados.hidden = lista.length !== 0;
}

function prepararFiltros() {
  const select = document.getElementById('categoryFilter');
  const buscador = document.getElementById('searchProduct');
  if (!select || !buscador) return;

  [...new Set(productos.map(p => p.categoria))].forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    select.appendChild(option);
  });

  const filtrar = () => {
    const categoria = select.value;
    const texto = buscador.value.trim().toLowerCase();
    mostrarProductos(productos.filter(p =>
      (categoria === 'Todas' || p.categoria === categoria) &&
      (p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto))
    ));
  };

  select.addEventListener('change', filtrar);
  buscador.addEventListener('input', filtrar);
}

function mostrarDestacados() {
  const contenedor = document.getElementById('featuredProducts');
  if (!contenedor) return;
  productos.slice(0, 4).forEach(p => contenedor.appendChild(crearTarjetaProducto(p)));
}

function mostrarDetalle() {
  const detail = document.getElementById('productDetail');
  if (!detail) return;

  const codigo = new URLSearchParams(window.location.search).get('codigo');
  const producto = productos.find(p => p.codigo === codigo);

  if (!producto) {
    detail.innerHTML = '<p>Producto no encontrado.</p><a class="link-button" href="productos.html">Volver a productos</a>';
    return;
  }

  const permiteMensaje = producto.categoria.includes('Torta');
  detail.innerHTML = `
    <div class="detail-image">
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <div class="detail-info">
      <p class="category">${producto.categoria}</p>
      <h2>${producto.nombre}</h2>
      <p class="code">Código: ${producto.codigo}</p>
      <p>${producto.descripcion}</p>
      <p class="price">${formatoPrecio(producto.precio)}</p>
      ${permiteMensaje ? `
        <label for="customMessage">Mensaje especial para la torta:</label>
        <input id="customMessage" maxlength="80" type="text" placeholder="Ej: Feliz cumpleaños Ana">
      ` : ''}
      <label for="detailQuantity">Cantidad:</label>
      <input id="detailQuantity" type="number" min="1" max="20" value="1">
      <div class="card-actions">
        <button type="button" onclick="agregarDetalleAlCarrito('${producto.codigo}', ${permiteMensaje})">Añadir al carrito</button>
        <a class="link-button secondary-link" href="productos.html">Seguir comprando</a>
      </div>
    </div>
  `;
}

function agregarDetalleAlCarrito(codigo, permiteMensaje) {
  const cantidad = Math.max(1, parseInt(document.getElementById('detailQuantity')?.value || '1'));
  const mensaje = permiteMensaje ? (document.getElementById('customMessage')?.value.trim() || '') : '';
  agregarAlCarrito(codigo, cantidad, mensaje);
}

function mostrarCarrito() {
  const contenedor = document.getElementById('cartContainer');
  const totalContenedor = document.getElementById('cartTotal');
  if (!contenedor) return;

  const carrito = obtenerCarrito();
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = '<div class="empty-state"><h3>Tu carrito está vacío</h3><a class="link-button" href="productos.html">Ir a productos</a></div>';
    if (totalContenedor) totalContenedor.innerHTML = '';
    return;
  }

  carrito.forEach(item => {
    const fila = document.createElement('article');
    fila.className = 'cart-item';
    const mensajeSeguro = (item.mensaje || '').replaceAll("'", "\\'");
    fila.innerHTML = `
      <img src="${item.imagen || 'img/TC001.svg'}" alt="${item.nombre}">
      <div class="cart-info">
        <h3>${item.nombre}</h3>
        <p>${item.codigo}</p>
        ${item.mensaje ? `<p><strong>Mensaje:</strong> ${item.mensaje}</p>` : ''}
        <p class="price">${formatoPrecio(item.precio)}</p>
      </div>
      <div class="cart-controls">
        <button type="button" onclick="cambiarCantidad('${item.codigo}', -1, '${mensajeSeguro}')">−</button>
        <span>${item.cantidad}</span>
        <button type="button" onclick="cambiarCantidad('${item.codigo}', 1, '${mensajeSeguro}')">+</button>
        <button type="button" class="danger-btn" onclick="eliminarDelCarrito('${item.codigo}', '${mensajeSeguro}')">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(fila);
  });

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  if (totalContenedor) {
    totalContenedor.innerHTML = `
      <div class="cart-summary">
        <h3>Total: ${formatoPrecio(total)}</h3>
        <button type="button" onclick="finalizarCompra()">Confirmar pedido</button>
      </div>
    `;
  }
}

function finalizarCompra() {
  if (obtenerCarrito().length === 0) return;
  alert('Pedido confirmado de forma demostrativa. En una siguiente etapa se conectará a un backend para generar la orden y la boleta.');
}

function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  if (el) el.textContent = mensaje;
}

function limpiarErrores(ids) {
  ids.forEach(id => mostrarError(id, ''));
}

function correoPermitido(email) {
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email);
}

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

function esCumpleanos(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  return hoy.getDate() === nacimiento.getDate() && hoy.getMonth() === nacimiento.getMonth();
}

function validarRun(run) {
  const limpio = run.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (!/^[0-9]{6,8}[0-9K]$/.test(limpio)) {
    return false;
  }
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === esperado;
}

function prepararRegiones() {
  const region = document.getElementById('region');
  const comuna = document.getElementById('comuna');
  if (!region || !comuna) return;

  Object.keys(regionesComunas).forEach(nombre => {
    const option = document.createElement('option');
    option.value = nombre;
    option.textContent = nombre;
    region.appendChild(option);
  });

  region.addEventListener('change', () => {
    comuna.innerHTML = '<option value="">Seleccione comuna</option>';
    (regionesComunas[region.value] || []).forEach(nombre => {
      const option = document.createElement('option');
      option.value = nombre;
      option.textContent = nombre;
      comuna.appendChild(option);
    });
  });
}

function prepararRegistro() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    limpiarErrores(['errorRun','errorName','errorLastName','errorEmail','errorBirthDate','errorPassword','errorRegion','errorComuna','errorAddress']);
    mostrarError('formSuccess', '');

    const run = document.getElementById('run').value.trim();
    const nombre = document.getElementById('fullName').value.trim();
    const apellidos = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const fecha = document.getElementById('birthDate').value;
    const password = document.getElementById('password').value;
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;
    const direccion = document.getElementById('address').value.trim();
    const promo = document.getElementById('promoCode').value.trim().toUpperCase();

    let valido = true;
    if (!validarRun(run)) {
      mostrarError('errorRun', 'Ingrese un RUN válido, sin puntos ni guion.');
      valido = false;
    }
    if (!nombre || nombre.length > 50) {
      mostrarError('errorName', 'Nombre requerido, máximo 50 caracteres.');
      valido = false;
    }
    if (!apellidos || apellidos.length > 100) {
      mostrarError('errorLastName', 'Apellidos requeridos, máximo 100 caracteres.');
      valido = false;
    }
    if (!correoPermitido(email) || email.length > 100) {
      mostrarError('errorEmail', 'Use correo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      valido = false;
    }
    if (!fecha) {
      mostrarError('errorBirthDate', 'Seleccione la fecha de nacimiento.');
      valido = false;
    }
    if (password.length < 4 || password.length > 10) {
      mostrarError('errorPassword', 'La contraseña debe tener entre 4 y 10 caracteres.');
      valido = false;
    }
    if (!region) {
      mostrarError('errorRegion', 'Seleccione una región.');
      valido = false;
    }
    if (!comuna) {
      mostrarError('errorComuna', 'Seleccione una comuna.');
      valido = false;
    }
    if (!direccion || direccion.length > 300) {
      mostrarError('errorAddress', 'Dirección requerida, máximo 300 caracteres.');
      valido = false;
    }
    if (!valido) return;

    const edad = calcularEdad(fecha);
    const beneficios = [];
    if (edad > 50) beneficios.push('50% de descuento por ser mayor de 50 años');
    if (promo === 'FELICES50') beneficios.push('10% de descuento de por vida');
    if (email.toLowerCase().endsWith('@duoc.cl') && esCumpleanos(fecha)) beneficios.push('torta gratis por cumpleaños de estudiante Duoc');

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (existe) {
      mostrarError('errorEmail', 'Este correo ya está registrado en la demostración.');
      return;
    }

    usuarios.push({ run, nombre, apellidos, email, fecha, password, region, comuna, direccion, rol: 'Cliente' });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    document.getElementById('formSuccess').textContent = `¡Registro exitoso!${beneficios.length ? ' Beneficios: ' + beneficios.join(', ') + '.' : ''}`;
    form.reset();
    document.getElementById('comuna').innerHTML = '<option value="">Seleccione comuna</option>';
  });
}

function prepararContacto() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    limpiarErrores(['errorContactName','errorContactEmail','errorContactComment']);
    mostrarError('contactSuccess', '');

    const nombre = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const comentario = document.getElementById('contactComment').value.trim();
    let valido = true;

    if (!nombre || nombre.length > 100) {
      mostrarError('errorContactName', 'Nombre requerido, máximo 100 caracteres.');
      valido = false;
    }
    if (!correoPermitido(email) || email.length > 100) {
      mostrarError('errorContactEmail', 'Use correo @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      valido = false;
    }
    if (!comentario || comentario.length > 500) {
      mostrarError('errorContactComment', 'Comentario requerido, máximo 500 caracteres.');
      valido = false;
    }

    if (valido) {
      document.getElementById('contactSuccess').textContent = 'Mensaje enviado correctamente (demostración frontend).';
      form.reset();
    }
  });
}

function prepararLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    limpiarErrores(['errorLoginEmail','errorLoginPassword']);
    mostrarError('loginSuccess', '');

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let valido = true;

    if (!correoPermitido(email) || email.length > 100) {
      mostrarError('errorLoginEmail', 'Correo requerido: @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      valido = false;
    }
    if (password.length < 4 || password.length > 10) {
      mostrarError('errorLoginPassword', 'Contraseña requerida, entre 4 y 10 caracteres.');
      valido = false;
    }
    if (!valido) return;

    if (email.toLowerCase() === 'admin@duoc.cl' && password === '1234') {
      localStorage.setItem('sesion', JSON.stringify({ email, rol: 'Administrador' }));
      window.location.href = 'admin.html';
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!usuario) {
      mostrarError('errorLoginPassword', 'Usuario no encontrado. Regístrese primero o use la cuenta demo del administrador.');
      return;
    }

    localStorage.setItem('sesion', JSON.stringify({ email: usuario.email, rol: usuario.rol || 'Cliente' }));
    document.getElementById('loginSuccess').textContent = 'Inicio de sesión correcto.';
  });
}

function obtenerProductosAdmin() {
  return JSON.parse(localStorage.getItem('productosAdmin') || '[]');
}

function guardarProductosAdmin(lista) {
  localStorage.setItem('productosAdmin', JSON.stringify(lista));
}

function mostrarAdminProductos() {
  const cuerpo = document.getElementById('adminProductsBody');
  if (!cuerpo) return;
  const extras = obtenerProductosAdmin();
  const lista = [...productos, ...extras];
  cuerpo.innerHTML = '';
  lista.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.codigo}</td><td>${p.nombre}</td><td>${p.categoria}</td><td>${formatoPrecio(Number(p.precio))}</td><td>${p.stock ?? '-'}</td><td>${extras.some(x => x.codigo === p.codigo) ? `<button class="danger-btn" onclick="eliminarProductoAdmin('${p.codigo}')">Eliminar</button>` : 'Base'}</td>`;
    cuerpo.appendChild(tr);
  });
}

function prepararAdminProducto() {
  const form = document.getElementById('adminProductForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const codigo = document.getElementById('adminCode').value.trim().toUpperCase();
    const nombre = document.getElementById('adminName').value.trim();
    const descripcion = document.getElementById('adminDescription').value.trim();
    const precio = Number(document.getElementById('adminPrice').value);
    const stock = Number(document.getElementById('adminStock').value);
    const stockCritico = document.getElementById('adminCriticalStock').value === '' ? null : Number(document.getElementById('adminCriticalStock').value);
    const categoria = document.getElementById('adminCategory').value;
    const salida = document.getElementById('adminProductMessage');
    salida.textContent = '';

    if (codigo.length < 3 || !nombre || nombre.length > 100 || descripcion.length > 500 || precio < 0 || !Number.isInteger(stock) || stock < 0 || !categoria || (stockCritico !== null && (!Number.isInteger(stockCritico) || stockCritico < 0))) {
      salida.textContent = 'Revise los campos: código mínimo 3, nombre requerido, precio/stock válidos y categoría requerida.';
      salida.className = 'error-msg';
      return;
    }
    if (productos.some(p => p.codigo === codigo) || obtenerProductosAdmin().some(p => p.codigo === codigo)) {
      salida.textContent = 'El código del producto ya existe.';
      salida.className = 'error-msg';
      return;
    }

    const extras = obtenerProductosAdmin();
    extras.push({ codigo, nombre, descripcion, precio, stock, stockCritico, categoria, imagen: 'img/admin-product.svg' });
    guardarProductosAdmin(extras);
    salida.textContent = 'Producto creado correctamente en localStorage.';
    salida.className = 'success-msg';
    form.reset();
    mostrarAdminProductos();
  });
}

function eliminarProductoAdmin(codigo) {
  guardarProductosAdmin(obtenerProductosAdmin().filter(p => p.codigo !== codigo));
  mostrarAdminProductos();
}

function mostrarAdminUsuarios() {
  const cuerpo = document.getElementById('adminUsersBody');
  if (!cuerpo) return;
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  cuerpo.innerHTML = '';
  usuarios.forEach((u, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.run}</td><td>${u.nombre} ${u.apellidos}</td><td>${u.email}</td><td>${u.rol || 'Cliente'}</td><td><button class="danger-btn" onclick="eliminarUsuarioAdmin(${i})">Eliminar</button></td>`;
    cuerpo.appendChild(tr);
  });
  if (usuarios.length === 0) cuerpo.innerHTML = '<tr><td colspan="5">Aún no hay usuarios registrados.</td></tr>';
}

function eliminarUsuarioAdmin(indice) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  usuarios.splice(indice, 1);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  mostrarAdminUsuarios();
}

function cerrarSesion() {
  localStorage.removeItem('sesion');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();
  mostrarProductos();
  prepararFiltros();
  mostrarDestacados();
  mostrarDetalle();
  mostrarCarrito();
  prepararRegiones();
  prepararRegistro();
  prepararContacto();
  prepararLogin();
  mostrarAdminProductos();
  prepararAdminProducto();
  mostrarAdminUsuarios();
});
