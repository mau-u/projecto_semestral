
import React from 'react';

import ProductCard from '../components/ProductCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';


export default function HomeView({
  products,
  categories,
  onAdd,
  onView,
  onCategory
}) {
  const featured = products
    .filter((product) => product.isOffer)
    .slice(0, 4);

  return (
    <main>

      {/* Sección principal de bienvenida */}
      <section className="hero-section">
        <div className="container hero-grid">

          <div className="hero-copy">
            <p className="eyebrow">
              Una tradición para compartir
            </p>

            <h1>
              Un momento dulce
              <br />
              <em>cambia el día.</em>
            </h1>

            <p className="hero-lead">
              Tortas, pasteles y pequeños antojos preparados
              cada mañana con ingredientes de verdad.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <a
                className="btn btn-brand btn-lg"
                href="#/productos"
              >
                Descubrir la tienda
                <span aria-hidden="true">↗</span>
              </a>

              <a
                className="btn btn-light btn-lg"
                href="#/nosotros"
              >
                Nuestra historia
              </a>
            </div>

            <div className="hero-note">
              <span className="hero-note-icon">✦</span>

              <span>
                <strong>
                  50 años horneando recuerdos
                </strong>

                <small>
                  Desde Santiago, para tu mesa.
                </small>
              </span>
            </div>
          </div>


          {/* Imagen destacada de la pastelería */}
          <div
            className="hero-visual"
            aria-label="Torta artesanal de chocolate"
          >
            <div className="hero-photo">
              <img
                src="/img/TC001.jpg"
                alt="Torta de chocolate de Mil Sabores"
              />
            </div>

            <div className="hero-sticker">
              <span>
                Hecho
                <br />
                en casa
              </span>

              <strong>✿</strong>
            </div>

            <div className="hero-caption">
              <span>Favorita de la casa</span>
              <strong>Torta de chocolate</strong>
            </div>
          </div>

        </div>
      </section>


      {/* Beneficios de la pastelería */}
      <section className="benefit-strip">
        <div className="container benefit-grid">

          <div>
            <span>✿</span>

            <p>
              <strong>Hecho a mano</strong>
              <small>Elaboración diaria</small>
            </p>
          </div>

          <div>
            <span>⌂</span>

            <p>
              <strong>Retiro en tienda</strong>
              <small>Providencia, Santiago</small>
            </p>
          </div>

          <div>
            <span>♡</span>

            <p>
              <strong>Recetas de siempre</strong>
              <small>50 años de tradición</small>
            </p>
          </div>

        </div>
      </section>


      {/* Video de elaboración artesanal */}
      <section
        className="container content-section home-video-section"
        aria-label="Video de elaboración de pastelería"
      >
        <SectionHeading
          eyebrow="Desde la cocina"
          title="Hecho a mano, con paciencia"
          description="Un vistazo al trabajo artesanal detrás de cada preparación."
        />

        <div className="home-video-shell">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/img/TC001.jpg"
            aria-label="Preparación artesanal de pastelería"
          >
            <source
              src="/video/pasteleria.mp4"
              type="video/mp4"
            />

            Tu navegador no puede reproducir este video.
          </video>
        </div>

        <p className="video-credit">
          Video de Marwan Tj para Pexels · Licencia gratuita.
        </p>
      </section>


      {/* Categorías de productos */}
      <section className="container content-section">
        <SectionHeading
          eyebrow="Encuentra tu favorito"
          title="Algo rico para cada ocasión"
          description="Explora nuestras categorías y encuentra la receta que estabas buscando."
        />

        <div className="category-grid">
          {categories.slice(0, 4).map((category, index) => (
            <button
              className={`category-tile category-tone-${index + 1}`}
              key={category.id}
              onClick={() => onCategory(category.nombre)}
            >
              <span className="category-number">
                0{index + 1}
              </span>

              <span className="category-tile-copy">
                <strong>{category.nombre}</strong>
                <small>{category.descripcion}</small>
              </span>

              <span className="category-arrow">
                ↗
              </span>
            </button>
          ))}
        </div>
      </section>


      {/* Productos destacados en oferta */}
      <section className="featured-section">
        <div className="container content-section">
          <SectionHeading
            eyebrow="Un gusto de temporada"
            title="Favoritos con precio especial"
            description="Una selección de productos para que disfrutes algo rico hoy."
            action={
              <a
                className="text-link"
                href="#/ofertas"
              >
                Ver todas las ofertas
                <span>→</span>
              </a>
            }
          />

          <div className="row g-4">
            {featured.map((product) => (
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={product.codigo}
              >
                <ProductCard
                  product={product}
                  onAdd={onAdd}
                  onView={onView}
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Historia de la pastelería */}
      <section className="story-banner container">

        <div className="story-copy">
          <p className="eyebrow">
            Nuestra historia
          </p>

          <h2>
            Una receta familiar,
            <br />
            <em>muchas mesas felices.</em>
          </h2>

          <p>
            Desde 1975 acompañamos cumpleaños, sobremesas y
            tardes de café. Conservamos el cariño de la cocina
            de antes y sumamos nuevas ideas cada temporada.
          </p>

          <a
            className="text-link"
            href="#/nosotros"
          >
            Conócenos mejor
            <span>→</span>
          </a>
        </div>


        <div className="story-art">
          <img
            src="/img/TT002.jpg"
            alt="Torta tradicional de manjar"
            loading="lazy"
          />

          <span>
            Preparado
            <br />
            con cariño
          </span>
        </div>

      </section>

    </main>
  );
}
