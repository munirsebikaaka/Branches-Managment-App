# Branch Business Manager 🏢

A centralized system to manage multiple business branches with inventory, sales tracking, phone charging income, and worker activity monitoring.

## 🚀 Quick Start

### 1. Firebase Setup

This app uses Firebase Authentication and Realtime Database with REST APIs.

**Create a Firebase Project:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Realtime Database
5. Copy your credentials

### 2. Environment Variables (Updated)

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Firebase credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_DATABASE_URL=https://YOUR_PROJECT_ID.firebaseio.com
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
```

### 3. Install & Run

```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173`

## 📋 Features Implemented (MVP)

✅ **Authentication**

- Admin Registration & Login
- Worker Login (admin creates workers)
- Session persistence

✅ **Inventory Management**

- Add Products
- Track quantity, buying/selling prices
- Branch-specific inventory

✅ **Sales Tracking**

- Record product sales
- Auto-calculate total amounts
- Link sales to workers & branches

✅ **Phone Charging**

- Record charging activity
- Auto-calculate income
- Track per worker & branch

✅ **Dashboard**

- View total sales
- View charging income
- Combined revenue display
- Real-time statistics

✅ **Access Control**

- Role-based access (Admin/Worker)
- Branch-specific data
- Protected routes

## 📁 Project Structure

```
src/
├── config/
│   └── firebase.js           # Firebase config
├── context/
│   └── AuthContext.jsx       # Auth state management
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── AddProduct.jsx
│   ├── RecordSale.jsx
│   ├── RecordCharging.jsx
│   └── Unauthorized.jsx
├── components/
│   ├── ProtectedRoute.jsx    # Route protection
│   └── Sidebar.jsx           # Navigation
├── utils/
│   └── api.js                # Axios instance
├── styles/
│   ├── auth.css
│   ├── sidebar.css
│   ├── dashboard.css
│   └── form.css
├── App.jsx                   # Main app with routing
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## 🔐 Database Structure (Realtime Database)

```
/users/{uid}
  - id, name, email, role, branchId, createdAt

/products/{productId}
  - name, category, buyingPrice, sellingPrice, quantity, branchId, createdAt

/sales/{saleId}
  - productId, quantity, price, total, workerId, branchId, createdAt

/charging/{chargeId}
  - phonesCharged, pricePerPhone, total, workerId, branchId, createdAt
```

## 👥 User Roles

| Feature             | Admin         | Worker               |
| ------------------- | ------------- | -------------------- |
| Login               | ✅            | ✅                   |
| Register            | ✅ (as admin) | ❌ (admin creates)   |
| Add Product         | ✅            | ✅                   |
| Record Sale         | ✅            | ✅                   |
| Record Charging     | ✅            | ✅                   |
| View Dashboard      | ✅            | ✅                   |
| Access All Branches | ✅            | ❌ (own branch only) |
| View Reports        | ✅            | ❌                   |

## 🏢 Branches (Hardcoded for MVP)

- Branch 1 - Downtown
- Branch 2 - Uptown
- Branch 3 - Midtown

## 🎨 Styling

Using plain CSS with a purple gradient theme. Files located in `src/styles/`

- `auth.css` - Login/Register pages
- `sidebar.css` - Navigation sidebar
- `dashboard.css` - Dashboard stats
- `form.css` - Form pages

## 📝 Next Steps (Features to Build)

- [ ] Manage Workers (Admin only)
- [ ] Manage Products (Admin only)
- [ ] Advanced Reports & Filters
- [ ] WiFi Sales Feature
- [ ] Edit/Delete functionality
- [ ] Date range filtering
- [ ] PDF Export
- [ ] Notifications

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite
- **Routing:** React Router v6
- **State Management:** Context API
- **HTTP Client:** Axios
- **Authentication:** Firebase Auth REST API
- **Database:** Firebase Realtime Database (REST API)
- **Styling:** Plain CSS

## 📧 Environment

Copy `.env.example` to `.env.local` and add your Firebase credentials.

## 🚀 Deployment

```bash
npm run build
npm run preview
```

The production build will be in `dist/`
