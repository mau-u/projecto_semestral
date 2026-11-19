package cl.dsy1104.tienda.controller;
import cl.dsy1104.tienda.dto.BoletaResponse;
import cl.dsy1104.tienda.service.BoletaService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/v1/boletas")
public class BoletaController {
    private final BoletaService service;
    public BoletaController(BoletaService service) {
        this.service=service;
    }
    @GetMapping public List<BoletaResponse> listar() {
        return service.listarTodas();
    }
    @GetMapping("/{id}") public BoletaResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }
    @DeleteMapping("/{id}") public BoletaResponse anular(@PathVariable Long id) {
        return service.anular(id);
    }
}
