package com.example.jav_projecto1.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.example.jav_projecto1.entities.Employee;
import com.example.jav_projecto1.enumm.Role_enum;
import com.example.jav_projecto1.dto.RegisterRequest;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.respiratory.EmployeeRepository;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final AccountService accountService;

    public EmployeeService(EmployeeRepository employeeRepository, AccountService accountService) {
        this.employeeRepository = employeeRepository;
        this.accountService = accountService;
    }

    public List<Account> findAllAccount() {
        return employeeRepository.findAll().stream().map(Employee::getAccount).collect(Collectors.toList());
    }

    public Optional<Account> findAccountById(Long id) {
        Optional<Employee> e = employeeRepository.findById(id);
        return e.map(Employee::getAccount);
    }

    public Employee saveByRegister(RegisterRequest request) {
        Account account = accountService.saveByRequest(request, Role_enum.EMPLOYEE);
        return employeeRepository.save(Employee.builder().account(account).build());
    }
}
