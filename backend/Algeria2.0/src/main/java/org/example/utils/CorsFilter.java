package org.example.utils;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;


import java.io.IOException;

@Provider // Ensures automatic discovery by Jersey
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {

        // 1. Allow your specific React origin (5173)
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");

        // 2. Allow the common request methods, including POST and OPTIONS
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

        // 3. Allow complex headers like Content-Type (for JSON) and Authorization (if you use tokens later)
        responseContext.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");

        // 4. (Optional) Caches preflight results for a period (e.g., 24 hours)
        responseContext.getHeaders().add("Access-Control-Max-Age", "86400");
    }
}