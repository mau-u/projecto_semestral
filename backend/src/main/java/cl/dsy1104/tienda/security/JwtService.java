package cl.dsy1104.tienda.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;
    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalArgumentException("JWT_SECRET debe tener al menos 32 bytes");
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }
    public String generateToken(String email, String role) {
        Date now = new Date();
        return Jwts.builder().subject(email).claim("role", role).issuedAt(now).expiration(new Date(now.getTime()+expirationMs)).signWith(key).compact();
    }
    public String extractUsername(String token) {
        return parse(token).getSubject();
    }
    public boolean isValid(String token, String email) {
        try {
            Claims claims = parse(token);
            return email.equalsIgnoreCase(claims.getSubject()) && claims.getExpiration().after(new Date());
        }
        catch (RuntimeException ex) {
            return false;
        }
    }
    private Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
    public long getExpirationMs() {
        return expirationMs;
    }
}
