
# Employee Management System

A full-stack CRUD application with:

- **Backend:** Java 17, Spring Boot, Spring Data JPA, Maven
- **Database:** MySQL
- **Frontend:** React + Vite

The root folder contains exactly two application folders: `backend/` and `frontend/`.

## 1. Requirements

Install Java 17+, Maven 3.8+, Node.js 18+, and MySQL 8+.

## 2. Create the database

Open MySQL Workbench or the MySQL command line and run:

```sql
CREATE DATABASE employee_management;
```

The backend uses `spring.jpa.hibernate.ddl-auto=update`, so it creates/updates the `employees` table automatically.

## 3. Configure MySQL

Open `backend/src/main/resources/application.properties` and update the username/password to match your local MySQL account:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Do not commit real passwords to public repositories.

## 4. Start the backend

From a terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`

API endpoints:

- `GET /api/employees` — list all employees
- `GET /api/employees/{empId}` — get one employee
- `POST /api/employees` — create employee
- `PUT /api/employees/{empId}` — update employee
- `DELETE /api/employees/{empId}` — delete employee

`empId` is a **String**, not an auto-increment number. Example: `EMP001`.

Example JSON for POST/PUT:

```json
{
  "empId": "EMP001",
  "empName": "Asha Patel",
  "empAddress": "Ahmedabad",
  "email": "asha@example.com",
  "phone": "9876543210",
  "department": "IT",
  "designation": "Developer",
  "salary": 45000.00
}
```

## 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

During development, Vite proxies `/api` requests to the backend at
`http://localhost:8080`, so keep the backend running in the first terminal.

## Troubleshooting

- **Access denied for user:** correct the MySQL username/password in `application.properties`.
- **Unknown database:** run `CREATE DATABASE employee_management;`.
- **Port 8080 in use:** stop the other application using that port or change `server.port`.
- **Blank page:** run `npm install` inside `frontend`, then start the app with `npm run dev`
  from that folder and open the URL printed by Vite.
- **API/network error:** make sure the backend is running at `http://localhost:8080`.
- **Maven not found:** install Maven, or open the backend in an IDE with Maven support.

This project is structured to run locally; no software project can be guaranteed error-free on every machine because local Java, Node, and MySQL configuration varies.
