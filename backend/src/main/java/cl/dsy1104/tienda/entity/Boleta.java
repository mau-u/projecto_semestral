package cl.dsy1104.tienda.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "boleta", uniqueConstraints = @UniqueConstraint(columnNames = "numero"))
public class Boleta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 30) private String numero;
    @Column(nullable = false) private LocalDateTime fecha;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal total;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private EstadoBoleta estado = EstadoBoleta.EMITIDA;
    @Column(length = 30) private String telefono;
    @Column(length = 180) private String direccion;
    @Column(length = 80) private String region;
    @Column(length = 80) private String comuna;
    @Column(length = 20) private String tipoEntrega;
    @Column(length = 30) private String metodoPago;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal descuentoTotal = BigDecimal.ZERO;
    @Column(length = 100) private String promociones;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "usuario_id", nullable = false) private Usuario usuario;
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true) private List<DetalleBoleta> detalles = new ArrayList<>();
    public void addDetalle(DetalleBoleta detalle) {
        detalles.add(detalle);
        detalle.setBoleta(this);
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
    public LocalDateTime getFecha() {
        return fecha;
    }
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
    public BigDecimal getTotal() {
        return total;
    }
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    public EstadoBoleta getEstado() {
        return estado;
    }
    public void setEstado(EstadoBoleta estado) {
        this.estado = estado;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public List<DetalleBoleta> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<DetalleBoleta> detalles) {
        this.detalles = detalles;
    }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public String getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(String tipoEntrega) { this.tipoEntrega = tipoEntrega; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public BigDecimal getDescuentoTotal() { return descuentoTotal; }
    public void setDescuentoTotal(BigDecimal descuentoTotal) { this.descuentoTotal = descuentoTotal; }
    public String getPromociones() { return promociones; }
    public void setPromociones(String promociones) { this.promociones = promociones; }
}
