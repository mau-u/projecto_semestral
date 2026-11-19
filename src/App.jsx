import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminOverview from './components/admin/AdminOverview.jsx';
import AdminProducts from './components/admin/AdminProducts.jsx';
import AdminCategories from './components/admin/AdminCategories.jsx';
import AdminOrders from './components/admin/AdminOrders.jsx';
import AdminUsers from './components/admin/AdminUsers.jsx';
import AdminAudit from './components/admin/AdminAudit.jsx';
import AdminReports from './components/admin/AdminReports.jsx';
import AdminProfile from './components/admin/AdminProfile.jsx';
import HomeView from './views/HomeView.jsx';
import CatalogView from './views/CatalogView.jsx';
import ProductDetailView from './views/ProductDetailView.jsx';
import CartView from './views/CartView.jsx';
import CheckoutView from './views/CheckoutView.jsx';
import PaymentResultView from './views/PaymentResultView.jsx';
import SellerView from './views/SellerView.jsx';
import MyOrdersView from './views/MyOrdersView.jsx';
import LoginView, { RegisterView } from './views/LoginView.jsx';
import { AboutView, BlogView, BlogDetailView, ContactView } from './views/InfoView.jsx';
import {
  addCartItem, auditRepository, cartQuantity, cartRepository, cartTotal, categoriesRepository, ordersRepository, productsRepository, usersRepository,
} from './data/persistence.js';
import { slugify } from './utils/format.js';
import { api, mapApiProduct, mapApiCategory, mapApiOrder } from './services/api.js';
import { isValidChileanMobile, isValidDateNotFuture, isValidEmail, isValidName, isSyntacticallyValidEmail } from './utils/validation.js';

const getRoute = () => window.location.hash.replace(/^#/, '') || '/';

function readSession() {
  try { return JSON.parse(window.localStorage.getItem('mil-sabores.session.v1')) || null; }
  catch { return null; }
}

function AdminAccess() {
  return <main className="container content-section"><div className="empty-state"><span>⌑</span><p className="eyebrow">Área administrativa</p><h1>Inicia sesión para continuar</h1><p>Usa una cuenta autorizada para acceder a esta sección.</p><a className="btn btn-brand" href="#/login">Ir a iniciar sesión</a></div></main>;
}

function SellerPurchaseBlocked() {
  return <main className="container content-section"><div className="empty-state"><span>◉</span><p className="eyebrow">Acceso de vendedor</p><h1>Compras no disponibles</h1><p>La cuenta de vendedor puede consultar productos, precios, stock y órdenes, pero no agregar productos al carrito ni confirmar compras.</p><a className="btn btn-brand" href="#/vendedor">Volver al panel de vendedor</a></div></main>;
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [products, setProducts] = useState(() => productsRepository.list());
  const [categories, setCategories] = useState(() => categoriesRepository.list());
  const [cart, setCart] = useState(() => cartRepository.list());
  const [orders, setOrders] = useState(() => ordersRepository.list());
  const [myOrders, setMyOrders] = useState([]);
  const [users, setUsers] = useState(() => usersRepository.list());
  const [auditEntries, setAuditEntries] = useState(() => auditRepository.list());
  const [currentUser, setCurrentUser] = useState(readSession);
  const [recentOrder, setRecentOrder] = useState(() => ordersRepository.list().at(-1) || null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([api.products(), api.categories()])
      .then(([remoteProducts, remoteCategories]) => {
        if (!active) return;
        setProducts(remoteProducts.map(mapApiProduct));
        setCategories(remoteCategories.map(mapApiCategory));
      })
      .catch((error) => {
        console.warn('Backend no disponible; se mantienen los datos locales:', error.message);
        if (active) setNotice('No se pudo conectar con el servidor. Se muestran datos locales.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    api.me().then((user) => {
      if (!active) return;
      const session = { id: user.id, nombre: user.nombre, name: user.nombre, email: user.email, role: String(user.rol || '').toLowerCase() };
      setCurrentUser(session);
      window.localStorage.setItem('mil-sabores.session.v1', JSON.stringify(session));
    }).catch(() => {
      if (!active) return;
      setCurrentUser(null);
      window.localStorage.removeItem('mil-sabores.session.v1');
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!currentUser || !['admin', 'vendedor'].includes(currentUser.role)) return;
    let active = true;
    const requests = [api.adminProducts(), api.orders()];
    if (currentUser.role === 'admin') requests.push(api.adminCategories(), api.users());
    Promise.all(requests).then(([remoteProducts, remoteOrders, remoteCategories, remoteUsers]) => {
      if (!active) return;
      setProducts(remoteProducts.map(mapApiProduct));
      setOrders(remoteOrders.map(mapApiOrder));
      if (remoteCategories) setCategories(remoteCategories.map(mapApiCategory));
      if (remoteUsers) setUsers(remoteUsers.map((user) => ({ ...user, rol: String(user.rol).toLowerCase() })));
    }).catch((error) => {
      if (active) setNotice(`No fue posible cargar el panel: ${error.message}`);
    });
    return () => { active = false; };
  }, [currentUser?.id, currentUser?.role]);

  useEffect(() => {
    if (currentUser?.role !== 'cliente') { setMyOrders([]); return; }
    let active = true;
    api.myOrders().then((result) => { if (active) setMyOrders(result.map(mapApiOrder)); }).catch((error) => { if (active) setNotice(`No fue posible cargar tus compras: ${error.message}`); });
    return () => { active = false; };
  }, [currentUser?.id, currentUser?.role]);

  useEffect(() => {
    const updateRoute = () => { setRoute(getRoute()); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const refreshProducts = async () => setProducts((await api.adminProducts()).map(mapApiProduct));
  const refreshOrders = async () => setOrders((await api.orders()).map(mapApiOrder));
  const refreshUsers = async () => setUsers((await api.users()).map((user) => ({ ...user, rol: String(user.rol).toLowerCase() })));
  const refreshAudit = () => setAuditEntries(auditRepository.list());
  const logAudit = (type, event) => {
    auditRepository.create({ type, at: new Date().toISOString(), ...event });
    refreshAudit();
  };
  const refreshCategories = async () => setCategories((await api.adminCategories()).map(mapApiCategory));
  const updateCart = (next) => { cartRepository.replace(next); setCart(next); };
  const addToCart = (product, quantity = 1, message = '') => {
    if (currentUser?.role === 'vendedor') {
      setNotice('La cuenta de vendedor solo puede visualizar productos.');
      return;
    }
    const requested = Number(quantity);
    const alreadyInCart = cart.filter((item) => item.codigo === product.codigo).reduce((sum, item) => sum + Number(item.cantidad), 0);
    const available = Math.max(0, Number(products.find((item) => item.codigo === product.codigo)?.stock) || 0);
    if (!Number.isInteger(requested) || requested < 1) { setNotice('La cantidad debe ser un número entero mayor que cero.'); return; }
    if (alreadyInCart + requested > available) { setNotice(`Stock insuficiente de ${product.nombre}. Disponible: ${available - alreadyInCart}.`); return; }
    updateCart(addCartItem(cart, product, quantity, message));
    setNotice(`${product.nombre} se agregó a tu carrito.`);
  };
  const changeQuantity = (line, delta) => {
    const matchingLine = cart.find((item) => item.codigo === line.codigo && (item.mensaje || '') === (line.mensaje || ''));
    const nextQuantity = Number(matchingLine?.cantidad || 0) + delta;
    const totalForProduct = cart.filter((item) => item.codigo === line.codigo).reduce((sum, item) => sum + Number(item.cantidad), 0);
    const available = Math.max(0, Number(products.find((item) => item.codigo === line.codigo)?.stock) || 0);
    if (delta > 0 && totalForProduct + delta > available) { setNotice(`No hay más stock disponible de ${line.nombre}.`); return; }
    const next = cart.map((item) => item.codigo === line.codigo && (item.mensaje || '') === (line.mensaje || '')
      ? { ...item, cantidad: nextQuantity } : item).filter((item) => item.cantidad > 0);
    updateCart(next);
  };
  const removeFromCart = (line) => updateCart(cart.filter((item) => !(item.codigo === line.codigo && (item.mensaje || '') === (line.mensaje || ''))));
  const pay = async (customer, outcome) => {
    if (currentUser?.role === 'vendedor') return 'La cuenta de vendedor no tiene permiso para realizar compras.';
    if (!isValidName(customer.name)) return 'El nombre debe contener solo letras y espacios.';
    if (!isSyntacticallyValidEmail(customer.email)) return 'Ingresa un correo electrónico con formato válido.';
    if (!isValidChileanMobile(customer.phone)) return 'Ingresa un celular chileno con formato +569 y 8 dígitos.';
    const birthDate = currentUser?.fechaNacimiento || currentUser?.fecha || '';
    if (birthDate && !isValidDateNotFuture(birthDate)) return 'La fecha de nacimiento registrada no es válida.';
    if (!currentUser) return 'Inicia sesión o crea una cuenta para confirmar tu compra.';
    if (outcome === 'rejected') {
      setRecentOrder({ customer: { name: customer.name, email: customer.email }, items: cart, total: cartTotal(cart), status: 'rejected', createdAt: new Date().toISOString() });
      window.location.hash = '#/pago/fallido';
      return '';
    }
    try {
      const created = await api.checkout({
        items: cart.map((item) => ({ productoId: Number(item.codigo), cantidad: Number(item.cantidad) })),
        telefono: customer.phone.trim(), direccion: customer.address.trim(), region: customer.region,
        comuna: customer.commune, tipoEntrega: customer.delivery, metodoPago: customer.payment,
        promoCode: customer.promoCode || '',
      });
      const order = mapApiOrder(created);
      setRecentOrder(order);
      setOrders((items) => [order, ...items]);
      setMyOrders((items) => [order, ...items]);
      const freshProducts = await api.products();
      setProducts(freshProducts.map(mapApiProduct));
      updateCart([]);
      window.location.hash = '#/pago/exito';
      return '';
    } catch (error) {
      return error.message || 'No fue posible registrar la compra.';
    }
  };
  const login = async (email, password) => {
    try {
      const result = await api.login(email.trim().toLowerCase(), password);
      const user = result.usuario || result.user;
      const session = { id: user.id, nombre: user.nombre, name: user.nombre, email: user.email, fechaNacimiento: user.fechaNacimiento || '', role: String(user.rol || user.role || '').toLowerCase() };
      setCurrentUser(session);
      window.localStorage.setItem('mil-sabores.session.v1', JSON.stringify(session));
      window.location.hash = session.role === 'admin' ? '#/admin' : session.role === 'vendedor' ? '#/vendedor' : '#/';
      return '';
    } catch (error) {
      return error.message || 'No fue posible iniciar sesión.';
    }
  };
  const logout = () => {
    api.logout().catch(() => {});
    if (currentUser) logAudit('user.logout', { actor: currentUser.email, actorName: currentUser.nombre || currentUser.name, description: 'Cierre de sesión.' });
    setCurrentUser(null); window.localStorage.removeItem('mil-sabores.session.v1'); window.location.hash = '#/';
  };
  const register = async (form) => {
    const nombre = form.nombre.trim();
    const email = form.email.trim().toLowerCase();
    const fechaNacimiento = form.fechaNacimiento;
    const promoCode = form.promoCode.trim().toUpperCase();
    if (!isValidName(nombre)) return { error: 'El nombre debe contener solo letras y espacios.' };
    if (!isValidEmail(email)) return { error: 'Ingresa un correo válido @duoc.cl, @profesor.duoc.cl o @gmail.com.' };
    if (!isValidDateNotFuture(fechaNacimiento)) return { error: 'La fecha de nacimiento debe ser válida y no puede estar en el futuro.' };
    if (form.password.length < 8 || form.password.length > 72) return { error: 'La contraseña debe tener entre 8 y 72 caracteres para cumplir la política de seguridad.' };
    if (promoCode && promoCode !== 'FELICES50') return { error: 'El código promocional no es válido. Prueba con FELICES50.' };
    try {
      await api.register({ nombre, email, password: form.password, fechaNacimiento });
      const loginResult = await api.login(email, form.password);
      const user = loginResult.usuario || loginResult.user;
      const session = { id: user.id, nombre: user.nombre, name: user.nombre, email: user.email, role: String(user.rol || user.role || 'cliente').toLowerCase(), fechaNacimiento: user.fechaNacimiento || fechaNacimiento, promoCode };
      setCurrentUser(session);
      window.localStorage.setItem('mil-sabores.session.v1', JSON.stringify(session));
      setNotice(`Cuenta de ${nombre} creada correctamente.`);
      window.location.hash = '#/';
      return { message: 'Cuenta creada correctamente. Iniciaste sesión.' };
    } catch (error) {
      return { error: error.message || 'No fue posible crear la cuenta.' };
    }
  };
  const saveProduct = async (product, editingCode) => {
    const category = categories.find((item) => item.nombre === product.categoria);
    if (!category) throw new Error('Selecciona una categoría válida.');
    const payload = {
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: Number(product.precio),
      stock: Number(product.stock),
      imagenUrl: product.imagen || '',
      categoriaId: Number(category.id),
      activo: true,
    };
    if (editingCode) await api.updateProduct(Number(editingCode), payload);
    else await api.createProduct(payload);
    await refreshProducts();
  };
  const deleteProduct = async (code) => {
    await api.deleteProduct(Number(code));
    await refreshProducts();
  };
  const createCategory = async (category) => {
    if (!category.nombre.trim()) throw new Error('Escribe un nombre de categoría válido.');
    await api.createCategory(category);
    await refreshCategories();
  };
  const deleteCategory = async (id) => { await api.deleteCategory(Number(id)); await refreshCategories(); };
  const editUser = async (id, changes) => {
    const target = users.find((user) => user.id === id);
    if (!target) throw new Error('No se encontró el usuario.');
    await api.updateUser(id, { nombre: changes.nombre, email: target.email, rol: String(changes.rol || target.rol).toUpperCase(), activo: target.activo });
    await refreshUsers();
  };
  const createUser = async (data) => { await api.createUser(data); await refreshUsers(); };
  const deactivateUser = async (id) => { await api.deleteUser(id); await refreshUsers(); };
  const cancelOrder = async (id) => {
    await api.cancelOrder(id);
    await refreshOrders();
    setNotice('Boleta anulada y stock devuelto al inventario.');
  };

  const openProduct = (product) => { window.location.hash = `#/producto/${encodeURIComponent(product.codigo)}`; };
  const path = route.split('?')[0];
  const adminRoute = path.startsWith('/admin');
  const sellerReadOnly = currentUser?.role === 'vendedor';
  const sellerRestrictedPath = sellerReadOnly && (
    path === '/categorias' || path.startsWith('/categoria/') || path === '/ofertas' ||
    path === '/nosotros' || path === '/blog' || path.startsWith('/blog/') || path === '/contacto'
  );
  const adminSection = path.split('/')[2] || 'inicio';
  const productCode = decodeURIComponent(path.split('/')[2] || '');
  const selectedProduct = products.find((product) => product.codigo === productCode);
  const categorySlug = path.split('/')[2];
  const selectedCategory = categories.find((category) => category.id === categorySlug || slugify(category.nombre) === categorySlug);

  let view;
  if (sellerRestrictedPath) view = <HomeView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={false} sellerMode />;
  else if (path === '/') view = <HomeView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={!sellerReadOnly} sellerMode={sellerReadOnly} onCategory={(name) => { window.location.hash = `#/categoria/${slugify(name)}`; }} />;
  else if (path === '/productos') view = <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={!sellerReadOnly} />;
  else if (path === '/categorias') view = <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={!sellerReadOnly} title="Explora por categoría" categoryOnly onCategory={(name) => { window.location.hash = `#/categoria/${slugify(name)}`; }} />;
  else if (path.startsWith('/categoria/')) view = selectedCategory
    ? <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={!sellerReadOnly} title={selectedCategory.nombre} initialCategory={selectedCategory.nombre} />
    : <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={!sellerReadOnly} title="Nuestros productos" />;
  else if (path === '/ofertas') view = <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={!sellerReadOnly} title="Ofertas de la semana" offersOnly />;
  else if (path.startsWith('/producto/')) view = <ProductDetailView product={selectedProduct} onAdd={addToCart} canPurchase={!sellerReadOnly} />;
  else if (path === '/carrito') view = sellerReadOnly ? <SellerPurchaseBlocked /> : <CartView cart={cart} onQuantity={changeQuantity} onRemove={removeFromCart} />;
  else if (path === '/mis-compras') view = currentUser?.role === 'cliente' ? <MyOrdersView orders={myOrders} /> : <AdminAccess />;
  else if (path === '/checkout') view = sellerReadOnly ? <SellerPurchaseBlocked /> : <CheckoutView cart={cart} onPay={pay} currentUser={currentUser} />;
  else if (path === '/vendedor') view = currentUser?.role === 'vendedor' ? <SellerView products={products} orders={orders} onView={openProduct} /> : <AdminAccess />;
  else if (path === '/pago/exito') view = sellerReadOnly ? <SellerPurchaseBlocked /> : <PaymentResultView order={recentOrder?.status === 'paid' ? recentOrder : null} successful />;
  else if (path === '/pago/fallido') view = sellerReadOnly ? <SellerPurchaseBlocked /> : <PaymentResultView order={recentOrder?.status === 'rejected' ? recentOrder : null} successful={false} />;
  else if (path === '/login') view = <LoginView onLogin={login} />;
  else if (path === '/registro') view = <RegisterView onRegister={register} />;
  else if (path === '/nosotros') view = <AboutView />;
  else if (path === '/blog') view = <BlogView />;
  else if (path.startsWith('/blog/')) view = <BlogDetailView slug={path.split('/')[2]} />;
  else if (path === '/contacto') view = <ContactView />;
  else if (adminRoute) {
    if (currentUser?.role !== 'admin') view = <AdminAccess />;
    else {
      const section = ['inicio', 'productos', 'criticos', 'categorias', 'ordenes', 'usuarios', 'auditoria', 'reportes', 'perfil'].includes(adminSection) ? adminSection : 'inicio';
      let content;
      if (section === 'inicio') content = <AdminOverview products={products} orders={orders} users={users} />;
      else if (section === 'productos') content = <AdminProducts products={products} categories={categories} onSave={saveProduct} onDelete={deleteProduct} />;
      else if (section === 'criticos') content = <AdminProducts products={products} categories={categories} onSave={saveProduct} onDelete={deleteProduct} criticalOnly />;
      else if (section === 'categorias') content = <AdminCategories categories={categories} products={products} onCreate={createCategory} onDelete={deleteCategory} />;
      else if (section === 'ordenes') content = <AdminOrders orders={orders} onCancel={cancelOrder} />;
      else if (section === 'usuarios') content = <AdminUsers users={users} orders={orders} onUpdate={editUser} onCreate={createUser} onDelete={deactivateUser} />;
      else if (section === 'auditoria') content = <AdminAudit entries={auditEntries} />;
      else if (section === 'reportes') content = <AdminReports products={products} orders={orders} />;
      else content = <AdminProfile user={currentUser} />;
      view = <AdminLayout section={section}>{content}</AdminLayout>;
    }
  } else view = <HomeView products={products} categories={categories} onAdd={addToCart} onView={openProduct} canPurchase={!sellerReadOnly} sellerMode={sellerReadOnly} onCategory={(name) => { window.location.hash = `#/categoria/${slugify(name)}`; }} />;

  const dashboardRoute = adminRoute || path === '/vendedor';
  return <><Header cartCount={cartQuantity(cart)} currentUser={currentUser} onLogout={logout} />{view}{!dashboardRoute && !sellerReadOnly && <Footer />}{notice && <div className="toast-note" role="status"><span>✓</span>{notice}</div>}</>;
}
