package cl.dsy1104.tienda.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import jakarta.validation.constraints.PastOrPresent;
public record RegistroRequest(@NotBlank @Size(max=100) String nombre, @Email @NotBlank String email, @NotBlank @Size(min=8, max=72) String password, @PastOrPresent LocalDate fechaNacimiento) {
}
