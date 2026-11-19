package cl.dsy1104.tienda.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
public record CheckoutRequest(@NotEmpty List<@Valid CheckoutLineRequest> items,
@NotBlank @Size(max=30) String telefono, @NotBlank @Size(max=180) String direccion,
@NotBlank @Size(max=80) String region, @NotBlank @Size(max=80) String comuna,
@NotBlank @Size(max=20) String tipoEntrega, @NotBlank @Size(max=30) String metodoPago,
@Size(max=20) String promoCode) {
}
