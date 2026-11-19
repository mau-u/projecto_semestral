package cl.dsy1104.tienda.dto;
import java.math.BigDecimal;
public record ProductoResponse(Long id, String nombre, String descripcion, BigDecimal precio, Integer stock,
String imagenUrl, boolean activo, Long categoriaId, String categoriaNombre) {
}
