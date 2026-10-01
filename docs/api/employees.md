# Employee Management API Specification

Base Path: `/api/employees`  
Feature ID: `EMP-001` - `EMP-005`  
Required Role: `admin` (`Authorization: Bearer <access_token>`)

---

## 1. GET `/api/employees`
* **Purpose**: Retrieve paginated list of employee users with optional search filtering.
* **Query Parameters**:
  * `page` (integer, default: `1`, min: `1`)
  * `page_size` (integer, default: `10`, min: `1`, max: `100`)
  * `search` (string, optional): Case-insensitive match on name or email.
* **Response (200 OK)**:
```json
{
  "items": [
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "employee",
      "is_active": true,
      "phone": "+1234567890",
      "department": "Engineering",
      "designation": "Software Engineer",
      "status": "active",
      "created_at": "2026-10-01T21:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
```

---

## 2. POST `/api/employees`
* **Purpose**: Create a new employee `User` and `EmployeeProfile` in a single atomic transaction.
* **Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "InitialPassword123",
  "phone": "+1234567890",
  "department": "Engineering",
  "designation": "Software Engineer"
}
```
* **Response (201 Created)**: `EmployeeResponse` object.
* **Errors**:
  * `409 Conflict`: `"An employee with this email already exists"`

---

## 3. GET `/api/employees/{employee_id}`
* **Purpose**: Retrieve details for a specific employee by ID.
* **Response (200 OK)**: `EmployeeResponse` object.
* **Errors**:
  * `404 Not Found`: `"Employee not found"`

---

## 4. PUT `/api/employees/{employee_id}`
* **Purpose**: Update an employee's user name, email, phone, department, or designation.
* **Request Body**: Partial or complete fields (`name`, `email`, `phone`, `department`, `designation`).
* **Response (200 OK)**: Updated `EmployeeResponse` object.
* **Errors**:
  * `404 Not Found`: `"Employee not found"`
  * `409 Conflict`: `"An employee with this email already exists"`

---

## 5. PATCH `/api/employees/{employee_id}/status`
* **Purpose**: Soft activate or deactivate an employee while preserving task history.
* **Request Body**:
```json
{
  "is_active": false
}
```
* **Response (200 OK)**: Updated `EmployeeResponse` object (sets `is_active: false` and `status: "inactive"`).

---

## 💻 Frontend UI Integration Details

* **Page Component**: [`frontend/src/pages/EmployeesPage.jsx`](file:///d:/Task-Management/frontend/src/pages/EmployeesPage.jsx)
* **Service Module**: [`frontend/src/api/employeeApi.js`](file:///d:/Task-Management/frontend/src/api/employeeApi.js)
* **Route Protection**: `<ProtectedRoute requireAdmin={true} />` guards `/employees` against employee user access.
* **UI Features**:
  * Real-time debounced search filter (400ms) on name or email.
  * Responsive table layout on desktop/tablet with mobile card reflow.
  * `EmployeeModal` component supporting atomic creation and PUT profile edits with field validation.
  * `ConfirmDialog` component providing safe status activation/deactivation confirmations.

