package com.example.demo.repository;

import com.example.demo.entity.Asistencias;
import com.example.demo.entity.Empleados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AsistenciasRepository extends JpaRepository<Asistencias, Long> {
    List<Asistencias> findByEmpleado(Empleados empleado);
    
    List<Asistencias> findByEmpleadoAndFechaBetween(Empleados empleado, LocalDate inicio, LocalDate fin);
    
    @Query("SELECT a FROM Asistencias a WHERE a.empleado.id = :empleadoId AND FUNCTION('DATE_FORMAT', a.fecha, '%Y%m') = :periodo")
    List<Asistencias> findByEmpleadoIdAndPeriodo(@Param("empleadoId") Long empleadoId, @Param("periodo") String periodo);
    
    @Query("SELECT a FROM Asistencias a WHERE FUNCTION('DATE_FORMAT', a.fecha, '%Y%m') = :periodo")
    List<Asistencias> findByPeriodo(@Param("periodo") String periodo);
}
