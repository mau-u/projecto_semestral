package cl.dsy1104.tienda.service;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.entity.*;
import java.util.List;
public final class Mapper {
    private Mapper() {
    }
    public static UsuarioResponse usuario(Usuario u) {
        return new UsuarioResponse(u.getId(),u.getNombre(),u.getEmail(),u.getRol(),u.isActivo(),u.getFechaNacimiento());
    }
    public static CategoriaResponse categoria(Categoria c) {
        return new CategoriaResponse(c.getId(),c.getNombre(),c.getDescripcion());
    }
    public static ProductoResponse producto(Producto p) {
        return new ProductoResponse(p.getId(),p.getNombre(),p.getDescripcion(),p.getPrecio(),p.getStock(),p.getImagenUrl(),p.isActivo(),p.getCategoria().getId(),p.getCategoria().getNombre());
    }
    public static BoletaResponse boleta(Boleta b) {
        List<DetalleBoletaResponse> details=b.getDetalles().stream().map(d -> new DetalleBoletaResponse(d.getId(),d.getProducto().getId(),d.getProducto().getNombre(),d.getCantidad(),d.getPrecioUnitario(),d.getSubtotal())).toList();
        return new BoletaResponse(b.getId(),b.getNumero(),b.getFecha(),b.getTotal(),b.getEstado(),b.getUsuario().getId(),b.getUsuario().getNombre(),b.getUsuario().getEmail(),b.getTelefono(),b.getDireccion(),b.getRegion(),b.getComuna(),b.getTipoEntrega(),b.getMetodoPago(),b.getDescuentoTotal(),b.getPromociones(),details);
    }
}
