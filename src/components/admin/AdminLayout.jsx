import React from 'react';

const menu = [
  ['inicio', 'Resumen', '⌂'], ['productos', 'Productos', '▦'], ['criticos', 'Stock crítico', '!'],
  ['categorias', 'Categorías', '◫'], ['ordenes', 'Órdenes y boletas', '▤'], ['usuarios', 'Usuarios', '♙'],
  ['auditoria', 'Auditoría', '✓'], ['reportes', 'Reportes', '◷'], ['perfil', 'Mi perfil', '○'],
];

export default function AdminLayout({ section, children }) {
  return <main className="admin-page"><aside className="admin-sidebar"><div className="admin-sidebar-brand"><span className="brand-mark">✿</span><span><strong>Mil Sabores</strong><small>Administración</small></span></div><nav aria-label="Menú de administración">{menu.map(([id, label, icon]) => <a key={id} className={section === id ? 'active' : ''} href={`#/admin/${id}`}><span aria-hidden="true">{icon}</span>{label}</a>)}</nav><a className="admin-back-link" href="#/">← Volver a la tienda</a></aside><section className="admin-main">{children}</section></main>;
}
