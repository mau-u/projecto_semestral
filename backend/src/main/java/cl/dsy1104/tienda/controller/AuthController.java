package cl.dsy1104.tienda.controller;
import cl.dsy1104.tienda.dto.*;
import cl.dsy1104.tienda.security.UserDetailsImpl;
import cl.dsy1104.tienda.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService service;
    private final String cookieName;
    private final boolean secure;
    private final long expiration;
    public AuthController(AuthService service,@Value("${app.cookie.name}") String cookieName,@Value("${app.cookie.secure}") boolean secure,@Value("${app.jwt.expiration-ms}") long expiration) {
        this.service=service;
        this.cookieName=cookieName;
        this.secure=secure;
        this.expiration=expiration;
    }
    @PostMapping("/register") public UsuarioResponse registrar(@Valid @RequestBody RegistroRequest request) {
        return service.registrar(request);
    }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody AuthRequest request, HttpServletResponse response) {
        var result=service.login(request);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie(result.token(),Duration.ofMillis(expiration)).toString());
        return new AuthResponse("Autenticación exitosa",result.usuario());
    }
    @GetMapping("/me") public UsuarioResponse me(@AuthenticationPrincipal UserDetailsImpl user) {
        return service.perfil(user.getUsername());
    }
    @PostMapping("/refresh") public AuthResponse refresh(@AuthenticationPrincipal UserDetailsImpl user, HttpServletResponse response) {
        var result=service.renovar(user.getUsername());
        response.addHeader(HttpHeaders.SET_COOKIE,cookie(result.token(),Duration.ofMillis(expiration)).toString());
        return new AuthResponse("Token renovado",result.usuario());
    }
    @PostMapping("/logout") public AuthResponse logout(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE,cookie("",Duration.ZERO).toString());
        return new AuthResponse("Sesión cerrada",null);
    }
    private ResponseCookie cookie(String value,Duration age) {
        return ResponseCookie.from(cookieName,value).httpOnly(true).secure(secure).sameSite("Lax").path("/").maxAge(age).build();
    }
}
