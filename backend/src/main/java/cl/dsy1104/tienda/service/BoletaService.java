package cl.dsy1104.tienda.service;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.entity.*;
import cl.dsy1104.tienda.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
@Service
public class BoletaService {
    private final BoletaRepository boletas;
    private final ProductoRepository productos;
    private final UsuarioRepository usuarios;
    public BoletaService(BoletaRepository boletas,ProductoRepository productos,UsuarioRepository usuarios) {
        this.boletas=boletas;
        this.productos=productos;
        this.usuarios=usuarios;
    }
    @Transactional(readOnly=true) public List<BoletaResponse> listarTodas() {
        return boletas.findAllByOrderByFechaDesc().stream().map(Mapper::boleta).toList();
    }
    @Transactional(readOnly=true) public List<BoletaResponse> listarDelCliente(Long usuarioId) {
        return boletas.findByUsuarioIdOrderByFechaDesc(usuarioId).stream().map(Mapper::boleta).toList();
    }
    @Transactional(readOnly=true) public BoletaResponse obtener(Long id) {
        return Mapper.boleta(boletas.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Boleta no encontrada")));
    }
    @Transactional public BoletaResponse comprar(Long usuarioId, CheckoutRequest request) {
        Usuario cliente=usuarios.findById(usuarioId).orElseThrow(()->new RecursoNoEncontradoException("Usuario no encontrado"));
        Boleta b=new Boleta();
        LocalDateTime now=LocalDateTime.now();
        b.setFecha(now);
        b.setNumero("BOL-"+now.format(DateTimeFormatter.ofPattern("yyyyMMdd"))+"-"+UUID.randomUUID().toString().substring(0,8).toUpperCase());
        b.setUsuario(cliente);
        b.setEstado(EstadoBoleta.EMITIDA);
        if (!request.tipoEntrega().equals("despacho") && !request.tipoEntrega().equals("retiro"))
            throw new IllegalArgumentException("El tipo de entrega no es válido");
        b.setTelefono(request.telefono().trim());
        b.setDireccion(request.direccion().trim());
        b.setRegion(request.region().trim());
        b.setComuna(request.comuna().trim());
        b.setTipoEntrega(request.tipoEntrega());
        b.setMetodoPago(request.metodoPago());
        BigDecimal total=BigDecimal.ZERO;
        BigDecimal cheapestCake=null;
        for(CheckoutLineRequest line:request.items()) {
            Producto p=productos.findById(line.productoId()).orElseThrow(()->new IllegalArgumentException("Producto no encontrado: "+line.productoId()));
            if(!p.isActivo()) throw new IllegalArgumentException("El producto "+p.getNombre()+" no está disponible");
            if(p.getStock()<line.cantidad()) throw new IllegalArgumentException("Stock insuficiente para "+p.getNombre()+". Disponible: "+p.getStock());
            BigDecimal subtotal=p.getPrecio().multiply(BigDecimal.valueOf(line.cantidad()));
            if (p.getNombre().toLowerCase().contains("torta") && (cheapestCake==null || p.getPrecio().compareTo(cheapestCake)<0)) cheapestCake=p.getPrecio();
            DetalleBoleta d=new DetalleBoleta();
            d.setProducto(p);
            d.setCantidad(line.cantidad());
            d.setPrecioUnitario(p.getPrecio());
            d.setSubtotal(subtotal);
            b.addDetalle(d);
            p.setStock(p.getStock()-line.cantidad());
            total=total.add(subtotal);
        }
        BigDecimal remaining=total;
        BigDecimal discounts=BigDecimal.ZERO;
        StringBuilder promotions=new StringBuilder();
        LocalDate birth=cliente.getFechaNacimiento();
        if (birth!=null && Period.between(birth,now.toLocalDate()).getYears()>50) {
            BigDecimal amount=remaining.multiply(new BigDecimal("0.50")).setScale(0,java.math.RoundingMode.HALF_UP).min(remaining);
            remaining=remaining.subtract(amount); discounts=discounts.add(amount); promotions.append("MAYOR50");
        }
        String promo=request.promoCode()==null?"":request.promoCode().trim().toUpperCase();
        if (!promo.isEmpty() && !promo.equals("FELICES50")) throw new IllegalArgumentException("El código promocional no es válido");
        if (promo.equals("FELICES50") && remaining.signum()>0) {
            BigDecimal amount=remaining.multiply(new BigDecimal("0.10")).setScale(0,java.math.RoundingMode.HALF_UP).min(remaining);
            remaining=remaining.subtract(amount); discounts=discounts.add(amount);
            if (promotions.length()>0) promotions.append(","); promotions.append("FELICES50");
        }
        boolean birthday=birth!=null && birth.getMonthValue()==now.getMonthValue() && birth.getDayOfMonth()==now.getDayOfMonth() && cliente.getEmail().toLowerCase().endsWith("@duoc.cl");
        if (birthday && cheapestCake!=null && remaining.signum()>0) {
            BigDecimal amount=cheapestCake.min(remaining);
            remaining=remaining.subtract(amount); discounts=discounts.add(amount);
            if (promotions.length()>0) promotions.append(","); promotions.append("CUMPLEDUOC");
        }
        b.setDescuentoTotal(discounts);
        b.setPromociones(promotions.length()==0?null:promotions.toString());
        if (request.tipoEntrega().equals("despacho")) remaining=remaining.add(BigDecimal.valueOf(2990));
        b.setTotal(remaining);
        return Mapper.boleta(boletas.save(b));
    }
    @Transactional public BoletaResponse anular(Long id) {
        Boleta b=boletas.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Boleta no encontrada"));
        if(b.getEstado()==EstadoBoleta.ANULADA) return Mapper.boleta(b);
        b.setEstado(EstadoBoleta.ANULADA);
        for(DetalleBoleta d:b.getDetalles()) d.getProducto().setStock(d.getProducto().getStock()+d.getCantidad());
        return Mapper.boleta(boletas.save(b));
    }
}
