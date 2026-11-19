package cl.dsy1104.tienda.controller;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.service.UsuarioAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/users")
public class UsuarioController {
    private final UsuarioAdminService service;
    public UsuarioController(UsuarioAdminService service) {
        this.service=service;
    }
    @GetMapping public List<UsuarioResponse> listar() {
        return service.listar();
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public UsuarioResponse crear(@Valid @RequestBody UsuarioAdminRequest r) {
        return service.crear(r);
    }
    @PutMapping("/{id}") public UsuarioResponse actualizar(@PathVariable Long id,@Valid @RequestBody UsuarioAdminRequest r) {
        return service.actualizar(id,r);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
