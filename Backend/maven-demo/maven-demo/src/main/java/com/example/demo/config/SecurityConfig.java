package com.example.demo.config;

import com.example.demo.filter.JwtAuthenticationFilter;
import com.example.demo.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @SuppressWarnings("deprecation")
	@Bean
    public PasswordEncoder passwordEncoder() {
        // return new BCryptPasswordEncoder();
    	return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance(); 
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll()
                    .requestMatchers("/api/users", "/api/users/**").hasRole("SUPER_ADMIN")
                    
                    // Módulo Tributario
                    .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/tax/closing/descargar/**").hasRole("ADMIN_TRIBUTARIO")
                    .requestMatchers("/api/tax", "/api/tax/**").hasRole("ADMIN_TRIBUTARIO")
                    
                    // Módulo de Planillas
                    .requestMatchers("/api/empleados", "/api/empleados/**").hasRole("GESTOR_PLANILLA")
                    .requestMatchers("/api/asistencias", "/api/asistencias/**").hasRole("GESTOR_PLANILLA")
                    .requestMatchers("/api/presupuestos", "/api/presupuestos/**").hasRole("GESTOR_PLANILLA")
                    .requestMatchers("/api/planillas", "/api/planillas/**").hasRole("GESTOR_PLANILLA")
                    .requestMatchers("/api/pagos", "/api/pagos/**").hasRole("GESTOR_PLANILLA")
                    .requestMatchers("/api/boletas", "/api/boletas/**").hasRole("GESTOR_PLANILLA")
                    
                    // Módulo de Convocatorias
                    .requestMatchers("/api/convocatorias", "/api/convocatorias/**").hasRole("GESTOR_CONTRATACION")
                    .requestMatchers("/api/candidatos", "/api/candidatos/**").hasRole("GESTOR_CONTRATACION")
                    .requestMatchers("/api/postulaciones", "/api/postulaciones/**").hasRole("GESTOR_CONTRATACION")
                    .requestMatchers("/api/entrevistas", "/api/entrevistas/**").hasRole("GESTOR_CONTRATACION")
                    
                    .requestMatchers("/actuator/**").permitAll()
                    .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}