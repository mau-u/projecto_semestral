package cl.dsy1104.tienda;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import jakarta.servlet.http.Cookie;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class AutenticacionIntegrationTest {
    @Autowired MockMvc mvc;
    @Test void registroCreaUnClienteSinPermitirElegirRol() throws Exception {
        mvc.perform(post("/api/v1/auth/register").contentType(MediaType.APPLICATION_JSON)
        .content("{\"nombre\":\"Cliente Prueba\",\"email\":\"cliente@prueba.cl\",\"password\":\"Cliente123!\"}"))
        .andExpect(status().isOk()).andExpect(jsonPath("$.rol").value("CLIENTE"));
    }
    @Test void loginEntregaCookieHttpOnly() throws Exception {
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"admin@test.local\",\"password\":\"Admin123!\"}"))
        .andExpect(status().isOk()).andExpect(header().string("Set-Cookie",org.hamcrest.Matchers.containsString("HttpOnly")))
        .andExpect(jsonPath("$.usuario.rol").value("ADMIN"));
    }
    @Test void refreshRenuevaCookieHttpOnly() throws Exception {
        MvcResult login=mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"admin@test.local\",\"password\":\"Admin123!\"}"))
        .andExpect(status().isOk()).andReturn();
        Cookie cookie=login.getResponse().getCookie("TIENDA_ACCESS");
        mvc.perform(post("/api/v1/auth/refresh").cookie(cookie))
        .andExpect(status().isOk()).andExpect(header().string("Set-Cookie",org.hamcrest.Matchers.containsString("HttpOnly")))
        .andExpect(jsonPath("$.mensaje").value("Token renovado"));
    }
    @Test void rutaProtegidaSinSesionDevuelve401() throws Exception {
        mvc.perform(get("/api/v1/users")).andExpect(status().isUnauthorized());
    }
    @Test @WithMockUser(roles="CLIENTE") void clienteNoPuedeListarUsuarios() throws Exception {
        mvc.perform(get("/api/v1/users")).andExpect(status().isForbidden());
    }
    @Test @WithMockUser(roles="VENDEDOR") void vendedorPuedeConsultarProductos() throws Exception {
        mvc.perform(get("/api/v1/products")).andExpect(status().isOk());
    }
    @Test @WithMockUser(roles="VENDEDOR") void vendedorPuedeConsultarBoletas() throws Exception {
        mvc.perform(get("/api/v1/boletas")).andExpect(status().isOk());
    }
    @Test @WithMockUser(roles="VENDEDOR") void vendedorNoPuedeRealizarCompras() throws Exception {
        mvc.perform(post("/api/v1/store/checkout").contentType(MediaType.APPLICATION_JSON)
        .content("{}"))
        .andExpect(status().isForbidden());
    }
    @Test @WithMockUser(roles="VENDEDOR") void vendedorNoPuedeAnularBoletas() throws Exception {
        mvc.perform(delete("/api/v1/boletas/1")).andExpect(status().isForbidden());
    }
}
