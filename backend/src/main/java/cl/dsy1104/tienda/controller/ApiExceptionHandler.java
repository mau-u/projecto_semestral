package cl.dsy1104.tienda.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;
@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(cl.dsy1104.tienda.service.RecursoNoEncontradoException.class) public ResponseEntity<?> notFound(cl.dsy1104.tienda.service.RecursoNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body(404,ex.getMessage()));
    }
    @ExceptionHandler(IllegalArgumentException.class) public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(body(400,ex.getMessage()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<?> validation(MethodArgumentNotValidException ex) {
        String msg=ex.getBindingResult().getFieldErrors().stream().map(e->e.getField()+": "+e.getDefaultMessage()).collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(body(400,msg));
    }
    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class) public ResponseEntity<?> unreadable(Exception ex) {
        return ResponseEntity.badRequest().body(body(400,"El cuerpo JSON no tiene el formato esperado"));
    }
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class) public ResponseEntity<?> credentials(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body(401,"Correo o contraseña incorrectos"));
    }
    @ExceptionHandler(Exception.class) public ResponseEntity<?> generic(Exception ex) {
        return ResponseEntity.status(500).body(body(500,"Error interno del servidor"));
    }
    private Map<String,Object> body(int status,String message) {
        return Map.of("timestamp",LocalDateTime.now().toString(),"status",status,"message",message);
    }
}
