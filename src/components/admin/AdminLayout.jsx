
import React from 'react';


// ========================================
// MENÚ DE NAVEGACIÓN ADMINISTRATIVA
// ========================================

const menu = [
  ['inicio', 'Resumen', '⌂'],
  ['productos', 'Productos', '▦'],
  ['criticos', 'Stock crítico', '!'],
  ['categorias', 'Categorías', '◫'],
  ['ordenes', 'Órdenes y boletas', '▤'],
  ['usuarios', 'Usuarios', '♙'],
  ['auditoria', 'Auditoría', '✓'],
  ['reportes', 'Reportes', '◷'],
  ['perfil', 'Mi perfil', '○']
];


// ========================================
// COMPONENTE: ESTRUCTURA DEL ADMINISTRADOR
// ========================================

export default function AdminLayout({
  section,
  children
}) {
  return (
    <main className="admin-page">

      {/* Barra lateral de navegación */}
      <aside className="admin-sidebar">

        {/* Identidad de la pastelería */}
        <div className="admin-sidebar-brand">
          <span className="brand-mark">
            ✿
          </span>

          <span>
            <strong>Mil Sabores</strong>
            <small>Administración</small>
          </span>
        </div>


        {/* Opciones del menú administrativo */}
        <nav aria-label="Menú de administración">
          {menu.map(([id, label, icon]) => (
            <a
              key={id}
              className={section === id ? 'active' : ''}
              href={`#/admin/${id}`}
            >
              <span aria-hidden="true">
                {icon}
              </span>

              {label}
            </a>
          ))}
        </nav>


        {/* Enlace para regresar a la tienda */}
        <a
          className="admin-back-link"
          href="#/"
        >
          ← Volver a la tienda
        </a>

      </aside>


      {/* Contenido de la sección seleccionada */}
      <section className="admin-main">
        {children}
      </section>

    </main>
  );
}
