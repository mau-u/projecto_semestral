package cl.dsy1104.tienda.service;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.entity.Usuario;
import cl.dsy1104.tienda.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class UsuarioAdminService {
    private final UsuarioRepository repo;
    private final PasswordEncoder encoder;
    public UsuarioAdminService(UsuarioRepository repo,PasswordEncoder encoder) {
        this.repo=repo;
        this.encoder=encoder;
    }
    public List<UsuarioResponse> listar() {
        return repo.findAll().stream().map(Mapper::usuario).toList();
    }
    @Transactional public UsuarioResponse crear(UsuarioAdminRequest r) {
        if(repo.existsByEmailIgnoreCase(r.email())) throw new IllegalArgumentException("El correo ya está registrado");
        if(r.password()==null||r.password().length()<8) throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        Usuario u=new Usuario();
        u.setNombre(r.nombre());
        u.setEmail(r.email().trim().toLowerCase());
        u.setPassword(encoder.encode(r.password()));
        u.setRol(r.rol());
        u.setActivo(r.activo()==null||r.activo());
        return Mapper.usuario(repo.save(u));
    }
    @Transactional public UsuarioResponse actualizar(Long id,UsuarioAdminRequest r) {
        Usuario u=repo.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Usuario no encontrado"));
        if(repo.existsByEmailIgnoreCaseAndIdNot(r.email(),id)) throw new IllegalArgumentException("El correo ya está registrado");
        u.setNombre(r.nombre());
        u.setEmail(r.email().trim().toLowerCase());
        u.setRol(r.rol());
        if(r.activo()!=null)u.setActivo(r.activo());
        if(r.password()!=null&&!r.password().isBlank())u.setPassword(encoder.encode(r.password()));
        return Mapper.usuario(repo.save(u));
    }
    @Transactional public void eliminar(Long id) {
        Usuario u=repo.findById(id).orElseThrow(()->new RecursoNoEncontradoException("Usuario no encontrado"));
        u.setActivo(false);
        repo.save(u);
    }
}
