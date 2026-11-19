package cl.dsy1104.tienda.dto;
import cl.dsy1104.tienda.entity.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
public record UsuarioAdminRequest(@NotBlank @Size(max=100) String nombre, @Email @NotBlank String email,
@Size(min=8, max=72) String password, @NotNull Rol rol, Boolean activo) {
}
