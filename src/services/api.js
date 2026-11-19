const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || `Error HTTP ${response.status}`);
  return body;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),
  refresh: () => request('/auth/refresh', { method: 'POST' }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  products: () => request('/store/products'),
  categories: () => request('/store/categories'),
  checkout: (data) => request('/store/checkout', { method: 'POST', body: JSON.stringify(data) }),
  myOrders: () => request('/store/orders'),
  adminCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  adminProducts: () => request('/products'),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  orders: () => request('/boletas'),
  order: (id) => request(`/boletas/${id}`),
  cancelOrder: (id) => request(`/boletas/${id}`, { method: 'DELETE' }),
  users: () => request('/users'),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

export function mapApiProduct(product) {
  return {
    id: product.id,
    codigo: String(product.id),
    nombre: product.nombre,
    descripcion: product.descripcion || '',
    precio: Number(product.precio),
    stock: Number(product.stock),
    imagen: product.imagenUrl || '/img/admin-product.svg',
    categoria: product.categoriaNombre,
    categoriaId: product.categoriaId,
    isOffer: false,
    descuento: 0,
  };
}

export function mapApiCategory(category) {
  return { id: String(category.id), nombre: category.nombre, descripcion: category.descripcion || '' };
}

export function mapApiOrder(order) {
  const items = (order.detalles || []).map((line) => ({
    codigo: String(line.productoId),
    nombre: line.productoNombre,
    cantidad: Number(line.cantidad),
    precio: Number(line.precioUnitario),
    subtotal: Number(line.subtotal),
  }));
  const subtotal = items.reduce((sum, line) => sum + line.subtotal, 0);
  const discountTotal = Number(order.descuentoTotal || 0);
  return {
    id: order.numero || String(order.id),
    backendId: order.id,
    customer: { name: order.clienteNombre, email: order.clienteEmail || '' },
    items,
    subtotal,
    shipping: order.tipoEntrega === 'despacho' ? 2990 : 0,
    discountTotal,
    discounts: discountTotal ? [{ code: order.promociones || 'PROMOCIÓN', label: `Descuentos aplicados (${String(order.promociones || '').replaceAll(',', ', ')})`, amount: discountTotal }] : [],
    delivery: order.tipoEntrega,
    address: order.direccion,
    phone: order.telefono,
    region: order.region,
    commune: order.comuna,
    payment: order.metodoPago,
    total: Number(order.total),
    status: order.estado === 'ANULADA' ? 'cancelled' : 'paid',
    createdAt: order.fecha,
    auditTrail: [],
  };
}
