package cl.dsy1104.tienda.controller;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.repository.CategoriaRepository;
import cl.dsy1104.tienda.service.*;
import cl.dsy1104.tienda.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController @RequestMapping("/api/v1/store")
public class TiendaController {
    private final ProductoService productos;
    private final CategoriaRepository categorias;
    private final BoletaService boletas;
    public TiendaController(ProductoService productos,CategoriaRepository categorias,BoletaService boletas) {
        this.productos=productos;
        this.categorias=categorias;
        this.boletas=boletas;
    }
    @GetMapping("/products") public List<ProductoResponse> productos() {
        return productos.listarTienda();
    }
    @GetMapping("/categories") public List<CategoriaResponse> categorias() {
        return categorias.findAll().stream().map(Mapper::categoria).toList();
    }
    @PostMapping("/checkout") @org.springframework.web.bind.annotation.ResponseStatus(HttpStatus.CREATED)
    public BoletaResponse checkout(@AuthenticationPrincipal UserDetailsImpl user,@Valid @RequestBody CheckoutRequest request) {
        return boletas.comprar(user.getId(),request);
    }
    @GetMapping("/orders") public List<BoletaResponse> misCompras(@AuthenticationPrincipal UserDetailsImpl user) {
        return boletas.listarDelCliente(user.getId());
    }
}
