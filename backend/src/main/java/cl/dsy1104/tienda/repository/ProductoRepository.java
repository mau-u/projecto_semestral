package cl.dsy1104.tienda.repository;
import cl.dsy1104.tienda.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrueOrderByIdDesc();
    boolean existsByCategoriaId(Long categoriaId);
}
