# CS2 Skin Marketplace

A production-style full-stack microservice web application inspired by CS2 (Counter-Strike 2) Skin Marketplace. Built for a university software engineering course demonstrating modern backend architecture and best practices.

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Nginx (LB)    │────▶│   API Gateway    │
│  React/Vite │     │   Port :80      │     │   Port :3000     │
└─────────────┘     └─────────────────┘     └────────┬─────────┘
                                                      │
                         ┌────────────────────────────┼──────────────────┐
                         ▼                            ▼                  ▼
                  ┌─────────────┐           ┌──────────────────┐  ┌─────────────────┐
                  │ Auth Service│           │Marketplace Svc x2│  │Notification Svc │
                  │  Port :3001 │           │  Port :3002 (LB) │  │  Port :3003     │
                  └──────┬──────┘           └────────┬─────────┘  └────────┬────────┘
                         │                           │                     │
                    ┌────▼────┐               ┌──────▼──────┐        ┌─────▼──────┐
                    │MySQL DB │               │  MySQL DB   │        │  MySQL DB  │
                    │(auth)   │               │(marketplace)│        │(notifs)    │
                    └─────────┘               └─────────────┘        └────────────┘
                         │                           │
                    ┌────▼────────────────────────────▼───┐
                    │         Redis Cache                  │
                    │   (Popular skins, Dashboard, TTL)   │
                    └─────────────────────────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │        RabbitMQ Message Broker       │
                    │  Events: order.created, user.reg..  │
                    └─────────────────────────────────────┘
```

## Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, Zustand, Axios |
| API Gateway  | Node.js, Express, http-proxy-middleware |
| Auth Service | Node.js, Express, Prisma, MySQL, JWT, bcrypt |
| Marketplace  | Node.js, Express, Prisma, MySQL, Multer |
| Notification | Node.js, Express, Prisma, RabbitMQ consumer |
| Cache        | Redis (ioredis)                     |
| Message Bus  | RabbitMQ (amqplib)                  |
| Database     | MySQL 8.0 (per service)             |
| Proxy/LB     | Nginx                               |
| Container    | Docker, Docker Compose              |
| Docs         | Swagger/OpenAPI 3.0                 |
| Logging      | Winston, Morgan                     |
| Security     | Helmet, CORS, express-rate-limit    |

---

## Project Structure

```
cs2-skin-marketplace/
├── docker-compose.yml
├── .env
├── nginx/
│   └── nginx.conf                  # Nginx load balancer config
├── frontend/                       # React SPA
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/             # LoadingSpinner, Pagination, ProtectedRoute, Toast
│   │   │   ├── layout/             # Navbar, Footer
│   │   │   └── skin/               # SkinCard, SkinFilters
│   │   ├── hooks/                  # useCart, useDebounce
│   │   ├── layouts/                # MainLayout
│   │   ├── pages/                  # All pages + admin/
│   │   ├── services/               # API service layer (Axios)
│   │   ├── store/                  # Zustand stores
│   │   ├── styles/                 # Tailwind CSS
│   │   └── utils/                  # helpers.js
│   └── Dockerfile
├── services/
│   ├── api-gateway/                # Port 3000 – reverse proxy + auth middleware
│   │   ├── src/
│   │   │   ├── app.js
│   │   │   ├── config/
│   │   │   ├── middleware/         # auth, rateLimiter, proxy, error
│   │   │   ├── routes/
│   │   │   └── utils/              # logger
│   │   └── swagger.yaml            # OpenAPI docs
│   │
│   ├── auth-service/               # Port 3001
│   │   ├── prisma/schema.prisma    # User, Role, RefreshToken, AuditLog
│   │   └── src/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── middleware/
│   │       ├── validators/
│   │       ├── dtos/
│   │       └── utils/              # jwt, logger, rabbitmq, response
│   │
│   ├── marketplace-service/        # Port 3002 (2 instances, load balanced)
│   │   ├── prisma/schema.prisma    # Skin, Category, Order, Cart, Wishlist...
│   │   └── src/
│   │       ├── controllers/        # skin, cart, wishlist, order, category
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── middleware/
│   │       ├── validators/
│   │       └── utils/              # cache, rabbitmq, logger, response
│   │
│   └── notification-service/       # Port 3003
│       ├── prisma/schema.prisma    # Notification, NotificationLog
│       └── src/
│           ├── consumers/          # RabbitMQ event consumer
│           ├── controllers/
│           ├── services/
│           └── repositories/
└── package.json                    # Root: concurrently dev runner
```

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and enter project
git clone <repo-url>
cd cs2-skin-marketplace

# Start everything
docker compose up --build

# Access:
# Frontend:        http://localhost
# API Docs:        http://localhost/api/docs
# RabbitMQ Admin:  http://localhost:15672 (cs2rabbit / rabbitpassword)
```

### Option 2: Local Development

**Prerequisites:** Node.js 20+, MySQL 8, Redis, RabbitMQ

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up each service's .env (already pre-configured for local)
# Update DATABASE_URL ports in each service .env if needed

# 3. Run Prisma migrations for each service
cd services/auth-service && npx prisma migrate dev --name init
cd services/marketplace-service && npx prisma migrate dev --name init
cd services/notification-service && npx prisma migrate dev --name init

# 4. Seed databases
cd services/auth-service && node prisma/seed.js
cd services/marketplace-service && node prisma/seed.js

# 5. Start all services
npm run dev

# Access:
# Frontend:    http://localhost:5173
# API Gateway: http://localhost:3000
# API Docs:    http://localhost:3000/api/docs
```

---

## Services & Ports

| Service              | Port  | Description                          |
|---------------------|-------|--------------------------------------|
| Frontend            | 5173  | React dev server (Vite)              |
| API Gateway         | 3000  | Main entry, proxies all requests     |
| Auth Service        | 3001  | JWT auth, users, roles               |
| Marketplace Service | 3002  | Skins, cart, orders, wishlist        |
| Notification Service| 3003  | RabbitMQ consumer, notifications     |
| MySQL (auth)        | 3307  | Auth database                        |
| MySQL (marketplace) | 3308  | Marketplace database                 |
| MySQL (notification)| 3309  | Notification database                |
| Redis               | 6379  | Cache                                |
| RabbitMQ            | 5672  | Message broker                       |
| RabbitMQ Dashboard  | 15672 | Management UI                        |
| Nginx               | 80    | Load balancer (production)           |

---

## Default Admin Account

```
Email:    admin@cs2market.com
Password: Admin@12345
```

---

## API Documentation

Swagger UI is available at: **http://localhost:3000/api/docs**

### Key Endpoints

| Method | Endpoint                          | Auth     | Description             |
|--------|----------------------------------|----------|-------------------------|
| POST   | /api/auth/register               | Public   | Register user           |
| POST   | /api/auth/login                  | Public   | Login, get tokens       |
| POST   | /api/auth/refresh                | Public   | Refresh access token    |
| GET    | /api/auth/profile                | Required | Get profile             |
| GET    | /api/marketplace/skins           | Public   | List skins (filterable) |
| GET    | /api/marketplace/skins/popular   | Public   | Popular skins (cached)  |
| POST   | /api/marketplace/cart/items      | Required | Add to cart             |
| POST   | /api/marketplace/orders/checkout | Required | Checkout from cart      |
| POST   | /api/marketplace/orders/:id/payment | Required | Process payment      |
| GET    | /api/marketplace/wishlist        | Required | Get wishlist            |
| GET    | /api/marketplace/admin/dashboard | Admin    | Dashboard stats         |
| GET    | /api/notification                | Required | Get notifications       |

---

## Event-Driven Architecture (RabbitMQ)

```
Marketplace Service  ──publishes──▶  cs2.events (topic exchange)
Auth Service         ──publishes──▶  cs2.events

cs2.events  ──routes──▶  notification.queue  ──consumed──▶  Notification Service
```

**Events:**

| Routing Key         | Published By       | Action                          |
|--------------------|--------------------|----------------------------------|
| user.registered    | Auth Service       | Welcome notification             |
| order.created      | Marketplace        | Order confirmation notification  |
| payment.completed  | Marketplace        | Payment success notification     |
| order.cancelled    | Marketplace        | Cancellation notification        |
| skin.added         | Marketplace        | Logged                          |
| skin.updated       | Marketplace        | Logged                          |

---

## Redis Cache Strategy

| Cache Key         | TTL    | Invalidated When         |
|------------------|--------|--------------------------|
| skins:popular    | 10 min | Skin created/updated     |
| skins:latest     | 5 min  | Skin created/updated     |
| skin:{id}        | 5 min  | Skin updated             |
| dashboard:stats  | 2 min  | Order completed/created  |

---

## Database Models

### Auth DB
- **User** – id, email, username, password, role, isActive, isVerified
- **Role** – id, name (Admin/User)
- **RefreshToken** – token, userId, expiresAt, isRevoked
- **AuditLog** – userId, action, entity, oldValue, newValue

### Marketplace DB
- **Skin** – name, weapon, rarity, exterior, float, price, images, stock, categoryId
- **Category** – name, slug, description
- **Order** – userId, status, totalAmount, notes
- **OrderItem** – orderId, skinId, quantity, price
- **Payment** – orderId, amount, method, status
- **CartItem** – userId, skinId, quantity
- **WishlistItem** – userId, skinId

### Notification DB
- **Notification** – userId, type, title, message, isRead
- **NotificationLog** – event, payload, status, error

---

## Security

- **Helmet** – HTTP security headers on all services
- **CORS** – Configured per environment
- **JWT** – Access token (15m) + Refresh token (7d) rotation
- **bcrypt** – Password hashing (12 rounds)
- **Rate Limiting** – Global (200/15min), Auth (20/15min)
- **Input Validation** – express-validator on all endpoints
- **SQL Injection** – Prevented via Prisma ORM parameterized queries
- **XSS** – Helmet + input sanitization

---

## Load Balancing

Nginx uses `least_conn` algorithm across 2 Marketplace Service instances:
```nginx
upstream marketplace_backend {
    least_conn;
    server marketplace-service-1:3002;
    server marketplace-service-2:3002;
}
```

---

## Frontend Pages

| Route           | Access    | Description          |
|----------------|-----------|----------------------|
| /               | Public    | Home with hero + featured skins |
| /marketplace   | Public    | Browse/filter/search skins |
| /skins/:id     | Public    | Skin detail + add to cart |
| /login         | Public    | Login form           |
| /register      | Public    | Registration form    |
| /cart          | Protected | Shopping cart        |
| /checkout      | Protected | Payment + checkout   |
| /wishlist      | Protected | Saved skins          |
| /orders        | Protected | Order history        |
| /orders/:id    | Protected | Order detail         |
| /profile       | Protected | Edit profile         |
| /notifications | Protected | Notification center  |
| /admin         | Admin     | Dashboard stats      |
| /admin/skins   | Admin     | CRUD skins           |
| /admin/orders  | Admin     | All orders           |
| /admin/users   | Admin     | All users            |
