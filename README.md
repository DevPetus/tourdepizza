# Tour de Pizza 🍕

A full-stack pizza ordering application built with **Test-Driven Development (TDD)** and **Domain-Driven Design (DDD)** principles.

## Architecture Overview

This application follows DDD principles with clear separation of concerns:

### Backend (ExpressJS API)
- **Domain Layer**: Entities, Value Objects, Repositories, Domain Services
- **Application Layer**: Use Cases, DTOs
- **Infrastructure Layer**: Persistence, Security (Allergy Encryption)
- **Interface Layer**: HTTP Controllers, Routes

### Frontend (AngularJS)
- Component-based architecture
- Service layer for API communication
- Shopping cart state management
- Responsive UI design

## Bounded Contexts

1. **Pizza Catalog Context**
   - Pizza customization with toppings
   - Allergen tracking
   - Price calculation

2. **Order Context**
   - Shopping cart management
   - Order lifecycle (pending → confirmed → delivered)
   - Item quantity management

3. **Delivery Context**
   - Delivery address validation
   - Address storage

4. **Payment Context**
   - Payment method handling
   - Secure card information masking
   - Payment validation

## Features

✅ **Customizable Pizzas** - Build your own pizza with various toppings  
✅ **Secure Allergy Storage** - Customer allergies are encrypted and stored securely  
✅ **Shopping Cart** - Add/remove items, update quantities  
✅ **Delivery Address** - Address validation with ZIP code format checking  
✅ **Payment Processing** - Support for credit card, debit card, and cash  
✅ **Allergy Warnings** - Automatic allergen conflict detection during checkout  
✅ **Customer Profiles** - Manage personal information and allergies  

## Technology Stack

### Backend
- Node.js with ExpressJS
- In-memory data storage (easily replaceable with database)
- bcryptjs for allergy encryption
- Jest for testing (77 tests, 79% coverage)
- Joi for validation

### Frontend
- AngularJS 1.8.3
- AngularJS Router
- Vanilla CSS (responsive design)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DevPetus/tourdepizza.git
cd tourdepizza
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

#### Start Backend API (Terminal 1)
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
# Frontend runs on http://localhost:8080
```

Visit **http://localhost:8080** in your browser to use the application.

### Running Tests

#### Backend Tests
```bash
cd backend
npm test              # Run all tests with coverage
npm run test:unit     # Run unit tests only
npm run test:e2e      # Run E2E tests only
```

**Test Results:**
- 77 tests passing
- 79.5% code coverage
- 46 unit tests (domain entities)
- 31 E2E tests (API endpoints)

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Pizza Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pizzas` | Get all pizzas |
| GET | `/pizzas/:id` | Get pizza by ID |
| POST | `/pizzas` | Create custom pizza |
| POST | `/pizzas/add-topping` | Add topping to pizza |
| POST | `/pizzas/remove-topping` | Remove topping from pizza |
| GET | `/pizzas/toppings/available` | Get all available toppings |
| POST | `/pizzas/check-allergens` | Check allergens for a pizza |

### Order Endpoints (Shopping Cart & Checkout)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order |
| GET | `/orders/:id` | Get order by ID |
| GET | `/orders/customer/:customerId` | Get orders by customer |
| POST | `/orders/add-pizza` | Add pizza to order (shopping cart) |
| POST | `/orders/remove-pizza` | Remove pizza from order |
| POST | `/orders/update-quantity` | Update pizza quantity |
| POST | `/orders/delivery-address` | Set delivery address |
| POST | `/orders/payment` | Set payment information |
| POST | `/orders/confirm` | Confirm order (validates allergies) |
| POST | `/orders/cancel` | Cancel order |
| GET | `/orders/:id/total` | Get order total |

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customers` | Create new customer |
| GET | `/customers/:id` | Get customer by ID |
| PUT | `/customers/:id` | Update customer |
| POST | `/customers/allergies/add` | Add allergy (secure storage) |
| POST | `/customers/allergies/remove` | Remove allergy |
| GET | `/customers/:id/allergies` | Get customer allergies |

### Example API Requests

#### Create Custom Pizza
```bash
curl -X POST http://localhost:3000/api/pizzas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Special Pizza",
    "basePrice": 10.99,
    "size": "large",
    "toppingIds": ["topping-id-1", "topping-id-2"]
  }'
```

#### Add Pizza to Cart
```bash
curl -X POST http://localhost:3000/api/orders/add-pizza \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-id",
    "pizzaId": "pizza-id",
    "quantity": 2
  }'
```

#### Set Delivery Address
```bash
curl -X POST http://localhost:3000/api/orders/delivery-address \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-id",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "USA",
      "instructions": "Ring doorbell"
    }
  }'
```

## Domain Model

### Entities (Aggregate Roots)

#### Pizza
- Properties: id, name, basePrice, size, toppings, allergens
- Methods: addTopping(), removeTopping(), calculatePrice(), hasAllergen()

#### Order
- Properties: id, customerId, items, deliveryAddress, payment, status
- Methods: addItem(), removeItem(), updateItemQuantity(), confirm(), cancel()

#### Customer
- Properties: id, name, email, phone, allergies
- Methods: addAllergy(), removeAllergy(), hasAllergy()

#### Topping
- Properties: id, name, price, allergens, available

### Value Objects

#### Allergy (Immutable)
- Properties: name, severity, notes
- Security: Encrypted when stored

#### DeliveryAddress (Immutable)
- Properties: street, city, state, zipCode, country, instructions
- Validation: ZIP code format, required fields

#### Payment (Immutable)
- Properties: method, cardNumber (masked), cardHolder, expirationDate
- Security: CVV never stored, card number masked

## Security Features

1. **Allergy Information Encryption**
   - Customer allergies are encrypted before storage
   - Decrypted only when needed
   - Production-ready encryption (bcrypt hash for demo)

2. **Payment Security**
   - Card numbers are masked (only last 4 digits visible)
   - CVV is never stored in the system
   - Sensitive payment data is not logged

3. **Input Validation**
   - All user inputs are validated
   - ZIP code format validation
   - Email format validation
   - Card expiration date format validation

## Project Structure

```
tourdepizza/
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/          # Pizza, Order, Customer, Topping
│   │   │   ├── value-objects/     # Allergy, DeliveryAddress, Payment
│   │   │   ├── repositories/      # Data access layer
│   │   │   └── services/          # Domain services
│   │   ├── application/
│   │   │   ├── use-cases/         # Application logic
│   │   │   └── dtos/              # Data transfer objects
│   │   ├── infrastructure/
│   │   │   ├── persistence/       # Database implementations
│   │   │   └── security/          # Security utilities
│   │   ├── interfaces/
│   │   │   └── http/
│   │   │       ├── controllers/   # HTTP request handlers
│   │   │       └── routes/        # API routes
│   │   └── index.js               # Server entry point
│   ├── tests/
│   │   ├── unit/                  # Unit tests
│   │   ├── integration/           # Integration tests
│   │   └── e2e/                   # End-to-end tests
│   ├── package.json
│   └── jest.config.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # UI components
│   │   │   │   ├── home/
│   │   │   │   ├── menu/
│   │   │   │   ├── cart/
│   │   │   │   ├── checkout/
│   │   │   │   └── profile/
│   │   │   ├── services/          # API services
│   │   │   └── app.js             # App configuration
│   │   └── assets/
│   │       └── css/
│   │           └── styles.css     # Application styles
│   ├── index.html
│   └── package.json
└── README.md
```

## Development Workflow

### TDD Approach
1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor while keeping tests green
4. Maintain high code coverage (>70%)

### Adding New Features

1. **Define Domain Model**
   - Identify entities and value objects
   - Define aggregate boundaries

2. **Write Tests**
   - Unit tests for domain logic
   - E2E tests for API endpoints

3. **Implement Domain Layer**
   - Create entities with business logic
   - Implement repositories

4. **Implement Application Layer**
   - Create controllers
   - Define routes

5. **Update Frontend**
   - Create/update services
   - Implement UI components

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication & authorization
- [ ] Order history and tracking
- [ ] Real-time order status updates (WebSockets)
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin panel for managing pizzas and orders
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Implement your changes
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using TDD and DDD principles**
