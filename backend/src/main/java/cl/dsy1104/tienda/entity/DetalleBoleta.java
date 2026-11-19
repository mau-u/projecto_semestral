package cl.dsy1104.tienda.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity
@Table(name = "detalle_boleta")
public class DetalleBoleta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "boleta_id", nullable = false) private Boleta boleta;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "producto_id", nullable = false) private Producto producto;
    @Column(nullable = false) private Integer cantidad;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal precioUnitario;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal subtotal;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Boleta getBoleta() {
        return boleta;
    }
    public void setBoleta(Boleta boleta) {
        this.boleta = boleta;
    }
    public Producto getProducto() {
        return producto;
    }
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
    public Integer getCantidad() {
        return cantidad;
    }
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }
    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
