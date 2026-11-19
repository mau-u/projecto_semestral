package cl.dsy1104.tienda.dto;
import cl.dsy1104.tienda.entity.EstadoBoleta;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
public record BoletaResponse(Long id, String numero, LocalDateTime fecha, BigDecimal total, EstadoBoleta estado,
Long usuarioId, String clienteNombre, String clienteEmail, String telefono, String direccion, String region,
String comuna, String tipoEntrega, String metodoPago, BigDecimal descuentoTotal, String promociones, List<DetalleBoletaResponse> detalles) {
}
