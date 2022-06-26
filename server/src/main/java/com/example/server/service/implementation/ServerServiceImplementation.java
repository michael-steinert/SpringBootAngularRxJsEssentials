package com.example.server.service.implementation;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;
import java.util.Random;
import javax.transaction.Transactional;

import com.example.server.repository.ServerRepository;
import com.example.server.service.ServerService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.server.model.Server;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import static com.example.server.enumeration.Status.*;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class ServerServiceImplementation implements ServerService {
    private final ServerRepository serverRepository;

    @Override
    public Server create(Server server) {
        log.info("Saving new Server: {}", server.getName());
        server.setImageUri(setServerImageUri());
        return serverRepository.save(server);
    }

    @Override
    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging Server IP Address: {}", ipAddress);
        Server server = serverRepository.findByIpAddress(ipAddress);
        InetAddress internetAddress = InetAddress.getByName(ipAddress);
        server.setStatus(internetAddress.isReachable(4200) ? SERVER_UP : SERVER_DOWN);
        serverRepository.save(server);
        return server;
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Listing all Servers");
        return serverRepository.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Server get(Long id) {
        log.info("Getting Server by ID: {}", id);
        return serverRepository.findById(id).get();
    }

    @Override
    public Server update(Server server) {
        log.info("Updating Server: {}", server.getName());
        /* JPA will find existing Object an update it or if not then create a new Object */
        return serverRepository.save(server);
    }

    @Override
    public Boolean delete(Long id) {
        log.info("Deleting Server by ID: {}", id);
        /* If Function `delete` not work it will cause an Exception */
        serverRepository.deleteById(id);
        return Boolean.TRUE;
    }

    private String setServerImageUri() {
        /* Picking random Image */
        String[] imagesNames = {"server1.png", "server2.png", "server3.png", "server4.png"};
        /* Example URI: localhost:8080/sever/image/server1.png */
        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/server/image/" + imagesNames[new Random().nextInt(4)])
                .toUriString();
    }
}
