package com.example.server.service;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Collection;

import com.example.server.model.Server;

public interface ServerService {
    Server create(Server server);

    Server ping(String IpAddress) throws IOException;

    Collection<Server> list(int limit);

    Server get(Long id);

    Server update(Server server);

    Boolean delete(Long id);
}