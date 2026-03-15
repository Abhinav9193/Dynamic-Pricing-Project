package com.pricing.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role; // ADMIN, MANAGER, EMPLOYEE

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    public User() {}

    public User(String name, String email, String password, String role, Company company) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.company = company;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}
