package cl.dsy1104.tienda.repository;
import cl.dsy1104.tienda.entity.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    List<Boleta> findAllByOrderByFechaDesc();
    List<Boleta> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
}
