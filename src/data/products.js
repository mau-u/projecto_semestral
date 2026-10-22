export const initialProducts = [
  { codigo: 'TC001', categoria: 'Tortas cuadradas', nombre: 'Torta cuadrada de chocolate', precio: 45000, imagen: '/img/TC001.jpg', descripcion: 'Bizcocho de chocolate con capas de ganache y un toque de avellanas. Puedes agregar un mensaje especial.', stock: 12, isOffer: true, descuento: 10 },
  { codigo: 'TC002', categoria: 'Tortas cuadradas', nombre: 'Torta cuadrada de frutas', precio: 50000, imagen: '/img/TC002.jpg', descripcion: 'Frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebrar.', stock: 8, isOffer: false, descuento: 0 },
  { codigo: 'TT001', categoria: 'Tortas circulares', nombre: 'Torta circular de vainilla', precio: 40000, imagen: '/img/TT001.jpg', descripcion: 'Bizcocho de vainilla relleno con crema pastelera y cubierto con un glaseado dulce.', stock: 6, isOffer: false, descuento: 0 },
  { codigo: 'TT002', categoria: 'Tortas circulares', nombre: 'Torta circular de manjar', precio: 42000, imagen: '/img/TT002.jpg', descripcion: 'Torta tradicional chilena con manjar y nueces, para quienes disfrutan los sabores clásicos.', stock: 4, isOffer: false, descuento: 0 },
  { codigo: 'PI001', categoria: 'Postres individuales', nombre: 'Mousse de chocolate', precio: 5000, imagen: '/img/PI001.jpg', descripcion: 'Postre individual cremoso, preparado con chocolate de alta calidad.', stock: 20, isOffer: false, descuento: 0 },
  { codigo: 'PI002', categoria: 'Postres individuales', nombre: 'Tiramisú clásico', precio: 5500, imagen: '/img/PI002.jpg', descripcion: 'Capas de café, mascarpone y cacao en una porción individual.', stock: 16, isOffer: false, descuento: 0 },
  { codigo: 'PSA001', categoria: 'Productos sin azúcar', nombre: 'Torta sin azúcar de naranja', precio: 48000, imagen: '/img/PSA001.jpg', descripcion: 'Torta ligera de naranja, endulzada sin azúcar añadida.', stock: 5, isOffer: false, descuento: 0 },
  { codigo: 'PSA002', categoria: 'Productos sin azúcar', nombre: 'Cheesecake sin azúcar', precio: 47000, imagen: '/img/PSA002.jpg', descripcion: 'Cheesecake suave y cremoso, una alternativa para compartir.', stock: 3, isOffer: true, descuento: 12 },
  { codigo: 'PT001', categoria: 'Pastelería tradicional', nombre: 'Empanada de manzana', precio: 3000, imagen: '/img/PT001.jpg', descripcion: 'Masa dorada rellena de manzanas especiadas, para el desayuno o la once.', stock: 30, isOffer: false, descuento: 0 },
  { codigo: 'PT002', categoria: 'Pastelería tradicional', nombre: 'Tarta de Santiago', precio: 6000, imagen: '/img/PT002.jpg', descripcion: 'Tarta tradicional de almendras, azúcar y huevos.', stock: 10, isOffer: false, descuento: 0 },
  { codigo: 'PG001', categoria: 'Productos sin gluten', nombre: 'Brownie sin gluten', precio: 4000, imagen: '/img/PG001.jpg', descripcion: 'Brownie intenso y húmedo, elaborado sin gluten.', stock: 18, isOffer: true, descuento: 15 },
  { codigo: 'PG002', categoria: 'Productos sin gluten', nombre: 'Pan sin gluten', precio: 3500, imagen: '/img/PG002.jpg', descripcion: 'Pan suave y esponjoso para acompañar tus comidas.', stock: 14, isOffer: false, descuento: 0 },
  { codigo: 'PV001', categoria: 'Productos veganos', nombre: 'Torta vegana de chocolate', precio: 50000, imagen: '/img/PV001.jpg', descripcion: 'Torta de chocolate húmeda, preparada sin ingredientes de origen animal.', stock: 7, isOffer: false, descuento: 0 },
  { codigo: 'PV002', categoria: 'Productos veganos', nombre: 'Galletas veganas de avena', precio: 4500, imagen: '/img/PV002.jpg', descripcion: 'Galletas crujientes de avena para disfrutar a cualquier hora.', stock: 22, isOffer: true, descuento: 10 },
  { codigo: 'TE001', categoria: 'Tortas especiales', nombre: 'Torta especial de cumpleaños', precio: 55000, imagen: '/img/TE001.jpg', descripcion: 'Torta de celebración personalizable con decoración y mensaje.', stock: 5, isOffer: false, descuento: 0 },
  { codigo: 'TE002', categoria: 'Tortas especiales', nombre: 'Torta especial de boda', precio: 60000, imagen: '/img/TE002.jpg', descripcion: 'Torta especial para compartir en una celebración inolvidable.', stock: 2, isOffer: false, descuento: 0 },
];

export const initialCategories = [
  { id: 'tortas-cuadradas', nombre: 'Tortas cuadradas', descripcion: 'Sabores para celebrar en grande.' },
  { id: 'tortas-circulares', nombre: 'Tortas circulares', descripcion: 'Recetas clásicas para compartir.' },
  { id: 'postres-individuales', nombre: 'Postres individuales', descripcion: 'Un gusto dulce para cualquier momento.' },
  { id: 'sin-azucar', nombre: 'Productos sin azúcar', descripcion: 'Alternativas sin azúcar añadida.' },
  { id: 'pasteleria-tradicional', nombre: 'Pastelería tradicional', descripcion: 'Recetas de siempre, hechas con cariño.' },
  { id: 'sin-gluten', nombre: 'Productos sin gluten', descripcion: 'Opciones preparadas sin gluten.' },
  { id: 'veganos', nombre: 'Productos veganos', descripcion: 'Delicias sin ingredientes de origen animal.' },
  { id: 'tortas-especiales', nombre: 'Tortas especiales', descripcion: 'Diseños para tus momentos importantes.' },
];

export const initialUsers = [
  { id: 'admin-demo', nombre: 'Administración Mil Sabores', email: 'admin@duoc.cl', rol: 'Administrador' },
];
