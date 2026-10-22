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
import LoginView, { RegisterView } from './views/LoginView.jsx';
import { AboutView, BlogView, BlogDetailView, ContactView } from './views/InfoView.jsx';
import {
  addCartItem, auditRepository, cartQuantity, cartRepository, cartTotal, categoriesRepository, decreaseStock,
  getStockChanges,
  ordersRepository, productsRepository, usersRepository,
} from './data/persistence.js';
import { slugify } from './utils/format.js';
import { calculatePromotions } from './utils/promotions.js';
import { isValidChileanMobile, isValidDateNotFuture, isValidEmail, isValidName, isSyntacticallyValidEmail } from './utils/validation.js';

const getRoute = () => window.location.hash.replace(/^#/, '') || '/';

function readSession() {
  try { return JSON.parse(window.localStorage.getItem('mil-sabores.session.v1')) || null; }
  catch { return null; }
}

function AdminAccess() {
  return <main className="container content-section"><div className="empty-state"><span>⌑</span><p className="eyebrow">Área administrativa</p><h1>Inicia sesión para continuar</h1><p>Usa la cuenta demo para acceder al panel y administrar el catálogo.</p><a className="btn btn-brand" href="#/login">Ir a iniciar sesión</a></div></main>;
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [products, setProducts] = useState(() => productsRepository.list());
  const [categories, setCategories] = useState(() => categoriesRepository.list());
  const [cart, setCart] = useState(() => cartRepository.list());
  const [orders, setOrders] = useState(() => ordersRepository.list());
  const [users, setUsers] = useState(() => usersRepository.list());
  const [auditEntries, setAuditEntries] = useState(() => auditRepository.list());
  const [currentUser, setCurrentUser] = useState(readSession);
  const [recentOrder, setRecentOrder] = useState(() => ordersRepository.list().at(-1) || null);
  const [notice, setNotice] = useState('');

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

  const refreshProducts = () => setProducts(productsRepository.list());
  const refreshOrders = () => setOrders(ordersRepository.list());
  const refreshUsers = () => setUsers(usersRepository.list());
  const refreshAudit = () => setAuditEntries(auditRepository.list());
  const logAudit = (type, event) => {
    auditRepository.create({ type, at: new Date().toISOString(), ...event });
    refreshAudit();
  };
  const refreshCategories = () => setCategories(categoriesRepository.list());
  const updateCart = (next) => { cartRepository.replace(next); setCart(next); };
  const addToCart = (product, quantity = 1, message = '') => {
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
  const pay = (customer, outcome) => {
    if (!isValidName(customer.name)) return 'El nombre debe contener solo letras y espacios.';
    if (!isSyntacticallyValidEmail(customer.email)) return 'Ingresa un correo electrónico con formato válido.';
    if (!isValidChileanMobile(customer.phone)) return 'Ingresa un celular chileno con formato +569 y 8 dígitos.';
    const birthDate = currentUser?.fechaNacimiento || currentUser?.fecha || '';
    if (birthDate && !isValidDateNotFuture(birthDate)) return 'La fecha de nacimiento registrada no es válida.';
    const inventory = getStockChanges(cart, productsRepository.list());
    if (inventory.error) return inventory.error;
    const inventoryChanges = inventory.changes;
    const shipping = customer.delivery === 'despacho' ? 2990 : 0;
    const promotions = calculatePromotions(cart, { birthDate, email: currentUser?.email || customer.email, promoCode: customer.promoCode });
    const createdAt = new Date().toISOString();
    const isApproved = outcome === 'approved';
    const status = isApproved ? 'paid' : 'rejected';
    const auditTrail = [
      { type: 'order.created', at: createdAt, description: 'Pedido registrado en el checkout.' },
      ...(isApproved ? inventoryChanges.map((change) => ({ type: 'inventory.decreased', at: createdAt, ...change })) : []),
      ...(isApproved ? promotions.discounts.map((discount) => ({ type: 'discount.applied', at: createdAt, ...discount })) : []),
      { type: isApproved ? 'payment.approved' : 'payment.rejected', at: createdAt, description: isApproved ? 'Pago de demostración aprobado.' : 'Pago de demostración rechazado.' },
    ];
    const order = ordersRepository.create({
      id: `MS-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      customer: { name: customer.name.trim(), email: customer.email.trim(), phone: customer.phone.trim(), birthDate },
      region: customer.region, commune: customer.commune, address: customer.address.trim(),
      delivery: customer.delivery, payment: customer.payment,
      items: cart.map((item) => ({ ...item })), subtotal: cartTotal(cart), shipping,
      totalBeforeDiscounts: cartTotal(cart) + shipping,
      discounts: promotions.discounts, discountTotal: promotions.discountTotal,
      total: promotions.discountedSubtotal + shipping, status,
      createdAt, auditTrail,
    });
    if (isApproved) {
      decreaseStock(inventoryChanges, productsRepository);
      refreshProducts();
    }
    logAudit('order.created', { actor: order.customer.email, actorName: order.customer.name, orderId: order.id, description: `Pedido ${order.id} registrado.`, amount: order.total, status });
    if (isApproved) inventoryChanges.forEach((change) => logAudit('inventory.decreased', {
      actor: order.customer.email, actorName: order.customer.name, orderId: order.id,
      description: `${change.nombre}: ${change.stockBefore} → ${change.stockAfter} unidades.`, quantity: change.quantity, status: 'paid',
    }));
    if (isApproved) promotions.discounts.forEach((discount) => logAudit('discount.applied', {
      actor: order.customer.email, actorName: order.customer.name, orderId: order.id,
      description: `${discount.label} (${discount.code})`, amount: discount.amount, status: 'paid',
    }));
    logAudit(isApproved ? 'payment.approved' : 'payment.rejected', {
      actor: order.customer.email, actorName: order.customer.name, orderId: order.id,
      description: isApproved ? 'Pago de demostración aprobado.' : 'Pago de demostración rechazado.', amount: order.total, status,
    });
    setRecentOrder(order);
    refreshOrders();
    if (isApproved) updateCart([]);
    window.location.hash = isApproved ? '#/pago/exito' : '#/pago/fallido';
    return '';
  };
  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === 'admin@duoc.cl' && password === '1234') {
      const admin = { id: 'admin-demo', nombre: 'Administración Mil Sabores', name: 'Administración Mil Sabores', email: 'admin@duoc.cl', role: 'admin' };
      setCurrentUser(admin);
      window.localStorage.setItem('mil-sabores.session.v1', JSON.stringify(admin));
      logAudit('user.login', { actor: admin.email, actorName: admin.nombre, description: 'Inicio de sesión administrativo.' });
      window.location.hash = '#/admin';
      return '';
    }
    const user = usersRepository.list().find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
    if (!user) return 'Correo o contraseña incorrectos. Revisa tus datos o crea una cuenta nueva.';
    const session = { id: user.id, nombre: user.nombre, name: user.nombre, email: user.email, role: 'customer', fechaNacimiento: user.fechaNacimiento || '', promoCode: user.promoCode || '' };
    setCurrentUser(session);
    window.localStorage.setItem('mil-sabores.session.v1', JSON.stringify(session));
    logAudit('user.login', { actor: user.email, actorName: user.nombre, description: 'Inicio de sesión de cliente.' });
    window.location.hash = '#/';
    return '';
  };
  const logout = () => {
    if (currentUser) logAudit('user.logout', { actor: currentUser.email, actorName: currentUser.nombre || currentUser.name, description: 'Cierre de sesión.' });
    setCurrentUser(null); window.localStorage.removeItem('mil-sabores.session.v1'); window.location.hash = '#/';
  };
  const register = (form) => {
    const nombre = form.nombre.trim();
    const email = form.email.trim().toLowerCase();
    const fechaNacimiento = form.fechaNacimiento;
    const promoCode = form.promoCode.trim().toUpperCase();
    if (!isValidName(nombre)) return { error: 'El nombre debe contener solo letras y espacios, con un máximo de 100 caracteres.' };
    if (!isValidEmail(email)) return { error: 'Ingresa un correo válido @duoc.cl, @profesor.duoc.cl o @gmail.com.' };
    if (!isValidDateNotFuture(fechaNacimiento)) return { error: 'La fecha de nacimiento debe ser válida y no puede estar en el futuro.' };
    if (form.password.length < 4 || form.password.length > 10) return { error: 'La contraseña debe tener entre 4 y 10 caracteres.' };
    if (promoCode && promoCode !== 'FELICES50') return { error: 'El código promocional no es válido. Prueba con FELICES50.' };
    try {
      const user = usersRepository.create({ id: email, nombre, email, fechaNacimiento, password: form.password, promoCode, rol: 'Cliente' });
      refreshUsers();
      const session = { id: user.id, nombre: user.nombre, name: user.nombre, email: user.email, role: 'customer', fechaNacimiento: user.fechaNacimiento, promoCode: user.promoCode };
      setCurrentUser(session);
      window.localStorage.setItem('mil-sabores.session.v1', JSON.stringify(session));
      logAudit('user.registered', { actor: user.email, actorName: user.nombre, description: 'Cuenta de cliente creada correctamente.' });
      setNotice(`Cuenta de ${user.nombre} creada en esta demostración.`);
      window.location.hash = '#/';
      return { message: 'Cuenta creada correctamente. Iniciaste sesión.' };
    } catch (error) { return { error: error.message }; }
  };
  const saveProduct = (product, editingCode) => {
    if (editingCode) productsRepository.update(editingCode, product);
    else productsRepository.create(product);
    refreshProducts();
  };
  const deleteProduct = (code) => { productsRepository.remove(code); refreshProducts(); };
  const createCategory = (category) => {
    const id = slugify(category.nombre);
    if (!id) throw new Error('Escribe un nombre de categoría válido.');
    categoriesRepository.create({ ...category, id });
    refreshCategories();
  };
  const deleteCategory = (id) => { categoriesRepository.remove(id); refreshCategories(); };
  const editUser = (id, changes) => { usersRepository.update(id, changes); refreshUsers(); };

  const openProduct = (product) => { window.location.hash = `#/producto/${encodeURIComponent(product.codigo)}`; };
  const path = route.split('?')[0];
  const adminRoute = path.startsWith('/admin');
  const adminSection = path.split('/')[2] || 'inicio';
  const productCode = decodeURIComponent(path.split('/')[2] || '');
  const selectedProduct = products.find((product) => product.codigo === productCode);
  const categorySlug = path.split('/')[2];
  const selectedCategory = categories.find((category) => category.id === categorySlug || slugify(category.nombre) === categorySlug);

  let view;
  if (path === '/') view = <HomeView products={products} categories={categories} onAdd={addToCart} onView={openProduct} onCategory={(name) => { window.location.hash = `#/categoria/${slugify(name)}`; }} />;
  else if (path === '/productos') view = <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} />;
  else if (path === '/categorias') view = <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} title="Explora por categoría" categoryOnly onCategory={(name) => { window.location.hash = `#/categoria/${slugify(name)}`; }} />;
  else if (path.startsWith('/categoria/')) view = selectedCategory
    ? <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} title={selectedCategory.nombre} initialCategory={selectedCategory.nombre} />
    : <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} title="Nuestros productos" />;
  else if (path === '/ofertas') view = <CatalogView products={products} categories={categories} onAdd={addToCart} onView={openProduct} title="Ofertas de la semana" offersOnly />;
  else if (path.startsWith('/producto/')) view = <ProductDetailView product={selectedProduct} onAdd={addToCart} />;
  else if (path === '/carrito') view = <CartView cart={cart} onQuantity={changeQuantity} onRemove={removeFromCart} />;
  else if (path === '/checkout') view = <CheckoutView cart={cart} onPay={pay} currentUser={currentUser} />;
  else if (path === '/pago/exito') view = <PaymentResultView order={recentOrder?.status === 'paid' ? recentOrder : null} successful />;
  else if (path === '/pago/fallido') view = <PaymentResultView order={recentOrder?.status === 'rejected' ? recentOrder : null} successful={false} />;
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
      else if (section === 'ordenes') content = <AdminOrders orders={orders} />;
      else if (section === 'usuarios') content = <AdminUsers users={users} orders={orders} onUpdate={editUser} />;
      else if (section === 'auditoria') content = <AdminAudit entries={auditEntries} />;
      else if (section === 'reportes') content = <AdminReports products={products} orders={orders} />;
      else content = <AdminProfile user={currentUser} />;
      view = <AdminLayout section={section}>{content}</AdminLayout>;
    }
  } else view = <HomeView products={products} categories={categories} onAdd={addToCart} onView={openProduct} onCategory={(name) => { window.location.hash = `#/categoria/${slugify(name)}`; }} />;

  return <><Header cartCount={cartQuantity(cart)} currentUser={currentUser} onLogout={logout} />{view}{!adminRoute && <Footer />}{notice && <div className="toast-note" role="status"><span>✓</span>{notice}</div>}</>;
}
