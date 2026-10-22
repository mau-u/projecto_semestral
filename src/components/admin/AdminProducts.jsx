import React, { useState } from 'react';
import { formatPrice } from '../../utils/format.js';

const blankForm = { codigo: '', nombre: '', categoria: '', precio: '', stock: '', imagen: '/img/TC001.jpg', descripcion: '', isOffer: false, descuento: 0 };

export default function AdminProducts({ products, categories, onSave, onDelete, criticalOnly = false }) {
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const shown = criticalOnly ? products.filter((product) => Number(product.stock) <= 4) : products;
  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setError(''); setMessage('');
  };
  const startEdit = (product) => {
    setEditing(product.codigo);
    setForm({ ...product, precio: String(product.precio), stock: String(product.stock), descuento: String(product.descuento || 0) });
    setError(''); setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => { setEditing(null); setForm(blankForm); setError(''); setMessage(''); };
  const submit = (event) => {
    event.preventDefault();
    if (!form.codigo.trim() || !form.nombre.trim() || !form.categoria || Number(form.precio) <= 0 || form.stock === '') { setError('Completa código, nombre, categoría, precio y stock.'); return; }
    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) { setError('El stock debe ser un número entero igual o mayor que cero.'); return; }
    try {
      onSave({ ...form, codigo: form.codigo.trim().toUpperCase(), nombre: form.nombre.trim(), precio: Number(form.precio), stock: Number(form.stock), descuento: form.isOffer ? Number(form.descuento) : 0 }, editing);
      setMessage(editing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
      reset(); setMessage(editing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
    } catch (saveError) { setError(saveError.message); }
  };

  return <><div className="admin-page-heading"><div><p className="eyebrow">Catálogo</p><h1>{criticalOnly ? 'Productos con stock crítico' : 'Gestión de productos'}</h1><p>{criticalOnly ? 'Revisa los productos con cuatro unidades o menos.' : 'Agrega, edita o elimina productos del catálogo.'}</p></div>{criticalOnly && <a className="btn btn-outline-brand" href="#/admin/productos">Todos los productos</a>}</div>{!criticalOnly && <section className="admin-panel admin-editor"><div className="admin-panel-heading"><div><h2>{editing ? `Editar ${editing}` : 'Nuevo producto'}</h2><p>Los cambios se guardan en el almacenamiento local del navegador.</p></div>{editing && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={reset}>Cancelar edición</button>}</div><form onSubmit={submit}><div className="row g-3"><div className="col-sm-4"><label className="form-label">Código<input className="form-control" name="codigo" value={form.codigo} onChange={change} readOnly={Boolean(editing)} required /></label></div><div className="col-sm-8"><label className="form-label">Nombre<input className="form-control" name="nombre" value={form.nombre} onChange={change} maxLength="100" required /></label></div><div className="col-md-4"><label className="form-label">Categoría<select className="form-select" name="categoria" value={form.categoria} onChange={change} required><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.nombre}>{category.nombre}</option>)}</select></label></div><div className="col-md-4"><label className="form-label">Precio<input className="form-control" name="precio" type="number" min="1" value={form.precio} onChange={change} required /></label></div><div className="col-md-4"><label className="form-label">Stock<input className="form-control" name="stock" type="number" min="0" value={form.stock} onChange={change} required /></label></div><div className="col-md-8"><label className="form-label">Imagen<input className="form-control" name="imagen" value={form.imagen} onChange={change} placeholder="/img/TC001.jpg" /></label></div><div className="col-md-4"><label className="form-label">Descripción<input className="form-control" name="descripcion" value={form.descripcion} onChange={change} maxLength="240" /></label></div><div className="col-sm-5"><label className="form-check admin-check"><input className="form-check-input" type="checkbox" name="isOffer" checked={Boolean(form.isOffer)} onChange={change} /><span className="form-check-label">Incluir en ofertas</span></label></div>{form.isOffer && <div className="col-sm-4"><label className="form-label">Descuento (%)<input className="form-control" name="descuento" type="number" min="1" max="80" value={form.descuento} onChange={change} /></label></div>}</div>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}<button className="btn btn-brand" type="submit">{editing ? 'Guardar cambios' : 'Crear producto'}</button></form></section>}<section className="admin-panel"><div className="admin-panel-heading"><div><h2>Listado de productos <span className="count-chip">{shown.length}</span></h2><p>Administra los detalles visibles en la tienda.</p></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>{shown.map((product) => <tr key={product.codigo}><td>{product.codigo}</td><td><div className="admin-product-name"><img src={product.imagen} alt="" /><strong>{product.nombre}</strong></div></td><td>{product.categoria}</td><td>{formatPrice(product.precio)}</td><td><span className={Number(product.stock) <= 4 ? 'stock-alert' : 'stock-ok'}>{product.stock}</span></td><td><div className="table-actions">{!criticalOnly && <button className="table-action" type="button" onClick={() => startEdit(product)}>Editar</button>}<button className="table-action delete" type="button" onClick={() => { if (window.confirm(`¿Eliminar ${product.nombre} del catálogo?`)) onDelete(product.codigo); }}>Eliminar</button></div></td></tr>)}</tbody></table></div>{!shown.length && <p className="admin-empty">No hay productos para mostrar.</p>}</section></>;
}
