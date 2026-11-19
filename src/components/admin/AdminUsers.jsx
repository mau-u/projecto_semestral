import React, { useState } from 'react';
import { formatPrice } from '../../utils/format.js';

const empty = { nombre: '', email: '', password: '', rol: 'CLIENTE' };

export default function AdminUsers({ users, orders, onUpdate, onCreate, onDelete }) {
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('CLIENTE');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const user = users.find((item) => item.id === selected);
  const userOrders = user ? orders.filter((order) => (order.customer.email || '').toLowerCase() === user.email.toLowerCase()) : [];

  const submitCreate = async (event) => {
    event.preventDefault(); setError(''); setNotice('');
    try {
      await onCreate({ ...form, nombre: form.nombre.trim(), email: form.email.trim().toLowerCase(), activo: true });
      setForm(empty); setCreating(false); setNotice('Usuario creado correctamente.');
    } catch (saveError) { setError(saveError.message || 'No se pudo crear el usuario.'); }
  };

  const submitEdit = async (event) => {
    event.preventDefault(); setError('');
    try { await onUpdate(editing, { nombre: nombre.trim(), rol }); setEditing(null); setNotice('Usuario actualizado.'); }
    catch (saveError) { setError(saveError.message || 'No se pudo actualizar el usuario.'); }
  };

  return <>
    <div className="admin-page-heading"><div><p className="eyebrow">Accesos</p><h1>Usuarios</h1><p>Administra cuentas, roles e historial de compras.</p></div>
      <button className="btn btn-brand" onClick={() => { setCreating((value) => !value); setError(''); }}>+ Nuevo usuario</button>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}
    {creating && <section className="admin-panel admin-editor"><div className="admin-panel-heading"><h2>Crear cuenta</h2></div>
      <form onSubmit={submitCreate} className="row g-3">
        <label className="col-md-4 form-label">Nombre<input className="form-control" required maxLength="100" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></label>
        <label className="col-md-4 form-label">Correo<input className="form-control" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="col-md-4 form-label">Contraseña temporal<input className="form-control" type="password" minLength="8" maxLength="72" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label className="col-md-4 form-label">Rol<select className="form-select" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}><option value="CLIENTE">Cliente</option><option value="VENDEDOR">Vendedor</option><option value="ADMIN">Administrador</option></select></label>
        <div className="col-12"><button className="btn btn-brand">Crear usuario</button></div>
      </form>
    </section>}
    {user && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">Perfil de usuario</p><h2>{user.nombre}</h2><p>{user.email} · {user.rol} · {user.activo ? 'Activo' : 'Desactivado'}</p></div><button className="btn btn-sm btn-outline-secondary" onClick={() => setSelected(null)}>Cerrar</button></div>
      {editing === user.id ? <form className="user-edit-form" onSubmit={submitEdit}><input className="form-control" required value={nombre} onChange={(e) => setNombre(e.target.value)} aria-label="Nombre de usuario"/><select className="form-select" value={rol} onChange={(e) => setRol(e.target.value)} aria-label="Rol"><option value="CLIENTE">Cliente</option><option value="VENDEDOR">Vendedor</option><option value="ADMIN">Administrador</option></select><button className="btn btn-brand btn-sm">Guardar</button><button className="btn btn-light btn-sm" type="button" onClick={() => setEditing(null)}>Cancelar</button></form> : <button className="table-action" onClick={() => { setEditing(user.id); setNombre(user.nombre); setRol(String(user.rol).toUpperCase()); }}>Editar nombre y rol</button>}
      <h3 className="history-title">Historial de compras</h3>{userOrders.length ? userOrders.map((order) => <div className="history-row" key={order.id}><span>{order.id} · {order.status === 'cancelled' ? 'Anulada' : 'Emitida'}</span><strong>{formatPrice(order.total)}</strong></div>) : <p className="admin-empty">Este usuario todavía no registra compras.</p>}
    </section>}
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Usuarios registrados <span className="count-chip">{users.length}</span></h2><p>Las cuentas y roles se guardan en MySQL.</p></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td>{item.nombre}</td><td>{item.email}</td><td>{item.rol}</td><td>{item.activo ? 'Activo' : 'Desactivado'}</td><td><button className="table-action" onClick={() => { setSelected(item.id); setEditing(null); }}>Ver cuenta</button>{item.activo && <button className="table-action delete ms-2" onClick={async () => { if (!window.confirm(`¿Desactivar la cuenta de ${item.nombre}?`)) return; try { await onDelete(item.id); setNotice('Cuenta desactivada.'); } catch (e) { setError(e.message || 'No se pudo desactivar la cuenta.'); } }}>Desactivar</button>}</td></tr>)}</tbody></table></div>
    </section>
  </>;
}
