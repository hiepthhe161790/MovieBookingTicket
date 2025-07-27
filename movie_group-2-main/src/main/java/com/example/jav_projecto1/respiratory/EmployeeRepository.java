package com.example.jav_projecto1.respiratory;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jav_projecto1.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long>{
}
