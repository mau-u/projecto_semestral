package cl.dsy1104.tienda.service;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.entity.*;
import cl.dsy1104.tienda.repository.UsuarioRepository;
import cl.dsy1104.tienda.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class AuthService {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    public AuthService(UsuarioRepository usuarios, PasswordEncoder encoder, AuthenticationManager authManager, JwtService jwtService) {
        this.usuarios=usuarios;
        this.encoder=encoder;
        this.authManager=authManager;
        this.jwtService=jwtService;
    }
    @Transactional public UsuarioResponse registrar(RegistroRequest request) {
        if (usuarios.existsByEmailIgnoreCase(request.email())) throw new IllegalArgumentException("El correo ya está registrado");
        Usuario u=new Usuario();
        u.setNombre(request.nombre().trim());
        u.setEmail(request.email().trim().toLowerCase());
        u.setPassword(encoder.encode(request.password()));
        u.setRol(Rol.CLIENTE);
        u.setActivo(true);
        u.setFechaNacimiento(request.fechaNacimiento());
        return Mapper.usuario(usuarios.save(u));
    }
    @Transactional(readOnly=true) public UsuarioResponse perfil(String email) {
        Usuario u=usuarios.findByEmailIgnoreCase(email).orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        return Mapper.usuario(u);
    }
    public LoginResult login(AuthRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password()));
        Usuario u=usuarios.findByEmailIgnoreCase(request.email()).orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
        return new LoginResult(jwtService.generateToken(u.getEmail(),u.getRol().name()),Mapper.usuario(u));
    }
    public LoginResult renovar(String email) {
        Usuario u=usuarios.findByEmailIgnoreCase(email).orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
        if (!u.isActivo()) throw new IllegalArgumentException("La cuenta está desactivada");
        return new LoginResult(jwtService.generateToken(u.getEmail(),u.getRol().name()),Mapper.usuario(u));
    }
    public record LoginResult(String token, UsuarioResponse usuario) {
    }
}
