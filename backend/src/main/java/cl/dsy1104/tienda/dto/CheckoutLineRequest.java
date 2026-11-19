package cl.dsy1104.tienda.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
public record CheckoutLineRequest(@NotNull Long productoId, @NotNull @Min(1) Integer cantidad) {
}
