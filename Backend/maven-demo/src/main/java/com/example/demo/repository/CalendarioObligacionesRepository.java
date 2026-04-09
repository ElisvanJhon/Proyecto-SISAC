package com.example.demo.repository;

import com.example.demo.entity.CalendarioObligaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarioObligacionesRepository extends JpaRepository<CalendarioObligaciones, Long> {
}