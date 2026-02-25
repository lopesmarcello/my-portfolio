package com.lopesmarcello.portfolio.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(DotenvEnvironmentPostProcessor.class);

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        if (!Files.exists(Paths.get(".env"))) {
            log.warn(".env file not found — falling back to system environment variables");
        }

        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        Map<String, Object> properties = new HashMap<>();
        dotenv.entries().forEach(e -> properties.put(e.getKey(), e.getValue()));

        log.debug("dotenv loaded keys: {}", properties.keySet());

        environment.getPropertySources().addFirst(new MapPropertySource("dotenvFile", properties));
    }
}
