package com.example.jav_projecto1.entities;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity {
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private LocalDateTime deletedAt;
    private String deletedBy;
    private Boolean status; // true: active, false: deleted

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = true;
        this.createdBy = getCurrentUser();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        this.updatedBy = getCurrentUser();
    }

    protected String getCurrentUser() {
        try {
            RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
            if (requestAttributes != null) {
                Object userObj = requestAttributes.getAttribute("userLogin", RequestAttributes.SCOPE_SESSION);
                if (userObj instanceof com.example.jav_projecto1.entities.Account acc) {
                    return acc.getUsername();
                }
            }
        } catch (Exception e) {
            // Log the exception if necessary
            e.printStackTrace();
        }
        return "system";
    }
}