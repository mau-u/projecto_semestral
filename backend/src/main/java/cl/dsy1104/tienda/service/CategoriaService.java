package cl.dsy1104.tienda.service;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.entity.Categoria;
import cl.dsy1104.tienda.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class CategoriaService {
    private final CategoriaRepository repo;
    private final cl.dsy1104.tienda.repository.ProductoRepository productos;
    public CategoriaService(CategoriaRepository repo, cl.dsy1104.tienda.repository.ProductoRepository productos) {
        this.repo=repo;
        this.productos=productos;
    }
    public List<CategoriaResponse> listar() {
        return repo.findAll().stream().map(Mapper::categoria).toList();
    }
    @Transactional public CategoriaResponse crear(CategoriaRequest r) {
        if(repo.existsByNombreIgnoreCase(r.nombre())) throw new IllegalArgumentException("La categoría ya existe");
        Categoria c=new Categoria();
        c.setNombre(r.nombre().trim());
        c.setDescripcion(r.descripcion());
        return Mapper.categoria(repo.save(c));
    }
    @Transactional public CategoriaResponse actualizar(Long id,CategoriaRequest r) {
        Categoria c=repo.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Categoría no encontrada"));
        if(repo.existsByNombreIgnoreCaseAndIdNot(r.nombre(),id)) throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        c.setNombre(r.nombre().trim());
        c.setDescripcion(r.descripcion());
        return Mapper.categoria(repo.save(c));
    }
    @Transactional public void eliminar(Long id) {
        if(!repo.existsById(id)) throw new RecursoNoEncontradoException("Categoría no encontrada");
        if(productos.existsByCategoriaId(id)) throw new IllegalArgumentException("No se puede eliminar una categoría que tiene productos asociados");
        repo.deleteById(id);
    }
}
