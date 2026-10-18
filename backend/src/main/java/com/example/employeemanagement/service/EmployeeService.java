package com.example.employeemanagement.service;

import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(String empId) {
        return employeeRepository.findById(empId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + empId));
    }

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsById(employee.getEmpId())) {
            throw new IllegalArgumentException("Employee ID already exists: " + employee.getEmpId());
        }
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(String empId, Employee request) {
        Employee existing = getEmployeeById(empId);
        existing.setEmpName(request.getEmpName());
        existing.setEmpAddress(request.getEmpAddress());
        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setDepartment(request.getDepartment());
        existing.setDesignation(request.getDesignation());
        existing.setSalary(request.getSalary());
        return employeeRepository.save(existing);
    }

    public void deleteEmployee(String empId) {
        Employee employee = getEmployeeById(empId);
        employeeRepository.delete(employee);
    }
}
