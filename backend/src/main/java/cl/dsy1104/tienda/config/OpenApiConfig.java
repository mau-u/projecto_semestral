package cl.dsy1104.tienda.config;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI tiendaOpenApi() {
        return new OpenAPI()
        .info(new Info()
        .title("Tienda Online - API REST")
        .version("1.0.0")
        .description("API REST versionada para catálogo, usuarios, categorías, boletas y autenticación JWT. El token también se entrega en cookie HttpOnly al iniciar sesión."))
        .components(new Components()
        .addSecuritySchemes("bearerAuth",
        new SecurityScheme()
        .type(SecurityScheme.Type.HTTP)
        .scheme("bearer")
        .bearerFormat("JWT"))
        .addSecuritySchemes("cookieAuth",
        new SecurityScheme()
        .type(SecurityScheme.Type.APIKEY)
        .in(SecurityScheme.In.COOKIE)
        .name("TIENDA_ACCESS")))
        .addSecurityItem(new SecurityRequirement().addList("cookieAuth"));
    }
}
