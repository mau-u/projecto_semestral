import React from 'react';

export default function AdminProfile({ user }) {
  return <><div className="admin-page-heading"><div><p className="eyebrow">Cuenta</p><h1>Perfil de administrador</h1><p>Datos de la cuenta demo utilizada para esta presentación.</p></div></div><section className="admin-panel profile-panel"><div className="profile-avatar">{user?.nombre?.slice(0, 1) || 'M'}</div><div><p className="eyebrow">Sesión activa</p><h2>{user?.nombre || 'Administración Mil Sabores'}</h2><p>{user?.email || 'admin@duoc.cl'}</p><span className="status-chip paid">Administrador</span></div><div className="profile-note"><strong>Modo académico</strong><p>El acceso y los datos de esta tienda se simulan en el navegador. La aplicación no está conectada a un servidor ni procesa pagos.</p></div></section></>;
}
