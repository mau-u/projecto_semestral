package cl.dsy1104.tienda.dto;
import cl.dsy1104.tienda.entity.Rol;
import java.time.LocalDate;
public record UsuarioResponse(Long id, String nombre, String email, Rol rol, boolean activo, LocalDate fechaNacimiento) {
}
