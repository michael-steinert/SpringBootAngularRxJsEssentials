package com.example.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.server.model.Server;

public interface ServerRepository extends JpaRepository<Server, Long> {
    /* IP Address is unique therefore Function `findBy` will work because only on Result is possible */
    Server findByIpAddress(String ipAddress);
}
