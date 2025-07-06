
#  Scooter Sharing System – Full Stack Project

This is a simplified scooter sharing system built for educational purposes using:

- **Backend**: NestJS + PostgreSQL + JWT Authentication
- **Frontend**: React Native (with Expo) + react-native-maps + AsyncStorage

---

## 🔐 Features

### Authentication
- Users can register and log in with roles: **user** or **operator**.
- JWT is used for secure authentication.
- Operator registration requires a **secret code** for validation.

### Role-Based Access
- **Users** can:
  - See scooters with battery ≥ 20%.
  - Start and stop a ride. Battery drains every second.
- **Operators** can:
  - See all scooters (regardless of battery).
  - Add new scooters.
  - Charge or delete existing scooters.

### Map Interface
- React Native Maps used for scooter markers.
- Clicking a scooter opens a modal with battery, ride controls, and name.
- Logout button available to return to login.

---

## ⚙️ Backend Structure

| File | Purpose |
|------|---------|
| `auth/auth.controller.ts` | Handles register/login HTTP endpoints |
| `auth/auth.service.ts` | Business logic for JWT, bcrypt, role control |
| `auth/jwt.strategy.ts` | Validates JWT token |
| `users/users.controller.ts` | Authenticated profile return |
| `users/users.service.ts` | DB queries for creating and finding users |
| `scooters/scooters.controller.ts` | GET/POST/PATCH/DELETE scooter endpoints |
| `scooters/scooters.service.ts` | Handles all DB logic related to scooters |

---

## 🔄 Project Flow (Controller-Service-Entity)

```
Frontend (Login/Register) --> 
AuthController.register / login --> 
AuthService --> 
UsersService (DB) --> 
Returns token -->
Frontend stores token --> 
Authenticated requests to ScooterController -->
ScooterService interacts with DB
```

---

## 🗺️ Folder Summary

```bash
📁 backend
 ┣ 📁 auth         # Registration, login, JWT strategy
 ┣ 📁 users        # User entity and service
 ┣ 📁 scooters     # Scooter entity, service, controller
 ┣ 📄 app.module.ts
 ┣ 📄 main.ts

📁 mobile
 ┣ 📁 screens
 ┃ ┣ 📄 LoginScreen.js
 ┃ ┣ 📄 RegisterScreen.js
 ┃ ┣ 📄 UserMapScreen.js
 ┃ ┣ 📄 OperatorMapScreen.js
 ┃ ┣ 📄 MapScreen.js
 ┣ 📁 components
 ┃ ┗ 📄 LogoutButton.js
 ┣ 📄 App.js
```

---

## 🧪 Sample .env

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=marti
JWT_SECRET=supersecretkey
OPERATOR_SECRET=5858
```

---

## 🚀 How to Run

1. Start PostgreSQL and create a database named `marti`
2. Backend:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
3. Mobile:
   ```bash
   cd mobile
   npm install
   npm start
   ```
4. Open the Expo app on your phone and scan the QR code.

---

## ✅ Completed Features Summary

- [x] JWT Auth with role-based access
- [x] Operator secret validation
- [x] Users can ride and reduce battery
- [x] Map screen and scooter markers
- [x] Logout function
- [x] Separate views for user/operator

---

## 📌 Notes

> ⚠️ This is a simplified project for learning purposes only. It is **not production-ready**.

---

## 🧠 Author

Developed by **Kuzey Ersoy** as a full stack assignment.
