package cl.dsy1104.tienda.security;
import cl.dsy1104.tienda.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository usuarios;
    public CustomUserDetailsService(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }
    @Override public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return new UserDetailsImpl(usuarios.findByEmailIgnoreCase(email).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado")));
    }
}
