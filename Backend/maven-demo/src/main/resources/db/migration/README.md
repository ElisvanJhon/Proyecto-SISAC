# Flyway Database Migrations

Esta carpeta contiene las migraciones de base de datos gestionadas por **Flyway**.

## 📋 ¿Qué es Flyway?

Flyway es una herramienta de versionamiento de esquemas de base de datos que:
- ✅ Ejecuta scripts SQL automáticamente al iniciar la aplicación
- ✅ Mantiene un historial de cambios en la tabla `flyway_schema_history`
- ✅ Garantiza que todos los developers tengan el mismo esquema
- ✅ Facilita el despliegue en producción

## 📁 Estructura de archivos

Los archivos de migración deben seguir esta convención de nombres:

```
V{VERSION}__{DESCRIPCION}.sql
```

**Ejemplos:**
- `V1__create_initial_schema.sql` ← Esquema inicial
- `V2__add_telefono_to_usuarios.sql`
- `V3__create_index_on_ruc.sql`

## 🔢 Reglas de versionamiento

1. **La versión debe ser incremental**: V1, V2, V3...
2. **NUNCA modificar un script ya ejecutado**: Flyway registra el checksum, si cambias un script ejecutado, fallará
3. **Usar doble guión bajo `__`** entre la versión y la descripción
4. **Descripción clara y descriptiva** en snake_case

## 🚀 ¿Cómo agregar una migración?

### Ejemplo: Agregar campo `telefono` a la tabla `usuarios_admin`

**1. Crear archivo:** `V2__add_telefono_to_usuarios_admin.sql`

```sql
-- Agregar campo telefono a usuarios administrativos
ALTER TABLE usuarios_admin 
ADD COLUMN telefono VARCHAR(20);
```

**2. Actualizar la Entity Java:**

```java
@Entity
@Table(name = "usuarios_admin")
public class UsuarioAdmin {
    // ... campos existentes
    
    private String telefono; // Nuevo campo
    
    // getters y setters
}
```

**3. Iniciar la aplicación:**

```bash
.\mvnw.cmd spring-boot:run
```

Flyway detectará automáticamente `V2__...` y lo ejecutará en MySQL.

## 📊 Tabla de historial

Flyway crea automáticamente la tabla `flyway_schema_history` en MySQL:

```sql
SELECT * FROM flyway_schema_history;
```

**Columnas importantes:**
- `version`: Número de versión (V1, V2, V3...)
- `description`: Descripción del cambio
- `script`: Nombre del archivo ejecutado
- `checksum`: Hash del contenido (detecta cambios)
- `installed_on`: Fecha/hora de ejecución
- `success`: TRUE si se ejecutó correctamente

## ⚠️ Errores comunes

### Error: "Validate failed: Checksum mismatch"
**Causa:** Modificaste un script SQL que ya fue ejecutado.
**Solución:** 
1. NUNCA modificar scripts ejecutados
2. Crear una nueva migración `V{N+1}__fix_...sql` para corregir

### Error: "Found non-empty schema(s)"
**Causa:** La base de datos ya tiene tablas antes de Flyway.
**Solución:** Configurar `spring.flyway.baseline-on-migrate=true` (ya configurado)

## 🔧 Configuración actual

En `application.properties`:

```properties
# Flyway habilitado
spring.flyway.enabled=true

# Permitir baseline en bases existentes
spring.flyway.baseline-on-migrate=true

# Ubicación de scripts
spring.flyway.locations=classpath:db/migration

# Validar al iniciar
spring.flyway.validate-on-migrate=true
```

## 📚 Migraciones actuales

| Versión | Archivo | Descripción |
|---------|---------|-------------|
| V1 | `V1__create_initial_schema.sql` | Esquema completo: 28 tablas + datos iniciales |

## 🎯 Buenas prácticas

✅ **DO:**
- Crear migraciones pequeñas e incrementales
- Usar nombres descriptivos
- Probar en desarrollo antes de producción
- Hacer backup antes de ejecutar migraciones en producción
- Versionar los scripts en Git

❌ **DON'T:**
- Modificar scripts ya ejecutados
- Usar DROP TABLE sin backup
- Ejecutar migraciones manualmente en producción
- Saltarse versiones (V1 → V3, falta V2)

## 🔄 Flujo de trabajo en equipo

1. **Developer A** crea `V5__add_new_table.sql`
2. Hace commit y push a Git
3. **Developer B** hace `git pull`
4. Al iniciar su aplicación, Flyway ejecuta automáticamente V5
5. Ambos tienen el mismo esquema

## 📖 Documentación oficial

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [SQL-based migrations](https://flywaydb.org/documentation/concepts/migrations#sql-based-migrations)
