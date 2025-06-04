<<<<<<< HEAD
Canteen Management & Food Ordering App
A full-stack React application for ordering food, with features like cart management, payment processing, order history, reviews, and admin control.

🛠️ Tech Stack
Frontend: React.js, React Router, Bootstrap

Backend: Firebase (Authentication + Realtime Database)

Payments: UPI, Credit/Debit, NetBanking, and Cash on Delivery

State Management: React useState, useEffect, useCallback

PDF Generation: jsPDF (optional)

🚀 Features
1. Authentication
Email/password login and signup

Optional Google/Facebook OAuth

Protected routes using ProtectedRoute

2. Cart System
Add, remove items; adjust quantities

Persisted via localStorage

Cart icon in navbar shows current item count and auto-links to checkout

3. Checkout & Payment
Multi-step checkout flow: Address → Payment → Confirmation

Supports COD, UPI (with validation), Card (with validation), NetBanking

Real-time feedback on payment status

4. Order History
Displays past orders in a searchable, sortable table

Data fetched live from Firebase /sales

Looks up product details from /products

Date- and total-based sorting, live filtering

5. Reviews & Ratings
(If implemented) Allows users to leave star ratings and text reviews

Displays average ratings and review history

6. PDF Invoices
Post-checkout PDF invoice via jsPDF (containing order details, address, payment info)

7. Admin Panel
(If implemented) CRUD functionality for products and inventory

Order and sales analytics

## 📁 Project Structure

```bash
Canteen-Management/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/         # Login & Sign Up
│   │   ├── Cart/         # Cart UI & logic
│   │   ├── Checkout/     # Multi-step Checkout
│   │   ├── Payment/      # Payment Gateway
│   │   ├── OrderSuccess/ # Confirmation Page
│   │   ├── OrderHistory/ # History Table
│   │   ├── Layout/       # Navbar, Footer
│   │   └── Home/         # Product Display
│   ├── firebase.js       # Firebase Config
│   ├── AuthContext.js    # Global Auth Context
│   ├── ProtectedRoute.js # Route Guard
│   └── App.js            # Main App Component
⚙️ Setup & Installation
=======
Canteen Management & Food Ordering App
A full-stack React application for ordering food, with features like cart management, payment processing, order history, reviews, and admin control.

🛠️ Tech Stack
Frontend: React.js, React Router, Bootstrap

Backend: Firebase (Authentication + Realtime Database)

Payments: UPI, Credit/Debit, NetBanking, and Cash on Delivery

State Management: React useState, useEffect, useCallback

PDF Generation: jsPDF (optional)

🚀 Features
1. Authentication
Email/password login and signup

Optional Google/Facebook OAuth

Protected routes using ProtectedRoute

2. Cart System
Add, remove items; adjust quantities

Persisted via localStorage

Cart icon in navbar shows current item count and auto-links to checkout

3. Checkout & Payment
Multi-step checkout flow: Address → Payment → Confirmation

Supports COD, UPI (with validation), Card (with validation), NetBanking

Real-time feedback on payment status

4. Order History
Displays past orders in a searchable, sortable table

Data fetched live from Firebase /sales

Looks up product details from /products

Date- and total-based sorting, live filtering

5. Reviews & Ratings
(If implemented) Allows users to leave star ratings and text reviews

Displays average ratings and review history

6. PDF Invoices
Post-checkout PDF invoice via jsPDF (containing order details, address, payment info)

7. Admin Panel
(If implemented) CRUD functionality for products and inventory

Order and sales analytics

## 📁 Project Structure

```bash
Canteen-Management/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/         # Login & Sign Up
│   │   ├── Cart/         # Cart UI & logic
│   │   ├── Checkout/     # Multi-step Checkout
│   │   ├── Payment/      # Payment Gateway
│   │   ├── OrderSuccess/ # Confirmation Page
│   │   ├── OrderHistory/ # History Table
│   │   ├── Layout/       # Navbar, Footer
│   │   └── Home/         # Product Display
│   ├── firebase.js       # Firebase Config
│   ├── AuthContext.js    # Global Auth Context
│   ├── ProtectedRoute.js # Route Guard
│   └── App.js            # Main App Component
⚙️ Setup & Installation
>>>>>>> ebcdc907902bfc83350a2ea641a43ca7ddf0587e
