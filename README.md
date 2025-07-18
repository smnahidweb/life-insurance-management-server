# 🛡️ Sure Life Insurance - Server

This is the backend (server-side) of the **Sure Life Insurance Management System**, built with **Node.js**, **Express**, and **MongoDB**. It provides APIs for managing users, policies, applications, agent approvals, payments (Stripe), blog posts, and more.

---

## 🚀 Features

- JWT-based user authentication and role protection
- Admin, Agent, Customer role-based authorization
- CRUD APIs for:
  - Users & Agents
  - Insurance Policies
  - Applications & Reviews
  - Blog Posts
  - Stripe Payment Transactions
- Secure image uploads (e.g. via ImgBB)
- MongoDB database connection

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: Firebase Admin SDK, JWT
- **Payments**: Stripe
- **Image Upload**: ImgBB
- **Environment**: dotenv

---

## 🔧 Installation & Setup

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/smnahidweb/life-insurance-management.git
   cd life-insurance-management/server
