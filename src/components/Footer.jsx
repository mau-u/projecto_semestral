import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><a className="footer-brand" href="#/">Mil Sabores<span>Pastelería artesanal</span></a><p>Celebramos los momentos importantes con recetas hechas en casa y productos frescos todos los días.</p></div>
        <div><h2>Explora</h2><a href="#/productos">Nuestros productos</a><a href="#/ofertas">Ofertas de la semana</a><a href="#/nosotros">Nuestra historia</a></div>
        <div><h2>Visítanos</h2><p>Av. Providencia 1234<br />Providencia, Santiago</p><p>Mar a dom · 09:00 a 20:00</p></div>
      </div>
      <div className="footer-bottom"><div className="container">© {new Date().getFullYear()} Pastelería Mil Sabores · Proyecto académico con persistencia local de demostración.</div></div>
    </footer>
  );
}
