# 🏠 HomeFind — Nigeria's Property Rental & Sales Platform

HomeFind is a full-stack web application that connects landlords with tenants and buyers across Nigeria. Landlords can list properties with images, while tenants and buyers can browse, search, filter, and chat with landlords in real time.

---

## 🌐 Live Demo

- **Frontend**: https://property-rental-frontend-rho.vercel.app
- **Backend**: https://property-rental-backend-vnc5.onrender.com

---

## ✨ Features

### 👤 Authentication
- Register as Landlord, Tenant (RENT) or Buyer (BUY)
- JWT authentication with HTTP-only SameSite cookies
- Token expiration with automatic logout
- Forgot password via OTP email
- Change password for logged-in users
- Welcome email on registration
- Deactivated account protection

### 🏠 Properties
- Landlords can list properties with up to 7 images (Cloudinary)
- Property types: Apartment, House, Duplex, Studio, Self Contain
- Search by title, city or state
- Filter by property type
- Pagination (6 per page)
- Featured properties pinned to top (admin only)
- Toggle availability (landlord)
- Image slider with thumbnails on property details page
- Verified landlord badge

### 💬 Real-time Chat
- Tenants and buyers can chat with landlords
- Socket.io powered real-time messaging
- Unread message notifications in navbar
- Chat history persisted in MongoDB
- Mark messages as read

### 🛡️ Admin Panel
- Dashboard with analytics charts (Recharts)
  - User registrations by month (Line chart)
  - Users by role (Pie chart)
  - Properties by type (Bar chart)
  - Top states by listings (Bar chart)
- Manage all users — search, filter by role
- Activate/Deactivate user accounts
- Verify landlords (verified badge)
- Delete users and properties
- Feature/unfeature properties
- View all conversations

### 📧 Email Notifications
- Professional HTML welcome email on registration
- OTP email for password reset
- Powered by Nodemailer + Gmail

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React (CRA) | UI framework |
| React Router DOM | Client-side routing |
| Axios | API requests |
| Socket.io Client | Real-time chat |
| Formik + Yup | Form validation |
| Bootstrap 5 | Styling |
| React Icons | Icon library |
| Recharts | Admin analytics charts |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Socket.io | Real-time messaging |
| Cloudinary + Multer | Image uploads |
| Nodemailer | Email service |
| Bcryptjs | Password hashing |
| Cookie Parser | HTTP-only cookies |
| OTP Generator | Password reset OTPs |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/Nony-montana/property-rental-backend.git
cd property-rental-backend/property

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your environment variables

# Start development server
npm run dev
```

### Environment Variables (Backend)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_MAIL=your_gmail@gmail.com
NODE_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### Frontend Setup

```bash
# Clone the repo
git clone https://github.com/Nony-montana/property-rental-frontend.git
cd property-rental-frontend

# Install dependencies
npm install

# Create .env file
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
CI=false

# Start development server
npm start
```

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **LANDLORD** | List properties, manage listings, chat with tenants/buyers, toggle availability |
| **RENT** | Browse properties, chat with landlords, search and filter |
| **BUY** | Browse properties, chat with landlords, search and filter |
| **ADMIN** | Full access — manage users, properties, view analytics and chats |

---

## 📁 Project Structure

### Backend