# Sistema de Roles y Seguridad - SISAC ERP

## 📊 Resumen del Sistema de Roles

### **Base de Datos - Roles Configurados**

La base de datos tiene **3 roles principales** definidos:

| ID | Nombre Rol | Descripción | Módulo Asignado |
|----|------------|-------------|-----------------|
| 1 | `ADMIN_TRIBUTARIO` | Administrador de Gestión Tributaria | **Módulo Tributario** |
| 2 | `GESTOR_PLANILLA` | Gestor de Pago de Planilla | **Módulo de Planillas** |
| 3 | `GESTOR_CONTRATACION` | Gestor de Contratación de Personal | **Módulo de Contratación** |

### **Usuarios Configurados**

| ID | Email | Nombre | Apellido | Rol ID | Rol Nombre | Activo |
|----|-------|---------|----------|--------|------------|--------|
| 1 | tributario@sisac.com | Carlos | Tributario | 1 | ADMIN_TRIBUTARIO | ✅ |
| 2 | planilla@sisac.com | María | Planilla | 2 | GESTOR_PLANILLA | ✅ |
| 3 | contratacion@sisac.com | Juan | Contratación | 3 | GESTOR_CONTRATACION | ✅ |

---

## 🔐 Configuración de Seguridad en Backend

### **Archivo:** `SecurityConfig.java`

#### **Autenticación:**
- **JWT (JSON Web Token)** para autenticación stateless
- **BCrypt** para encriptación de contraseñas
- **Session Policy:** STATELESS (sin sesiones en servidor)

#### **Reglas de Autorización por Módulo:**

```java
// Endpoints públicos (sin autenticación)
/api/auth/**          → PERMITIR A TODOS
/api/public/**        → PERMITIR A TODOS

// Módulo Tributario - Solo ADMIN_TRIBUTARIO
/api/tax/**           → hasRole("ADMIN_TRIBUTARIO")

// Módulo de Planillas - Solo GESTOR_PLANILLA
/api/empleados/**     → hasRole("GESTOR_PLANILLA")
/api/asistencias/**   → hasRole("GESTOR_PLANILLA")
/api/presupuestos/**  → hasRole("GESTOR_PLANILLA")
/api/planillas/**     → hasRole("GESTOR_PLANILLA")
/api/pagos/**         → hasRole("GESTOR_PLANILLA")
/api/boletas/**       → hasRole("GESTOR_PLANILLA")

// Módulo de Contratación - Solo GESTOR_CONTRATACION (Comentado)
// /api/convocatorias/**  → hasRole("GESTOR_CONTRATACION")
// /api/postulantes/**    → hasRole("GESTOR_CONTRATACION")
// /api/entrevistas/**    → hasRole("GESTOR_CONTRATACION")
// /api/cvs/**            → hasRole("GESTOR_CONTRATACION")

// Cualquier otro endpoint
anyRequest()          → authenticated()
```

---

## 🔑 Flujo de Autenticación

### **1. Login del Usuario**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "planilla@sisac.com",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 2,
    "email": "planilla@sisac.com",
    "nombre": "María",
    "apellido": "Planilla",
    "role": "GESTOR_PLANILLA"
  }
}
```

### **2. Usar Token en Requests**

Todos los requests posteriores deben incluir el token JWT en el header:

```http
GET /api/planillas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 Matriz de Permisos por Módulo

### **Módulo Tributario** (ID: 1)

| Endpoint | Rol Requerido | Descripción |
|----------|---------------|-------------|
| `POST /api/tax/daily/compras` | ADMIN_TRIBUTARIO | Registrar compras diarias |
| `POST /api/tax/daily/ventas` | ADMIN_TRIBUTARIO | Registrar ventas diarias |
| `POST /api/tax/closing/generar` | ADMIN_TRIBUTARIO | Generar cierre mensual |
| `GET /api/tax/closing/descargar/{id}` | ADMIN_TRIBUTARIO | Descargar XML de declaración |
| `GET /api/tax/config` | ADMIN_TRIBUTARIO | Obtener configuración tributaria |
| `PUT /api/tax/config` | ADMIN_TRIBUTARIO | Actualizar configuración |

**Usuario con acceso:** `tributario@sisac.com`

---

### **Módulo de Planillas** (ID: 2)

| Endpoint | Rol Requerido | Descripción |
|----------|---------------|-------------|
| **Empleados** |
| `GET /api/empleados` | GESTOR_PLANILLA | Listar empleados |
| `POST /api/empleados` | GESTOR_PLANILLA | Crear empleado |
| `PUT /api/empleados/{id}` | GESTOR_PLANILLA | Actualizar empleado |
| `PATCH /api/empleados/{id}/estado` | GESTOR_PLANILLA | Cambiar estado |
| `DELETE /api/empleados/{id}` | GESTOR_PLANILLA | Eliminar empleado |
| **Asistencias** |
| `GET /api/asistencias` | GESTOR_PLANILLA | Listar asistencias |
| `POST /api/asistencias` | GESTOR_PLANILLA | Registrar asistencia |
| `PUT /api/asistencias/{id}` | GESTOR_PLANILLA | Actualizar asistencia |
| `GET /api/asistencias/resumen` | GESTOR_PLANILLA | Obtener resumen de horas |
| **Presupuestos** |
| `GET /api/presupuestos` | GESTOR_PLANILLA | Listar presupuestos |
| `POST /api/presupuestos` | GESTOR_PLANILLA | Crear presupuesto |
| `PUT /api/presupuestos/{id}` | GESTOR_PLANILLA | Actualizar presupuesto |
| **Planillas** |
| `GET /api/planillas` | GESTOR_PLANILLA | Listar planillas |
| `POST /api/planillas` | GESTOR_PLANILLA | Crear planilla |
| `POST /api/planillas/{id}/calcular` | GESTOR_PLANILLA | Calcular remuneraciones |
| `PUT /api/planillas/{id}/aprobar` | GESTOR_PLANILLA | Aprobar planilla |
| `PUT /api/planillas/{id}/vincular-pago` | GESTOR_PLANILLA | Vincular pago |
| **Pagos** |
| `GET /api/pagos` | GESTOR_PLANILLA | Listar pagos |
| `POST /api/pagos` | GESTOR_PLANILLA | Crear pago |
| `PUT /api/pagos/{id}/completar` | GESTOR_PLANILLA | Completar pago |
| **Boletas** |
| `GET /api/boletas` | GESTOR_PLANILLA | Listar boletas |
| `POST /api/boletas/generar/{planillaId}` | GESTOR_PLANILLA | Generar boletas |
| `GET /api/boletas/{id}` | GESTOR_PLANILLA | Ver detalle de boleta |

**Usuario con acceso:** `planilla@sisac.com`

---

### **Módulo de Contratación** (ID: 3)

| Endpoint | Rol Requerido | Estado | Descripción |
|----------|---------------|--------|-------------|
| `/api/convocatorias/**` | GESTOR_CONTRATACION | 🔴 Pendiente | Gestión de convocatorias |
| `/api/postulantes/**` | GESTOR_CONTRATACION | 🔴 Pendiente | Gestión de postulantes |
| `/api/entrevistas/**` | GESTOR_CONTRATACION | 🔴 Pendiente | Programación de entrevistas |
| `/api/cvs/**` | GESTOR_CONTRATACION | 🔴 Pendiente | Gestión de CVs |

**Usuario con acceso:** `contratacion@sisac.com`

**Nota:** Este módulo aún no está implementado en el backend.

---

## 🛡️ Implementación Técnica

### **Estructura de Clases**

#### **1. Entidades**

**`Role.java`**
```java
@Entity
@Table(name = "roles")
public class Role {
    private Long id;
    private String nombre;          // ADMIN_TRIBUTARIO, GESTOR_PLANILLA, etc.
    private String descripcion;
    private LocalDateTime createdAt;
}
```

**`UsuarioAdmin.java`**
```java
@Entity
@Table(name = "usuarios_admin")
public class UsuarioAdmin {
    private Long id;
    private String email;
    private String passwordHash;    // Encriptado con BCrypt
    private String nombre;
    private String apellido;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;              // Relación con Role
    
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### **2. Servicio de Autenticación**

**`UserDetailsServiceImpl.java`**
```java
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Override
    public UserDetails loadUserByUsername(String email) {
        UsuarioAdmin usuario = usuarioAdminRepository
            .findByEmailAndActivoTrue(email)
            .orElseThrow(() -> new UsernameNotFoundException(...));
        
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRole().getNombre()));
        
        return new User(
            usuario.getEmail(),
            usuario.getPasswordHash(),
            usuario.getActivo(),
            true, true, true,
            authorities
        );
    }
}
```

**Nota importante:** Spring Security automáticamente agrega el prefijo `ROLE_` a los roles, por eso:
- Base de datos: `ADMIN_TRIBUTARIO`
- Spring Security: `ROLE_ADMIN_TRIBUTARIO`
- Configuración: `hasRole("ADMIN_TRIBUTARIO")` (sin prefijo)

#### **3. Filtro JWT**

**`JwtAuthenticationFilter.java`**
- Intercepta todas las peticiones
- Extrae el token JWT del header `Authorization: Bearer <token>`
- Valida el token
- Carga los datos del usuario y sus roles
- Establece la autenticación en el SecurityContext

---

## 🧪 Pruebas de Seguridad

### **Escenario 1: Usuario GESTOR_PLANILLA intenta acceder a Tributario**

```bash
# Login como gestor de planilla
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"planilla@sisac.com","password":"password123"}'

# Respuesta: token JWT

# Intentar acceder a módulo tributario (DEBE FALLAR)
curl -X GET http://localhost:8081/api/tax/config \
  -H "Authorization: Bearer <token_de_planilla>"

# Respuesta esperada: 403 Forbidden
```

### **Escenario 2: Usuario GESTOR_PLANILLA accede a su módulo**

```bash
# Acceder a módulo de planillas (DEBE FUNCIONAR)
curl -X GET http://localhost:8081/api/empleados \
  -H "Authorization: Bearer <token_de_planilla>"

# Respuesta esperada: 200 OK con lista de empleados
```

### **Escenario 3: Sin autenticación**

```bash
# Intentar acceder sin token (DEBE FALLAR)
curl -X GET http://localhost:8081/api/planillas

# Respuesta esperada: 401 Unauthorized
```

---

## 🔧 Configuración CORS

**Origen permitido:** `http://localhost:5173` (Frontend React/Vite)

**Métodos permitidos:** GET, POST, PUT, DELETE, OPTIONS

**Credentials:** Permitidas

---

## 📝 Recomendaciones de Seguridad

### **Para Producción:**

1. **Cambiar contraseñas por defecto** de los 3 usuarios administradores
2. **Configurar tiempo de expiración del JWT** (actualmente en configuración)
3. **Usar HTTPS** en lugar de HTTP
4. **Configurar CORS** para dominios específicos (no `*`)
5. **Implementar rate limiting** para prevenir ataques de fuerza bruta
6. **Agregar logs de auditoría** para accesos y cambios importantes
7. **Implementar 2FA** (autenticación de dos factores) para usuarios admin
8. **Encriptar datos sensibles** en la base de datos
9. **Implementar política de contraseñas** (complejidad, expiración)
10. **Configurar backup automático** de la base de datos

### **Agregar más roles (si es necesario):**

```sql
INSERT INTO roles (nombre, descripcion, createdAt) VALUES 
('SUPER_ADMIN', 'Administrador con acceso total al sistema', NOW()),
('AUDITOR', 'Rol con permisos de solo lectura para auditoría', NOW()),
('CONTADOR', 'Acceso a reportes contables y tributarios', NOW());
```

---

## 📊 Diagrama de Relaciones

```
┌─────────────────┐
│ usuarios_admin  │
├─────────────────┤
│ id              │
│ email           │
│ password_hash   │
│ nombre          │
│ apellido        │
│ rol_id ────────┐│
│ activo          ││
└─────────────────┘│
                   │
                   │ FK
                   │
                   ▼
            ┌─────────────┐
            │    roles    │
            ├─────────────┤
            │ id          │
            │ nombre      │
            │ descripcion │
            └─────────────┘
```

---

## ✅ Estado Actual del Sistema

| Componente | Estado | Notas |
|------------|--------|-------|
| Base de datos - Tablas | ✅ Completo | roles, usuarios_admin |
| Datos iniciales | ✅ Completo | 3 roles, 3 usuarios |
| Entidades JPA | ✅ Completo | Role, UsuarioAdmin |
| Autenticación JWT | ✅ Completo | Login funcional |
| SecurityConfig | ✅ Completo | Reglas por rol |
| Módulo Tributario | ✅ Protegido | Solo ADMIN_TRIBUTARIO |
| Módulo Planillas | ✅ Protegido | Solo GESTOR_PLANILLA |
| Módulo Contratación | 🔴 Pendiente | Backend no implementado |
| CORS | ✅ Configurado | localhost:5173 |
| Password Encryption | ✅ BCrypt | Seguro |

---

## 🎓 Conclusión

El sistema de roles y seguridad está **completamente implementado y funcional** para los módulos de Tributación y Planillas. Cada usuario solo puede acceder a los endpoints de su módulo asignado, garantizando la separación de responsabilidades y la seguridad del sistema.

**Los 3 usuarios creados pueden autenticarse y acceder únicamente a sus respectivos módulos según la matriz de permisos definida.**
