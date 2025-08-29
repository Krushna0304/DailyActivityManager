# Daily Activity Manager

## Overview
The Daily Activity Manager is a web-based application designed to help users manage their daily activities efficiently. It allows users to log activities, track progress, and analyze their activity history. The application is built using Spring Boot for the backend and HTML, CSS, and JavaScript for the frontend.

## Features
- User authentication (signup, login, logout)
- Add, edit, and delete daily activities
- View activity logs and summaries
- Track streaks and progress
- Responsive design for mobile and desktop

## Technologies Used
- **Backend**: Spring Boot, Hibernate, JPA
- **Frontend**: HTML, CSS, JavaScript
- **Database**: PostgreSQL
- **Build Tool**: Maven

## Prerequisites
- Java 17 or higher
- Maven
- PostgreSQL

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DailyActivityManager
```

### 2. Configure the Database
Update the `application.properties` file located in `src/main/resources` with your PostgreSQL database credentials:
```properties
spring.datasource.url=jdbc:postgresql://<host>:<port>/<database>
spring.datasource.username=<username>
spring.datasource.password=<password>
```

### 3. Build the Project
```bash
./mvnw clean install
```

### 4. Run the Application
```bash
./mvnw spring-boot:run
```
The application will be accessible at `http://localhost:8080`.

## Project Structure
```
DailyActivityManager
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.krunity.DailyActivityManager
│   │   │       ├── controller
│   │   │       ├── dto
│   │   │       ├── entity
│   │   │       ├── repository
│   │   │       ├── service
│   │   │       └── config
│   │   └── resources
│   │       ├── static
│   │       └── templates
│   └── test
├── pom.xml
└── README.md
```

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any inquiries or issues, please contact the project maintainer at [email@example.com].
