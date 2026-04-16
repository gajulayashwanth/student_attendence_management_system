# 🎓 AttendX - Enterprise Attendance Management System
### About the Project
AttendX is a full-stack, enterprise-grade student attendance management application designed for modern educational institutions. It features a premium, Grafana-inspired UI for teachers to quickly log attendance, alongside a powerful centralized security hub for administrators to audit data, track analytics, and manage academic catalogs.


## ✨ Features
### 👑 Administrator HQ
- **Staff Registry & Approvals**: Manage all incoming teacher registrations. Teachers remain systematically unapproved and cannot access the portal until authorized by an Admin.
- **Academic Catalog (Subject Management)**: Full CRUD logic to create, read, update, and disable institutional subjects and courses.
- **Student Roster Management**: Enroll students, manage roll numbers, and assign them to specific subjects automatically.
- **Authority Assignment**: Dynamically allocate subjects to authenticated teachers. Only assigned teachers can modify a subject's attendance record.
- **Global Audit Register**: An immutable, chronological history of every attendance event across the institution. Monitor exactly *who* modified a record and *when*.
- **Client-Side CSV Export**: Export any dynamically filtered audit log to Microsoft Excel via a `.csv` file, driven entirely by the client-side browser to save server CPU usage.

### 📚 Teacher Workspace
- **Dynamic Launchpad**: Instantly view assigned subjects and total enrolled students upon login.
- **Rapid Attendance Matrix**: Mark students as 'Present' or 'Absent' using a highly animated, responsive grid table.
- **Real-Time Analytics Dashboard**: Monitor student attendance health with dynamic Recharts (pie charts, line graphs) that automatically calculate percentages and tracking targets.
- **Reporting Engine**: Pull historical Daily Snapshots or Monthly Reviews per subject. Includes 1-click `.csv` Excel exports for internal departmental reviews.

## 🛠️ Technology Stack
- **Frontend Engine**: React.js (v18), Vite, Zustand (Global State Management)
- **UI Architecture**: Tailwind CSS, Framer Motion, Recharts, Lucide React
- **Backend Framework**: Django 5, Django REST Framework (DRF)
- **Database**: MySQL 8+
- **Security**: JSON Web Tokens (SimpleJWT), Role-Based API Guards, Axios Interceptors

## 🚀 Setup Guide
### 📋 Prerequisites
Ensure the following software is installed on your machine:
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)
- **MySQL Server** (XAMPP, MySQL Workbench, or Raw Server)

### ⚙️ Step 1: Database Setup
1. Open your MySQL client or terminal.
2. Create the raw database for the system:
   ```sql
   CREATE DATABASE attendance_db;
   ```
  
### 🐍 Step 2: Backend Setup (Django)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
  
2. Create and activate a Python Virtual Environment:
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate
   
   # On Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
   
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
  
4. Create an environment file (`.env`) in your backend folder and add your database credentials. *Make sure you replace the password with your own local MySQL password*:
   ```ini
   DEBUG=True
   SECRET_KEY=your_secure_django_key_here
   DB_NAME=attendance_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```
  
5. Run the database migrations to build the tables:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
 
6. **Create the Master Admin**: Run the following Django command to generate your superuser account:
   ```bash
   python manage.py createsuperuser
   ```
  
7. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   *The backend APIs will now be live on `http://127.0.0.1:8000/`*

### 💻 Step 3: Frontend Setup (React)
1. Open a **new separate terminal** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
 
2. Install the necessary Node packages:
   ```bash
   npm install
   ```
  
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend client will now be live on `http://localhost:5173/`*

### 📝 Notes:
1. Make sure the backend server is running before using the frontend.
2. Make sure MySQL is running before applying migrations.
3. If needed, update the frontend API base URL according to your backend server configuration.
