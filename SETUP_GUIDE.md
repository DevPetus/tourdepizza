# Tour de Pizza - Setup Guide

## Quick Start Guide

This guide will help you set up and run the Tour de Pizza application on your local machine.

## System Requirements

- **Node.js**: Version 14.0 or higher
- **npm**: Version 6.0 or higher
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Operating System**: Windows, macOS, or Linux

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/DevPetus/tourdepizza.git
cd tourdepizza
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env` if you need to change the default port (default is 3000):
```
PORT=3000
NODE_ENV=development
```

#### Verify Backend Installation
```bash
npm test
```

You should see:
- ✓ 77 tests passing
- ~79% code coverage

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Option 1: Run Both Servers Separately (Recommended)

**Terminal 1 - Backend API:**
```bash
cd backend
npm start
```

Output:
```
Tour de Pizza API server running on port 3000
API documentation available at http://localhost:3000/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Output:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8081
  http://192.168.x.x:8081
```

**Access the Application:**
Open your browser and navigate to: **http://localhost:8081**

### Option 2: Using npm scripts in one terminal

Create a `start-all.sh` script in the root directory:
```bash
#!/bin/bash
cd backend && npm start &
cd frontend && npm start &
wait
```

Make it executable and run:
```bash
chmod +x start-all.sh
./start-all.sh
```

## Using the Application

### Step 1: Create Your Profile
1. Open http://localhost:8080
2. Enter your name, email, and phone number
3. Click "Start Ordering"

### Step 2: Browse and Customize Pizzas
1. View pre-made pizzas or create a custom pizza
2. Select toppings (each shows price and allergens)
3. Choose size: Small, Medium, or Large
4. Add pizzas to your cart

### Step 3: Manage Allergies (Optional but Recommended)
1. Click "Profile" in the navigation
2. Add any food allergies you have
3. The system will warn you if you try to order pizzas containing those allergens

### Step 4: Shopping Cart
1. Click "Cart" to review your order
2. Adjust quantities or remove items
3. Click "Proceed to Checkout"

### Step 5: Checkout Process

**Delivery Address:**
- Enter street address, city, state, and ZIP code
- Add delivery instructions (optional)
- Click "Continue to Payment"

**Payment:**
- Select payment method (Credit Card, Debit Card, or Cash)
- Enter payment details
- Click "Continue to Review"

**Confirm Order:**
- Review your complete order
- Click "Place Order"
- You'll receive a confirmation message

## Testing the API

### Using cURL

**Get All Pizzas:**
```bash
curl http://localhost:3000/api/pizzas
```

**Get Available Toppings:**
```bash
curl http://localhost:3000/api/pizzas/toppings/available
```

**Create Customer:**
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"555-1234"}'
```

### Using the API Documentation

Visit **http://localhost:3000/api** for interactive API documentation.

## Development Mode

### Backend Development (with auto-reload)
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Running Backend Tests
```bash
cd backend

# All tests with coverage
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# Watch mode (re-run tests on file changes)
npm test -- --watch
```

### Linting
```bash
cd backend
npm run lint
```

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in backend/.env
PORT=3001
```

### Issue 2: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: CORS Errors

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Ensure backend is running on port 3000
- Ensure frontend is running on port 8080
- CORS is already configured in backend/src/index.js

### Issue 4: Frontend Not Loading

**Solution:**
```bash
# Clear browser cache
# Restart frontend server
cd frontend
npm start
```

## Architecture Overview

### Backend Structure
```
backend/
├── src/
│   ├── domain/              # Business logic (DDD)
│   │   ├── entities/        # Aggregates
│   │   ├── value-objects/   # Immutable objects
│   │   ├── repositories/    # Data access
│   │   └── services/        # Domain services
│   ├── interfaces/          # HTTP layer
│   │   └── http/
│   │       ├── controllers/
│   │       └── routes/
│   └── index.js            # Server entry
└── tests/                  # TDD tests
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/     # UI components
│   │   ├── services/       # API services
│   │   └── app.js         # App config
│   └── assets/
└── index.html
```

## Sample Data

The application comes pre-loaded with:
- 3 pre-made pizzas (Margherita, Pepperoni, Vegetarian)
- 10 toppings (Pepperoni, Mushrooms, Olives, etc.)
- Each with price and allergen information

## Performance Tips

1. **Backend**: In-memory storage is fast but not persistent. For production, integrate a database.
2. **Frontend**: Minimize API calls by caching data in services.
3. **Testing**: Run tests before committing changes.

## Production Deployment

### Backend Deployment (Heroku Example)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Netlify Example)
```bash
cd frontend
npm run build  # If you add a build script
netlify deploy
```

## Security Notes

1. **Allergy Data**: Currently encrypted with bcrypt. For production, use AES-256.
2. **Payment Data**: CVV is never stored. Card numbers are masked.
3. **Environment Variables**: Never commit `.env` files to version control.
4. **HTTPS**: Use HTTPS in production for all API calls.

## Next Steps

After successful setup:

1. ✅ Test all features (create profile, order pizza, add allergies)
2. ✅ Run the test suite (`npm test` in backend)
3. ✅ Read API documentation (http://localhost:3000/api)
4. ✅ Explore the codebase
5. ✅ Try customizing pizzas and testing allergen warnings

## Getting Help

- **Documentation**: See README.md for detailed information
- **API Docs**: Visit http://localhost:3000/api
- **Issues**: Open a GitHub issue for bugs or questions
- **Tests**: Run `npm test` to see test examples

## Useful Commands Reference

```bash
# Backend
npm start          # Start server
npm run dev        # Start with auto-reload
npm test          # Run all tests
npm run lint      # Run linter

# Frontend
npm start         # Start development server

# Both
npm install       # Install dependencies
```

---

**Happy Coding! 🍕**
