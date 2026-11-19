package cl.dsy1104.tienda.config;
import cl.dsy1104.tienda.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
@Configuration @EnableWebSecurity
public class SecurityConfig {
    @Bean FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
    @Bean PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    @Bean CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origin}") String origin) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(origin));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization","Content-Type","Accept"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    @Bean SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http.cors(cors -> {
        }
        ).csrf(csrf -> csrf.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(ex -> ex
        .authenticationEntryPoint((request, response, exception) -> response.sendError(401))
        .accessDeniedHandler((request, response, exception) -> response.sendError(403)))
        .authorizeHttpRequests(auth -> auth
        .requestMatchers("/swagger-ui.html","/swagger-ui/**","/v3/api-docs/**").permitAll()
        .requestMatchers(HttpMethod.POST,"/api/v1/auth/register","/api/v1/auth/login").permitAll()
        .requestMatchers("/api/v1/auth/**").authenticated()
        .requestMatchers("/api/v1/store/products/**","/api/v1/store/categories/**").permitAll()
        .requestMatchers(HttpMethod.POST,"/api/v1/store/checkout").hasRole("CLIENTE")
        .requestMatchers("/api/v1/store/orders/**").hasRole("CLIENTE")
        .requestMatchers(HttpMethod.GET,"/api/v1/products/**").hasAnyRole("ADMIN","VENDEDOR")
        .requestMatchers(HttpMethod.POST,"/api/v1/products/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT,"/api/v1/products/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE,"/api/v1/products/**").hasRole("ADMIN")
        .requestMatchers("/api/v1/categories/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE,"/api/v1/boletas/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.GET,"/api/v1/boletas/**").hasAnyRole("ADMIN","VENDEDOR")
        .requestMatchers("/api/v1/users/**").hasRole("ADMIN")
        .anyRequest().authenticated())
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
