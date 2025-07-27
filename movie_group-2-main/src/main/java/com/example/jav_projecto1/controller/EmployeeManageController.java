package com.example.jav_projecto1.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.jav_projecto1.dto.AccountDTO;
import com.example.jav_projecto1.dto.EmployeeDTO;
import com.example.jav_projecto1.dto.RegisterRequest;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.entities.Employee;
import com.example.jav_projecto1.enumm.Role_enum;
import com.example.jav_projecto1.respiratory.EmployeeRepository;
import com.example.jav_projecto1.service.EmployeeService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/employees")
public class EmployeeManageController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeManageController.class);
    private final EmployeeRepository employeeRepository;
    private final EmployeeService employeeService;

    public EmployeeManageController(EmployeeService employeeService, EmployeeRepository employeeRepository) {
        this.employeeService = employeeService;
        this.employeeRepository = employeeRepository;
        logger.info("Employee Management loaded");
    }

    // Check whether the logged-in user is an admin
    private boolean isAdmin(HttpSession session) {
        return true;
//        Account acc = (Account) session.getAttribute("userLogin");
//        return acc != null && acc.getRole() != null
//                && Role_enum.ADMIN.equals(acc.getRole().getRoleName());
    }

    // Mapping utility: converts an Employee entity to an EmployeeDTO
    private EmployeeDTO mapToDTO(Employee emp) {
        Account account = emp.getAccount();
        AccountDTO accountDto = AccountDTO.builder()
                .accountId(account.getAccountId())
                .address(account.getAddress())
                .birthday(account.getBirthday())
                .email(account.getEmail())
                .name(account.getName())
                .gender(account.getGender())
                .identityCard(account.getIdentityCard())
                .image(account.getImage())
                .phoneNumber(account.getPhoneNumber())
                .registerDate(account.getRegisterDate())
                .status(account.getStatus())
                .username(account.getUsername())
                .role(account.getRole() != null ? account.getRole().getRoleName().name() : null)
                .build();

        return EmployeeDTO.builder()
                .employeeId(emp.getEmployeeId())
                .account(accountDto)
                .build();
    }

    // GET all employees mapped to DTOs
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAll(HttpSession session) {
        // Uncomment the enforce admin check if needed:
         if (!isAdmin(session))
             return ResponseEntity.status(403).build();

        List<Employee> employees = employeeRepository.findAll();
        logger.info("Retrieved {} employees", employees.size());
        employees.forEach(emp -> logger.info("Employee: {}", emp));

        List<EmployeeDTO> dtos = employees.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // GET an employee by id mapped to DTO
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getById(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }

        Optional<Employee> optEmp = employeeRepository.findById(id);
        if (optEmp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapToDTO(optEmp.get()));
    }

    // POST: Create a new employee and return its DTO
    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@RequestBody RegisterRequest request, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        Employee emp = employeeService.saveByRegister(request);
        return ResponseEntity.ok(mapToDTO(emp));
    }

    // PUT: Update an employee and return its DTO
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> update(@PathVariable Long id, @RequestBody RegisterRequest request,
                                              HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        Optional<Employee> opt = employeeRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Account account = opt.get().getAccount();
        if (request.getUsername() != null)
            account.setUsername(request.getUsername());
        if (request.getPassword() != null)
            account.setPassword(request.getPassword()); // Consider password encoding here
        if (request.getEmail() != null)
            account.setEmail(request.getEmail());
        if (request.getName() != null)
            account.setName(request.getName());
        if (request.getBirthday() != null)
            account.setBirthday(request.getBirthday());
        if (request.getGender() != null)
            account.setGender(request.getGender());
        if (request.getIdentityCard() != null)
            account.setIdentityCard(request.getIdentityCard());
        if (request.getPhoneNumber() != null)
            account.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null)
            account.setAddress(request.getAddress());

        Employee emp = opt.get();
        emp.setAccount(account);
        Employee updated = employeeRepository.save(emp);
        return ResponseEntity.ok(mapToDTO(updated));
    }

    // DELETE: Remove an employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        if (!employeeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
