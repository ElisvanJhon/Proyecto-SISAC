package com.example.demo.repository;

import com.example.demo.entity.BoletasPago;
import com.example.demo.entity.Empleados;
import com.example.demo.entity.Pagos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoletasPagoRepository extends JpaRepository<BoletasPago, Long> {
    List<BoletasPago> findByPago(Pagos pago);
    List<BoletasPago> findByEmpleado(Empleados empleado);
    Optional<BoletasPago> findByEmpleadoAndPeriodo(Empleados empleado, String periodo);
}
