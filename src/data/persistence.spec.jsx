import { addCartItem, cartQuantity, cartTotal, createRepository, decreaseStock, getStockChanges } from './persistence.js';

function makeMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

describe('repositorio local con operaciones CRUD', () => {
  let storage;
  let repository;

  beforeEach(() => {
    storage = makeMemoryStorage();
    repository = createRepository({ key: 'productos-prueba', idField: 'codigo', initialData: [{ codigo: 'A1', nombre: 'Torta inicial' }], storage });
  });

  it('lee los datos iniciales y los persiste la primera vez', () => {
    expect(repository.list()).toEqual([{ codigo: 'A1', nombre: 'Torta inicial' }]);
    expect(JSON.parse(storage.getItem('productos-prueba'))[0].codigo).toBe('A1');
  });

  it('crea un registro y permite consultarlo por su identificador', () => {
    repository.create({ codigo: 'B2', nombre: 'Brownie' });
    expect(repository.getById('B2').nombre).toBe('Brownie');
    expect(repository.list().length).toBe(2);
  });

  it('rechaza identificadores duplicados sin alterar los datos', () => {
    expect(() => repository.create({ codigo: 'A1', nombre: 'Duplicado' })).toThrowError(/Ya existe/);
    expect(repository.list().length).toBe(1);
  });

  it('actualiza campos y mantiene el identificador original', () => {
    const updated = repository.update('A1', { nombre: 'Torta renovada', precio: 12000 });
    expect(updated).toEqual({ codigo: 'A1', nombre: 'Torta renovada', precio: 12000 });
    expect(repository.update('no-existe', { nombre: 'Nada' })).toBeNull();
  });

  it('elimina registros y avisa cuando el identificador no existe', () => {
    expect(repository.remove('A1')).toBeTrue();
    expect(repository.remove('A1')).toBeFalse();
    expect(repository.list()).toEqual([]);
  });

  it('reemplaza la colección y devuelve copias independientes', () => {
    const items = [{ codigo: 'C3', nombre: 'Cheesecake' }];
    const saved = repository.replace(items);
    saved[0].nombre = 'Cambio externo';
    expect(repository.getById('C3').nombre).toBe('Cheesecake');
  });
});

describe('lógica del carrito', () => {
  const product = { codigo: 'TC001', nombre: 'Torta de chocolate', precio: 10000, isOffer: true, descuento: 10, imagen: '/img/TC001.jpg' };

  it('suma productos iguales y calcula cantidad y total con el precio de oferta', () => {
    const cart = addCartItem(addCartItem([], product), product, 2);
    expect(cart.length).toBe(1);
    expect(cart[0].cantidad).toBe(3);
    expect(cart[0].precio).toBe(9000);
    expect(cartQuantity(cart)).toBe(3);
    expect(cartTotal(cart)).toBe(27000);
  });

  it('mantiene separadas las tortas con mensajes de personalización distintos', () => {
    const cart = addCartItem(addCartItem([], product, 1, 'Feliz cumple'), product, 1, 'Te queremos');
    expect(cart.length).toBe(2);
  });

  it('calcula el descuento de stock y no permite vender más unidades de las disponibles', () => {
    const products = [{ codigo: 'TC001', nombre: 'Torta de chocolate', stock: 3 }];
    const cart = [{ codigo: 'TC001', cantidad: 2 }, { codigo: 'TC001', cantidad: 1 }];
    const inventory = getStockChanges(cart, products);
    expect(inventory.error).toBe('');
    expect(inventory.changes[0]).toEqual(jasmine.objectContaining({ stockBefore: 3, stockAfter: 0, quantity: 3 }));
    expect(getStockChanges([{ codigo: 'TC001', cantidad: 4 }], products).error).toContain('Stock insuficiente');
  });

  it('aplica el nuevo stock al repositorio después de una compra aprobada', () => {
    const storage = makeMemoryStorage();
    const products = createRepository({ key: 'stock-prueba', idField: 'codigo', initialData: [{ codigo: 'TC001', stock: 4 }], storage });
    const inventory = getStockChanges([{ codigo: 'TC001', cantidad: 2 }], products.list());
    decreaseStock(inventory.changes, products);
    expect(products.getById('TC001').stock).toBe(2);
  });
});
