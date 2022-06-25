package com.example.server;

import com.example.server.enumeration.Status;
import com.example.server.model.Server;
import com.example.server.repository.ServerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    /* CommandLineRunner runs after the Application has been initialized */
    @Bean
    CommandLineRunner run(ServerRepository serverRepository) {
        return args -> {
            serverRepository.save(new Server(
                    1L,
                    "192.168.1.42",
                    "Windows",
                    "8GB",
                    "PC",
                    "http://localhost:8080/server/image/server1.png",
                    Status.SERVER_UP)
            );
        };
    }
}
