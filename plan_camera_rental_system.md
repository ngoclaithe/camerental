# CAMRENT PRO – Development Plan

## 1. Project Overview

Hệ thống: Web nội bộ quản lý cho thuê máy ảnh

Mục tiêu:

* Quản lý lịch thuê theo ngày/tháng
* Quản lý đơn hàng
* Quản lý khách hàng
* Quản lý thiết bị
* Quản lý nhân viên & lịch trực
* Theo dõi cọc, doanh thu
* Báo cáo thống kê
* Phân quyền người dùng

Tech Stack:

* FE: Vite + React + TypeScript
* UI: TailwindCSS + Headless UI / Radix
* State: Zustand
* Router: React Router
* Table: TanStack Table
* Date: Dayjs
* Chart: Recharts
* BE: NestJS
* ORM: Prisma
* DB: PostgreSQL
* Auth: JWT + Refresh Token
* Realtime: Socket.IO

---

# 2. System Architecture

## 2.1 High Level

Client (React)
↓ REST + Socket
NestJS API Server
↓
PostgreSQL

Realtime channel:

* Lịch thuê cập nhật realtime
* Trạng thái đơn thay đổi

---

# 3. Feature Breakdown

## 3.1 Authentication & Authorization

### Roles:

* ADMIN
* MANAGER
* STAFF

### Requirements:

* Login
* Refresh token
* Role-based route guard
* Permission guard backend

Permissions matrix:

* ADMIN: full access
* MANAGER: quản lý đơn + báo cáo
* STAFF: tạo & xem đơn

---

# 4. Core Modules (BE - NestJS)

## 4.1 User Module

Entity:

* id
* name
* email
* password_hash
* role
* created_at

Endpoints:

* POST /auth/login
* POST /auth/refresh
* GET /users
* POST /users
* PATCH /users/:id

---

## 4.2 Customer Module

Entity:

* id
* name
* phone
* email
* note
* created_at

Endpoints:

* GET /customers
* POST /customers
* PATCH /customers/:id
* DELETE /customers/:id

---

## 4.3 Equipment Module

Entity:

* id
* name
* brand
* category
* price_per_day
* status (AVAILABLE, RENTED, MAINTENANCE)
* serial_number
* created_at

Endpoints:

* GET /equipments
* POST /equipments
* PATCH /equipments/:id
* DELETE /equipments/:id

---

## 4.4 Rental Order Module

Entity:

* id
* code
* customer_id
* staff_id
* start_date
* end_date
* total_days
* price_per_day
* deposit
* discount
* total_amount
* status (PENDING, CONFIRMED, RENTING, COMPLETED, LATE, CANCELLED)
* note
* created_at

Logic:

* Auto calculate total_days
* Auto calculate total_amount
* Validate equipment availability
* Prevent overlapping booking

Endpoints:

* GET /orders
* GET /orders/:id
* POST /orders
* PATCH /orders/:id
* PATCH /orders/:id/status

---

## 4.5 Calendar Module

Purpose:
Trả dữ liệu booking theo ngày để render lịch

Endpoint:

* GET /calendar?from=YYYY-MM-DD&to=YYYY-MM-DD

Return format:
[
{
equipmentId,
equipmentName,
bookings: [
{
orderId,
startDate,
endDate,
status
}
]
}
]

---

## 4.6 Report Module

Endpoints:

* GET /reports/summary
* GET /reports/revenue
* GET /reports/top-equipments
* GET /reports/top-customers

Metrics:

* Revenue today
* Revenue range
* Total deposit
* Total renting orders

---

# 5. Frontend Structure (Vite + React TS)

## 5.1 Folder Structure

src/
api/
components/
features/
auth/
dashboard/
orders/
equipments/
customers/
calendar/
reports/
hooks/
layouts/
routes/
store/
utils/
types/

---

# 6. Main Screens

## 6.1 Dashboard

* KPI cards
* Revenue chart 7 days
* Recent orders list
* Upcoming returns

API calls:

* /reports/summary
* /orders?limit=5

---

## 6.2 Calendar View

Desktop:

* Table layout
* Equipment rows
* Date columns
* Colored booking blocks

Mobile:

* Select date
* Equipment card
* Timeline bar

Realtime:

* Listen socket event: order.updated

---

## 6.3 Create Rental Order (Multi-step)

Step 1: Select customer
Step 2: Select equipment + date range
Step 3: Pricing
Step 4: Confirm

Validation:

* Required fields
* Date overlap check
* Auto calculation

---

## 6.4 Orders List

Features:

* Search
* Filter (status, date, staff)
* Pagination
* Status badge

---

## 6.5 Equipment Management

* CRUD equipment
* Status indicator
* Maintenance toggle

---

## 6.6 Customer Management

* CRUD customer
* Search by phone

---

## 6.7 Reports

* Revenue chart
* Top equipments
* Top customers
* Date range filter

---

# 7. Realtime Strategy

Socket events:

* order.created
* order.updated
* order.deleted

Frontend:

* Update calendar instantly
* Update order list

---

# 8. Business Logic Rules

1. Không cho phép trùng thời gian thuê cùng 1 thiết bị
2. Khi order status = RENTING → equipment status = RENTED
3. Khi order COMPLETED → equipment = AVAILABLE
4. Nếu quá hạn → status tự động LATE
5. Deposit không vượt total_amount

---

# 9. Non-functional Requirements

* Mobile-first UI
* Responsive desktop
* Loading skeleton
* Error boundary
* Toast notification
* Secure password hashing (bcrypt)
* Rate limiting
* Logging middleware

---

# 10. Deployment Plan

Dev:

* Docker compose (API + Postgres)

Prod:

* Nginx reverse proxy
* PM2
* SSL
* Backup database daily

---

# 11. Future Enhancements

* Multi-branch support
* Payment integration
* SMS notification
* Contract PDF export
* Analytics advanced dashboard

---

# 12. Implementation Phases

Phase 1:

* Auth
* Equipment
* Customer

Phase 2:

* Rental Order
* Calendar

Phase 3:

* Reports
* Realtime

Phase 4:

* Optimization
* Security hardening

---

END OF PLAN
