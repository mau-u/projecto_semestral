import React, { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

export default function CatalogView({ products, categories, onAdd, onView, title = 'Nuestros productos', initialCategory = 'Todas', offersOnly = false, categoryOnly = false, onCategory }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('destacados');
  const visible = useMemo(() => {
    let result = products.filter((product) => (!offersOnly || product.isOffer)
      && (category === 'Todas' || product.categoria === category)
      && `${product.nombre} ${product.codigo} ${product.categoria}`.toLowerCase().includes(query.trim().toLowerCase()));
    if (sort === 'precio-asc') result = [...result].sort((a, b) => a.precio - b.precio);
    if (sort === 'precio-desc') result = [...result].sort((a, b) => b.precio - a.precio);
    if (sort === 'nombre') result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return result;
  }, [products, offersOnly, category, query, sort]);

  return (
    <main className="container content-section catalog-page">
      <SectionHeading eyebrow={offersOnly ? 'Una oportunidad dulce' : 'Nuestro catálogo'} title={title} description={offersOnly ? 'Precios especiales en favoritos de la casa, disponibles hasta agotar stock.' : 'Preparaciones artesanales para compartir, celebrar o darte un gusto.'} />
      {categoryOnly && <div className="category-pills">{categories.map((item) => <button key={item.id} className={`category-pill ${category === item.nombre ? 'active' : ''}`} onClick={() => { setCategory(item.nombre); onCategory?.(item.nombre); }}>{item.nombre}<span>{products.filter((product) => product.categoria === item.nombre).length}</span></button>)}</div>}
      <div className="catalog-toolbar"><label className="search-field"><span aria-hidden="true">⌕</span><input className="form-control" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tortas, postres o código" aria-label="Buscar productos" /></label><label className="sort-field"><span>Ordenar</span><select className="form-select" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar productos"><option value="destacados">Destacados</option><option value="nombre">Nombre A-Z</option><option value="precio-asc">Precio: menor a mayor</option><option value="precio-desc">Precio: mayor a menor</option></select></label></div>
      {!categoryOnly && <div className="category-pills"><button className={`category-pill ${category === 'Todas' ? 'active' : ''}`} onClick={() => setCategory('Todas')}>Todas las categorías</button>{categories.map((item) => <button key={item.id} className={`category-pill ${category === item.nombre ? 'active' : ''}`} onClick={() => setCategory(item.nombre)}>{item.nombre}</button>)}</div>}
      <div className="catalog-count">{visible.length} {visible.length === 1 ? 'producto encontrado' : 'productos encontrados'}</div>
      {visible.length ? <div className="row g-4">{visible.map((product) => <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={product.codigo}><ProductCard product={product} onAdd={onAdd} onView={onView} /></div>)}</div> : <div className="empty-state"><span>✿</span><h2>No encontramos productos</h2><p>Prueba con otro nombre, código o categoría.</p><button className="btn btn-outline-brand" onClick={() => { setQuery(''); setCategory('Todas'); }}>Limpiar búsqueda</button></div>}
    </main>
  );
}
