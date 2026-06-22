# Expenses UI - React Dashboard

🎯 Modern, responsive React + Vite frontend for expense tracking with professional financial dashboard.

**Repository:** [Expenses-UI on GitHub](https://github.com/harishbabujobs-ai/Expenses-UI)

## 📸 Screenshots

View the UI screenshots below to see all features in action:

### Dashboard Overview
The main dashboard displays key financial metrics and spending visualizations:

[![Dashboard Overview](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/01-dashboard.png)](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/01-dashboard.png)

**Features shown:**
- Left sidebar with navigation menu (Dashboard, Transactions, Budgets, Reports, Savings Goals)
- Profile card with welcome message
- Four KPI cards:
  - Total Balance (money left after expenses)
  - Monthly Income (₹12,000)
  - Monthly Expenses (sum of all expenses)
  - Savings Rate (% of income saved)
- Spending by Category donut chart with color-coded legend
- Monthly Expense Overview bar chart showing income vs expenses
- Budget status badge ("Within budget" or "Over budget")
- Add Expense form with title, amount, and category selection
- Recent Expenses list with search, filter, delete, and pagination

### Login Page
Secure authentication with email and password:

[![Login Page](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/03-login.png)](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/03-login.png)

**Features shown:**
- Clean login form with email and password fields
- Link to create a new account
- Professional UI with branding

### Registration Page
Create a new account with secure password policy:

[![Registration Page](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/04-register.png)](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/04-register.png)

**Features shown:**
- Full name, email, and password fields
- Password requirements: 8+ chars, uppercase, number, special character
- Link to sign in with existing account
- Form validation and error messages

### Logout Confirmation
Safe logout with confirmation modal:

[![Logout Confirmation](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/02-logout-confirmation.png)](https://raw.githubusercontent.com/harishbabujobs-ai/Expenses-UI/main/screenshots/02-logout-confirmation.png)

**Features shown:**
- Confirmation modal before session termination
- Cancel or confirm logout
- Protects against accidental logouts

## ✨ Key Features

### Authentication
- ✅ User registration with password policy (8+ chars, 1 uppercase, 1 number, 1 special char)
- ✅ Secure login with JWT tokens
- ✅ JWT tokens stored in localStorage
- ✅ Protected routes - dashboard only accessible when logged in
- ✅ Logout confirmation popup before session termination

### Dashboard Analytics
- ✅ Real-time KPI cards with calculated metrics
- ✅ Donut chart for spending by category
- ✅ Bar chart for monthly income vs expenses
- ✅ Budget status tracking (over/under budget)
- ✅ Responsive design that works on all devices

### Expense Management
- ✅ Add new expenses with title, amount, and category
- ✅ Search expenses by title
- ✅ Filter expenses by category
- ✅ Delete expenses with confirmation
- ✅ Pagination for large expense lists
- ✅ Real-time total calculation

### UI/UX
- ✅ Modern, clean design with professional styling
- ✅ Sidebar navigation with active state indicators
- ✅ Color-coded categories and status badges
- ✅ Smooth animations and transitions
- ✅ Toast notifications for user actions
- ✅ Modal dialogs for confirmations
- ✅ Responsive layout for mobile and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/harishbabujobs-ai/Expenses-UI.git
cd Expenses-UI
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL (if backend is on different port):
```bash
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

4. Start development server:
```bash
npm run dev
```

5. Open browser and navigate to: `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── DashboardPage.jsx       # Main dashboard with all features
│   ├── LoginPage.jsx            # Login form and flow
│   └── RegisterPage.jsx         # Registration form and flow
├── components/
│   ├── AuthShell.jsx            # Layout wrapper for auth pages
│   ├── ProtectedRoute.jsx       # Route guard for authenticated pages
│   └── PublicOnlyRoute.jsx      # Route guard for public pages
├── context/
│   └── AuthContext.jsx          # Authentication state management
├── api/
│   └── client.js                # Axios instance with JWT interceptor
├── App.jsx                      # Router configuration
├── index.css                    # Dashboard and global styles
└── main.jsx                     # React entry point
```

## 🎨 Technologies

- **React** 19.2.6 - UI library
- **Vite** 8.0.12 - Build tool and dev server
- **React Router** 7.18.0 - Client-side routing
- **Axios** 1.18.0 - HTTP client
- **Lucide React** 1.21.0 - Icon library
- **ESLint** 10.3.0 - Code quality

## 📋 API Endpoints Used

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password

### Expenses (Protected Routes)
- `GET /api/expenses` - Fetch expenses with pagination
- `POST /api/expenses` - Create new expense
- `DELETE /api/expenses/:id` - Delete expense

## ⚙️ Configuration

### Environment Variables

**`.env` file:**
```bash
VITE_API_URL=http://localhost:3000/api
```

**Default values:**
- API URL: `http://localhost:3000/api` (configurable)
- Monthly Income: ₹12,000 (can be modified in DashboardPage.jsx)
- Dev Server Port: 5173 (Vite default)

## 🔐 Security Features

- JWT token-based authentication
- Protected routes with AuthContext
- Secure password policy enforcement
- Token stored in localStorage with automatic injection in API requests
- Logout confirmation to prevent accidental session termination
- CORS-enabled API communication

## 📱 Responsive Design

- Desktop: Full sidebar + main content
- Tablet: Sidebar collapses, responsive grid
- Mobile: Single column layout, mobile-optimized forms

## 🚦 Password Policy

Passwords must include:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (!@#$%^&* etc.)

Example: `Test@12345` ✅

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## 🐛 Troubleshooting

### "Failed to connect to API"
- Ensure backend is running on port 3000
- Check `VITE_API_URL` in `.env` matches backend URL
- Verify API is accessible: `curl http://localhost:3000/api/auth/login`

### "Registration failed"
- Check password meets policy requirements
- Ensure email is not already registered
- Verify backend is connected to MongoDB

### "Port 5173 already in use"
```bash
# Use different port
npm run dev -- --port 5174
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Guide](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 📄 License

MIT License - Feel free to use this project for your portfolio or learning.

## 👤 Author

Harish Babu - [@harishbabujobs-ai](https://github.com/harishbabujobs-ai)

---

**Live Demo:** Currently running on `http://localhost:5173`

**Backend Repository:** [Expenses API](https://github.com/harishbabujobs-ai/Expenses)
