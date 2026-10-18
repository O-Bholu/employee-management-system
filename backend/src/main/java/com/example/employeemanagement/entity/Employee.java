package com.example.employeemanagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @Column(name = "emp_id", nullable = false, length = 50)
    @NotBlank(message = "Employee ID is required")
    @Size(max = 50, message = "Employee ID must be at most 50 characters")
    private String empId;

    @NotBlank(message = "Employee name is required")
    @Size(max = 100, message = "Employee name must be at most 100 characters")
    @Column(name = "emp_name", nullable = false, length = 100)
    private String empName;

    @Size(max = 255, message = "Address must be at most 255 characters")
    @Column(name = "emp_address", length = 255)
    private String empAddress;

    @Email(message = "Enter a valid email address")
    @Size(max = 150, message = "Email must be at most 150 characters")
    @Column(name = "email", length = 150)
    private String email;

    @Size(max = 20, message = "Phone must be at most 20 characters")
    @Column(name = "phone", length = 20)
    private String phone;

    @Size(max = 100, message = "Department must be at most 100 characters")
    @Column(name = "department", length = 100)
    private String department;

    @Size(max = 100, message = "Designation must be at most 100 characters")
    @Column(name = "designation", length = 100)
    private String designation;

    @PositiveOrZero(message = "Salary cannot be negative")
    @Column(name = "salary", precision = 12, scale = 2)
    private BigDecimal salary;

    public Employee() {}

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getEmpName() { return empName; }
    public void setEmpName(String empName) { this.empName = empName; }

    public String getEmpAddress() { return empAddress; }
    public void setEmpAddress(String empAddress) { this.empAddress = empAddress; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
}
