package com.akhil.gateway.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {
    @NotBlank(message="Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min=6,message = "Password must have atLeast 6 characters")
    private String password;
    private String keyCloakId;
    private String firstName;
    private String lastName;
}
