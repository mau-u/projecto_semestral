import { initialCategories, initialProducts, initialUsers } from './products.js';

const clone = (value) => JSON.parse(JSON.stringify(value));
const createId = () => `ms-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeStoredAssetPaths = (items) => {
  const baseUrl = import.meta.env?.BASE_URL ?? '/';
  return items.map((item) => {
    if (!item || typeof item !== 'object' || typeof item.imagen !== 'string') return item;

    // Migrate image paths saved before deployment under '/', or under the
    // previous (misspelled) project path. Leave data URLs and external URLs intact.
    const match = item.imagen.match(/^\/?(?:(?:proyecto|projecto)_semestral\/)?img\/(.+)$/i);
    if (!match) return item;
    return { ...item, imagen: `${baseUrl}img/${match[1]}` };
  });
};

export function createRepository({ key, initialData = [], storage = globalThis.localStorage, idField = 'id', normalize = (items) => items }) {
  const read = () => {
    try {
      const saved = storage?.getItem(key);
      if (saved === null || saved === undefined) {
        const seed = clone(initialData);
        storage?.setItem(key, JSON.stringify(seed));
        return seed;
      }
      const value = JSON.parse(saved);
      if (!Array.isArray(value)) return clone(initialData);
      const normalized = normalize(value);
      // Persist migrations when possible, but never fail rendering if storage is read-only.
      if (JSON.stringify(normalized) !== JSON.stringify(value)) {
        try {
          storage?.setItem(key, JSON.stringify(normalized));
        } catch {
          // The normalized values are still returned for this session.
        }
      }
      return normalized;
    } catch {
      return clone(initialData);
    }
  };

  const write = (items) => {
    if (!Array.isArray(items)) throw new TypeError('El repositorio solo guarda listas.');
    storage?.setItem(key, JSON.stringify(items));
    return clone(items);
  };

  return {
    list: () => clone(read()),
    getById: (id) => clone(read().find((item) => String(item[idField]) === String(id)) ?? null),
    create: (record) => {
      const items = read();
      const item = { ...record, [idField]: record[idField] || createId() };
      if (items.some((saved) => String(saved[idField]).toLowerCase() === String(item[idField]).toLowerCase())) {
        throw new Error(`Ya existe un registro con ${idField} "${item[idField]}".`);
      }
      write([...items, item]);
      return clone(item);
    },
    update: (id, changes) => {
      const items = read();
      const index = items.findIndex((item) => String(item[idField]) === String(id));
      if (index < 0) return null;
      items[index] = { ...items[index], ...changes, [idField]: items[index][idField] };
      write(items);
      return clone(items[index]);
    },
    remove: (id) => {
      const items = read();
      const remaining = items.filter((item) => String(item[idField]) !== String(id));
      if (remaining.length === items.length) return false;
      write(remaining);
      return true;
    },
    replace: (items) => write(items),
  };
}

export const productsRepository = createRepository({ key: 'mil-sabores.products.v1', initialData: initialProducts, idField: 'codigo', normalize: normalizeStoredAssetPaths });
export const categoriesRepository = createRepository({ key: 'mil-sabores.categories.v1', initialData: initialCategories });
export const cartRepository = createRepository({ key: 'mil-sabores.cart.v1', normalize: normalizeStoredAssetPaths });
export const ordersRepository = createRepository({ key: 'mil-sabores.orders.v1' });
export const usersRepository = createRepository({ key: 'mil-sabores.users.v1', initialData: initialUsers, idField: 'id' });
export const auditRepository = createRepository({ key: 'mil-sabores.audit.v1' });

export const getProductPrice = (product) => product.isOffer
  ? Math.round(product.precio * (1 - (Number(product.descuento) || 0) / 100))
  : product.precio;

export function addCartItem(cart, product, quantity = 1, message = '') {
  if (!product || Number(quantity) < 1) return cart;
  const existing = cart.find((item) => item.codigo === product.codigo && (item.mensaje || '') === message);
  if (existing) {
    return cart.map((item) => item === existing ? { ...item, cantidad: item.cantidad + Number(quantity) } : item);
  }
  return [...cart, {
    codigo: product.codigo,
    nombre: product.nombre,
    precio: getProductPrice(product),
    precioOriginal: product.precio,
    imagen: product.imagen,
    cantidad: Number(quantity),
    mensaje: message,
  }];
}

export function getStockChanges(cart, products) {
  const requestedByCode = cart.reduce((totals, item) => ({
    ...totals,
    [item.codigo]: (totals[item.codigo] || 0) + Number(item.cantidad),
  }), {});
  const changes = [];
  for (const [codigo, quantity] of Object.entries(requestedByCode)) {
    const product = products.find((item) => item.codigo === codigo);
    if (!product) return { changes: [], error: `El producto ${codigo} ya no está disponible. Actualiza tu carrito.` };
    const stockBefore = Math.max(0, Number(product.stock) || 0);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > stockBefore) {
      return { changes: [], error: `Stock insuficiente de ${product.nombre}. Disponible: ${stockBefore}. Reduce la cantidad para continuar.` };
    }
    changes.push({ codigo, nombre: product.nombre, quantity, stockBefore, stockAfter: stockBefore - quantity });
  }
  return { changes, error: '' };
}

export function decreaseStock(changes, repository = productsRepository) {
  changes.forEach((change) => repository.update(change.codigo, { stock: change.stockAfter }));
}

export const cartTotal = (cart) => cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
export const cartQuantity = (cart) => cart.reduce((sum, item) => sum + item.cantidad, 0);
