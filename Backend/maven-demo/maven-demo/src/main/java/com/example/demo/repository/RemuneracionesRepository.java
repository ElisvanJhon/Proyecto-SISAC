package com.example.demo.repository;

import com.example.demo.entity.Remuneraciones;
import com.example.demo.entity.Planillas;
import com.example.demo.entity.Empleados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RemuneracionesRepository extends JpaRepository<Remuneraciones, Long> {
    List<Remuneraciones> findByPlanilla(Planillas planilla);
    Optional<Remuneraciones> findByPlanillaAndEmpleado(Planillas planilla, Empleados empleado);
    List<Remuneraciones> findByEmpleado(Empleados empleado);
}
