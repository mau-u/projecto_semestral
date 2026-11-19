package cl.dsy1104.tienda.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record ProductoRequest(@NotBlank @Size(max=120) String nombre, @Size(max=1000) String descripcion,
@NotNull @DecimalMin("0.01") BigDecimal precio, @NotNull @Min(0) Integer stock,
@Size(max=500) String imagenUrl, @NotNull Long categoriaId, Boolean activo) {
}
