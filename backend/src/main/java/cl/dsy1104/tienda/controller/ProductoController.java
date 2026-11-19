package cl.dsy1104.tienda.controller;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/products")
public class ProductoController {
    private final ProductoService service;
    public ProductoController(ProductoService service) {
        this.service=service;
    }
    @GetMapping public List<ProductoResponse> listar() {
        return service.listarAdmin();
    }
    @GetMapping("/{id}") public ProductoResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public ProductoResponse crear(@Valid @RequestBody ProductoRequest r) {
        return service.crear(r);
    }
    @PutMapping("/{id}") public ProductoResponse actualizar(@PathVariable Long id,@Valid @RequestBody ProductoRequest r) {
        return service.actualizar(id,r);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
