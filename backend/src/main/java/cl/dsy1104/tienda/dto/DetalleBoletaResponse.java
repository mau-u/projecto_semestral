package cl.dsy1104.tienda.dto;
import java.math.BigDecimal;
public record DetalleBoletaResponse(Long id, Long productoId, String productoNombre, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
}
