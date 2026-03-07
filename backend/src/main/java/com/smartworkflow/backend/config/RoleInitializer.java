package com.smartworkflow.backend.config;

import com.smartworkflow.backend.entity.Role;
import com.smartworkflow.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {

            if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
                Role admin = new Role();
                admin.setName("ROLE_ADMIN");
                roleRepository.save(admin);
            }

            if (roleRepository.findByName("ROLE_MANAGER").isEmpty()) {
                Role manager = new Role();
                manager.setName("ROLE_MANAGER");
                roleRepository.save(manager);
            }

            if (roleRepository.findByName("ROLE_EMPLOYEE").isEmpty()) {
                Role employee = new Role();
                employee.setName("ROLE_EMPLOYEE");
                roleRepository.save(employee);
            }

        };
    }
}