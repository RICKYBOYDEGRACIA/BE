# Project 1 — User Management REST API

A simple **Node.js + Express + MongoDB** REST API for managing user records. It exposes full CRUD functionality over a `/api/user` endpoint.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express | ^5.3.0 | HTTP framework |
| Mongoose | ^9.11.2 | MongoDB ODM |
| dotenv | ^18.0.8 | Environment variable management |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| nodemon | ^3.1.14 | Dev auto-reload |

---

## Project Structure

```
BE/
├── config/
│   └── db.js               # MongoDB connection setup
├── controllers/
│   └── userController.js   # Business logic (CRUD handlers)
├── models/
│   └── User.js             # Mongoose schema & model
├── routes/
│   └── userRoute.js        # Express route definitions
├── server.js               # App entry point
├── test.js                 # Manual fetch test script
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB instance (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
```

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
node server.js
```

The server starts on **http://localhost:5000**.

---

## API Reference

All endpoints are prefixed with `/api/user`.

### Get All Users
```
GET /api/user
```
Returns all users sorted by creation date (newest first).

**Responses:**
| Status | Description |
|---|---|
| `200` | Successfully retrieved list of users |
| `404` | No users found in the database |

---

### Get User by ID
```
GET /api/user/:id
```

**Responses:**
| Status | Description |
|---|---|
| `200` | Successfully retrieved the user |
| `404` | User not found |

---

### Create a User
```
POST /api/user
```

**Request Body (JSON):**
```json
{
  "firstName": "Ricky",
  "middleName": "De Gracia",
  "lastName": "Mateo",
  "age": 26,
  "location": {
    "city": "Pasig City",
    "barangay": "Kalawaan"
  }
}
```

**Responses:**
| Status | Description |
|---|---|
| `201` | User successfully created |
| `400` | Missing or invalid required fields |

---

### Update a User
```
PUT /api/user/:id
```

**Request Body (JSON):** Same fields as Create (partial updates supported).

**Responses:**
| Status | Description |
|---|---|
| `201` | User successfully updated |
| `404` | User not found / invalid ID |

---

### Delete a User
```
DELETE /api/user/:id
```

**Responses:**
| Status | Description |
|---|---|
| `200` | User successfully deleted |
| `404` | User not found |

---

## Data Model

### User Schema

| Field | Type | Required | Constraints |
|---|---|---|---|
| `firstName` | String | ✅ | min length: 2 |
| `middleName` | String | ✅ | min length: 2 |
| `lastName` | String | ✅ | min length: 2 |
| `age` | Number | ✅ | min value: 18 |
| `location.city` | String | ✅ | — |
| `location.barangay` | String | ✅ | — |
| `createdAt` | Date | auto | Mongoose timestamp |
| `updatedAt` | Date | auto | Mongoose timestamp |

> [!NOTE]
> Users must be **18 years or older**. Submitting an `age` below 18 will fail validation.

---

## Manual Testing

A `test.js` script is included for quick manual API testing using the native `fetch` API:

```bash
node test.js
```

The script is pre-configured to send a `PUT` request to update a user by ID. Modify the ID and body as needed for other tests.

