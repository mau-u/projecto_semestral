package cl.dsy1104.tienda.security;
import cl.dsy1104.tienda.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;
public class UserDetailsImpl implements UserDetails {
    private final Usuario usuario;
    public UserDetailsImpl(Usuario usuario) {
        this.usuario = usuario;
    }
    public Long getId() {
        return usuario.getId();
    }
    public String getNombre() {
        return usuario.getNombre();
    }
    public String getRol() {
        return usuario.getRol().name();
    }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()));
    }
    @Override public String getPassword() {
        return usuario.getPassword();
    }
    @Override public String getUsername() {
        return usuario.getEmail();
    }
    @Override public boolean isEnabled() {
        return usuario.isActivo();
    }
    @Override public boolean isAccountNonExpired() {
        return true;
    }
    @Override public boolean isAccountNonLocked() {
        return true;
    }
    @Override public boolean isCredentialsNonExpired() {
        return true;
    }
}
