package com.lopesmarcello.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class PortfolioApplication {

	public static void main(String[] args) {
		String cwd = System.getProperty("user.dir");

		Dotenv dotenv = Dotenv.configure()
				.directory(cwd)
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));

		SpringApplication.run(PortfolioApplication.class, args);
	}

}
