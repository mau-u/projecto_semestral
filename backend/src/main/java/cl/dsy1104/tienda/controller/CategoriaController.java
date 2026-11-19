package cl.dsy1104.tienda.controller;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/categories")
public class CategoriaController {
    private final CategoriaService service;
    public CategoriaController(CategoriaService service) {
        this.service=service;
    }
    @GetMapping public List<CategoriaResponse> listar() {
        return service.listar();
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public CategoriaResponse crear(@Valid @RequestBody CategoriaRequest r) {
        return service.crear(r);
    }
    @PutMapping("/{id}") public CategoriaResponse actualizar(@PathVariable Long id,@Valid @RequestBody CategoriaRequest r) {
        return service.actualizar(id,r);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
