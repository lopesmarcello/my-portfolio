package com.lopesmarcello.portfolio.config;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import io.github.cdimascio.dotenv.Dotenv;

@Configuration
@PropertySource("classpath:application.properties")
class AppConfig {
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyConfigurer() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        Properties props = new Properties();
        dotenv.entries().forEach(e -> props.setProperty(e.getKey(), e.getValue()));

        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        configurer.setProperties(props);
        configurer.setLocalOverride(false);
        return configurer;
    }
}