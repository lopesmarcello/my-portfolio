package com.lopesmarcello.portfolio;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
public class PortfolioApplication {

	public static void main(String[] args) {
		String cwd = System.getProperty("user.dir");
		System.out.printf("[dotenv] CWD: %s%n", cwd);
		System.out.printf("[dotenv] .env exists at CWD: %s%n", Files.exists(Paths.get(cwd, ".env")));

		Dotenv dotenv = Dotenv.configure()
				.directory(cwd)
				.ignoreIfMissing()
				.load();

		System.out.printf("[dotenv] ADMIN_USERNAME via dotenv.get: %s%n", dotenv.get("ADMIN_USERNAME", "NOT_FOUND"));

		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));

		System.out.printf("[dotenv] ADMIN_USERNAME system prop after set: %s%n", System.getProperty("ADMIN_USERNAME", "NOT_SET"));

		SpringApplication.run(PortfolioApplication.class, args);
	}

}
