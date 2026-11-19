package cl.dsy1104.tienda.service;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.entity.*;
import cl.dsy1104.tienda.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class ProductoService {
    private final ProductoRepository productos;
    private final CategoriaRepository categorias;
    public ProductoService(ProductoRepository productos,CategoriaRepository categorias) {
        this.productos=productos;
        this.categorias=categorias;
    }
    @Transactional(readOnly=true) public List<ProductoResponse> listarAdmin() {
        return productos.findAll().stream().map(Mapper::producto).toList();
    }
    @Transactional(readOnly=true) public List<ProductoResponse> listarTienda() {
        return productos.findByActivoTrueOrderByIdDesc().stream().map(Mapper::producto).toList();
    }
    @Transactional(readOnly=true) public ProductoResponse obtener(Long id) {
        return Mapper.producto(productos.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Producto no encontrado")));
    }
    @Transactional public ProductoResponse crear(ProductoRequest r) {
        Producto p=new Producto();
        actualizarCampos(p,r);
        return Mapper.producto(productos.save(p));
    }
    @Transactional public ProductoResponse actualizar(Long id,ProductoRequest r) {
        Producto p=productos.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Producto no encontrado"));
        actualizarCampos(p,r);
        return Mapper.producto(productos.save(p));
    }
    private void actualizarCampos(Producto p,ProductoRequest r) {
        Categoria c=categorias.findById(r.categoriaId()).orElseThrow(()->new RecursoNoEncontradoException("Categoría no encontrada"));
        p.setNombre(r.nombre().trim());
        p.setDescripcion(r.descripcion());
        p.setPrecio(r.precio());
        p.setStock(r.stock());
        p.setImagenUrl(r.imagenUrl());
        p.setCategoria(c);
        if(r.activo()!=null) p.setActivo(r.activo());
    }
    @Transactional public void eliminar(Long id) {
        Producto p=productos.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Producto no encontrado"));
        p.setActivo(false);
        productos.save(p);
    }
}
