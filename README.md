# 🏋️ Iron Forge Fitness — Full-Stack Gym Website & Management System

A production-grade MERN (MongoDB, Express, React, Node.js) web application designed for modern gyms, fitness centers, and athletic clubs. Featuring an attractive, high-converting public gym marketing website paired with a comprehensive administrative management dashboard for members, memberships, and billing renewals.

---

## 🌟 Key Features

### 1. 🌐 Public Gym Marketing Website
- **Modern Dark Athletic Aesthetic**: High-energy hero section with call-to-action buttons.
- **Training Disciplines & Programs**: Strength, CrossFit, HIIT, Combat/Boxing, Yoga, and Personal Training.
- **Transparent Membership Pricing**: Showcase 1-month, 3-months, 6-months, and 12-months tiers.
- **Certified Coaches Roster**: Head trainers, specializations, and bios.
- **Interactive Trial Booking**: Prospective members can claim a complimentary 1-Day Pass.
- **Gym Portal Gateway**: Fast modal login/registration for gym owners and staff.

### 2. ⚡ Gym Management & Administrative Portal
- **Executive Dashboard**: Real-time KPI counters (Total Members, Monthly Joined, Expiring in 3 Days, Expiring in 4–7 Days, Expired, Inactive).
- **Member Management**:
  - Full registration with name, mobile, address, plan, and photo preview.
  - Live search by name, phone number, or address.
  - Server-side pagination (9 members per page).
  - Member profile view with joining date, last payment, and next billing date.
  - Instant Active/Inactive toggle switch.
  - One-click membership renewal with automatic billing date calculation.
- **Membership Plan Management**: Configure custom duration (months) and pricing.
- **Secure Authentication**:
  - Encrypted passwords with bcrypt.
  - JSON Web Tokens (JWT) stored in HTTP-only cookies.
  - Multi-step OTP password recovery flow.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Material UI (MUI), Axios, React Toastify
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Token, Bcrypt.js, Nodemailer
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## 🚀 Local Setup & Installation

### Step 1: Ensure Prerequisites Are Installed
- **Node.js** (v18 or higher): Verify with `node -v`
- **MongoDB**: Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` OR a free cloud connection string from [MongoDB Atlas](https://www.mongodb.com/atlas).

### Step 2: Configure Environment Variables
Inside `gym_management_public/`, check the `.env` file (copied from `.env.example`):
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/gymBackend
JWT_SecretKey=GymManagementSuperSecretKey_2026
CLIENT_URL=http://localhost:3000
```

### Step 3: Start the Backend Server
Open a terminal inside the backend folder:
```bash
cd gym_management_public
node index.js
```
The server will start on **http://localhost:4000**.
You can verify it by opening [http://localhost:4000/health](http://localhost:4000/health).

### Step 4: Install Dependencies & Run Frontend
Open a second terminal window:
```bash
cd gym_management_public/gms-frontend
npm install
npm start
```
The React development server will start on **http://localhost:3000**.

---

## 🔒 Publishing to Your GitHub Account (Clean Author Identity)

To ensure this project appears **100% under your own GitHub account** without any link, fork label, or commit history of any previous author:

```bash
# 1. Navigate to the project root
cd "C:\GYM Software\gym_management_public"

# 2. Configure your own Git identity
git config user.name "Your GitHub Name"
git config user.email "your_email@example.com"

# 3. Add all files and make your initial commit
git add .
git commit -m "Initial commit - Modern Gym Website & Management Portal"

# 4. Set main branch
git branch -M main

# 5. Connect to YOUR new empty GitHub repository
# (Create a new repository on https://github.com/new first)
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push to your repository
git push -u origin main
```
This guarantees your GitHub repository displays you as the sole author with 0 forks and zero trace of third-party accounts!
