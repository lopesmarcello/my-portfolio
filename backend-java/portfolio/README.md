# Portfolio API

Backend API for the Portfolio application, built with Java and Spring Boot.

## Technology Stack

- **Java**: 17
- **Framework**: Spring Boot 4.0.2
- **Database**: PostgreSQL
- **Documentation**: SpringDoc OpenAPI (Swagger)

## Prerequisites

- Java 17+
- Maven
- Docker (optional, for running PostgreSQL)

## Getting Started

### 1. Configuration

The application is configured to connect to a PostgreSQL database.
Ensure your database is running and accessible.

**Default Database Configuration** (`src/main/resources/application.properties`):
- URL: `jdbc:postgresql://localhost:5432/portfolio`
- Username: `portfolio`
- Password: `portfolio`

### 2. Database Setup

If you have Docker installed, you can start a PostgreSQL container:

```bash
docker run --name portfolio-db -e POSTGRES_DB=portfolio -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio -p 5432:5432 -d postgres:16
```

### 3. Running the Application

Use Maven to run the application:

```bash
mvn spring-boot:run
```

The server will start on port `8080`.

## API Documentation

Interactive API documentation is available via Swagger UI:

[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

This interface allows you to explore the API endpoints, see request/response schemas, and test distinct endpoints directly.
