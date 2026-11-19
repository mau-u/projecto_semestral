package cl.dsy1104.tienda.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record CategoriaRequest(@NotBlank @Size(max=80) String nombre, @Size(max=300) String descripcion) {
}
