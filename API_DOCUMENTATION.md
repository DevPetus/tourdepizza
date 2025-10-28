# Tour de Pizza - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. Future versions will implement JWT-based authentication.

---

## Pizza Endpoints

### Get All Pizzas
Retrieve all available pizzas including pre-made and custom pizzas.

**Endpoint:** `GET /pizzas`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Margherita",
    "basePrice": 8.99,
    "size": "medium",
    "toppings": [],
    "allergens": ["dairy", "gluten"],
    "createdAt": "2025-10-28T08:00:00.000Z"
  }
]
```

---

### Get Pizza by ID
Get details of a specific pizza.

**Endpoint:** `GET /pizzas/:id`

**Parameters:**
- `id` (path) - Pizza ID

**Response:**
```json
{
  "id": "uuid",
  "name": "Pepperoni",
  "basePrice": 10.99,
  "size": "medium",
  "toppings": [
    {
      "id": "uuid",
      "name": "Pepperoni",
      "price": 1.5,
      "allergens": ["pork"]
    }
  ],
  "allergens": ["dairy", "gluten", "pork"]
}
```

---

### Create Custom Pizza
Build your own pizza with custom toppings.

**Endpoint:** `POST /pizzas`

**Request Body:**
```json
{
  "name": "My Special Pizza",
  "basePrice": 10.99,
  "size": "large",
  "toppingIds": ["topping-id-1", "topping-id-2"]
}
```

**Validation:**
- `name`: Required, non-empty string
- `basePrice`: Required, must be > 0
- `size`: Required, must be "small", "medium", or "large"
- `toppingIds`: Optional array of topping IDs

**Response:**
```json
{
  "id": "new-uuid",
  "name": "My Special Pizza",
  "basePrice": 10.99,
  "size": "large",
  "toppings": [...],
  "allergens": ["dairy", "gluten", ...]
}
```

---

### Get Available Toppings
Retrieve all available toppings with pricing and allergen information.

**Endpoint:** `GET /pizzas/toppings/available`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Pepperoni",
    "price": 1.5,
    "allergens": ["pork"],
    "available": true
  },
  {
    "id": "uuid",
    "name": "Mushrooms",
    "price": 1.0,
    "allergens": [],
    "available": true
  }
]
```

---

### Check Allergens
Check if a pizza contains specific allergens.

**Endpoint:** `POST /pizzas/check-allergens`

**Request Body:**
```json
{
  "pizzaId": "pizza-uuid",
  "allergens": ["peanuts", "dairy", "shellfish"]
}
```

**Response:**
```json
{
  "hasConflicts": true,
  "conflicts": ["dairy"]
}
```

---

## Order Endpoints (Shopping Cart & Checkout)

### Create Order
Create a new order for a customer.

**Endpoint:** `POST /orders`

**Request Body:**
```json
{
  "customerId": "customer-uuid"
}
```

**Response:**
```json
{
  "id": "order-uuid",
  "customerId": "customer-uuid",
  "items": [],
  "status": "pending",
  "deliveryAddress": null,
  "payment": null,
  "createdAt": "2025-10-28T08:00:00.000Z"
}
```

---

### Get Order by ID
Retrieve order details.

**Endpoint:** `GET /orders/:id`

**Response:**
```json
{
  "id": "order-uuid",
  "customerId": "customer-uuid",
  "items": [
    {
      "pizzaId": "pizza-uuid",
      "pizza": {...},
      "quantity": 2,
      "price": 26.00
    }
  ],
  "status": "pending",
  "deliveryAddress": {...},
  "payment": {...}
}
```

---

### Get Orders by Customer
Get all orders for a specific customer.

**Endpoint:** `GET /orders/customer/:customerId`

**Response:** Array of order objects

---

### Add Pizza to Order (Shopping Cart)
Add a pizza to the order.

**Endpoint:** `POST /orders/add-pizza`

**Request Body:**
```json
{
  "orderId": "order-uuid",
  "pizzaId": "pizza-uuid",
  "quantity": 2
}
```

**Response:** Updated order object

**Notes:**
- If pizza already exists in order, quantity is increased
- Automatically calculates item price

---

### Remove Pizza from Order
Remove a pizza from the order.

**Endpoint:** `POST /orders/remove-pizza`

**Request Body:**
```json
{
  "orderId": "order-uuid",
  "pizzaId": "pizza-uuid"
}
```

**Response:** Updated order object

---

### Update Pizza Quantity
Update the quantity of a pizza in the order.

**Endpoint:** `POST /orders/update-quantity`

**Request Body:**
```json
{
  "orderId": "order-uuid",
  "pizzaId": "pizza-uuid",
  "quantity": 3
}
```

**Response:** Updated order object

**Notes:**
- If quantity is 0 or less, item is removed from order

---

### Set Delivery Address
Set the delivery address for an order.

**Endpoint:** `POST /orders/delivery-address`

**Request Body:**
```json
{
  "orderId": "order-uuid",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA",
    "instructions": "Ring doorbell"
  }
}
```

**Validation:**
- `street`: Required
- `city`: Required
- `state`: Required
- `zipCode`: Required, must match format `\d{5}(-\d{4})?`
- `country`: Optional, defaults to "USA"
- `instructions`: Optional

**Response:** Updated order object

---

### Set Payment Information
Set payment method and details.

**Endpoint:** `POST /orders/payment`

**Request Body:**
```json
{
  "orderId": "order-uuid",
  "payment": {
    "method": "credit_card",
    "cardNumber": "4111111111111111",
    "cardHolder": "John Doe",
    "expirationDate": "12/25",
    "cvv": "123"
  }
}
```

**Validation:**
- `method`: Required, must be "credit_card", "debit_card", or "cash"
- For non-cash methods:
  - `cardNumber`: Required
  - `cardHolder`: Required
  - `expirationDate`: Required, format `MM/YY`
  - `cvv`: Required (not stored in response)

**Response:**
```json
{
  "id": "order-uuid",
  "payment": {
    "method": "credit_card",
    "cardNumber": "**** **** **** 1111",
    "cardHolder": "John Doe",
    "expirationDate": "12/25"
  }
}
```

**Security Notes:**
- Card number is automatically masked (only last 4 digits visible)
- CVV is NEVER stored in the system

---

### Confirm Order
Confirm and place the order. This validates all order requirements.

**Endpoint:** `POST /orders/confirm`

**Request Body:**
```json
{
  "orderId": "order-uuid"
}
```

**Response:**
```json
{
  "id": "order-uuid",
  "status": "confirmed",
  "updatedAt": "2025-10-28T08:00:00.000Z"
}
```

**Validation:**
- Order must have at least one item
- Delivery address must be set
- Payment information must be set
- **Allergen Check**: System checks if customer has allergies that conflict with ordered pizzas
  - If conflict found, order confirmation fails with error

**Error Response (Allergen Conflict):**
```json
{
  "error": "Order contains items with customer allergens"
}
```

---

### Cancel Order
Cancel an existing order.

**Endpoint:** `POST /orders/cancel`

**Request Body:**
```json
{
  "orderId": "order-uuid"
}
```

**Response:** Updated order with status "cancelled"

**Notes:**
- Cannot cancel delivered orders

---

### Get Order Total
Calculate the total cost of an order.

**Endpoint:** `GET /orders/:id/total`

**Response:**
```json
{
  "total": 45.50
}
```

---

## Customer Endpoints

### Create Customer
Register a new customer.

**Endpoint:** `POST /customers`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234"
}
```

**Validation:**
- `name`: Required, non-empty
- `email`: Required, valid email format
- `phone`: Required, non-empty

**Response:**
```json
{
  "id": "customer-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "allergies": [],
  "createdAt": "2025-10-28T08:00:00.000Z"
}
```

---

### Get Customer by ID
Retrieve customer information.

**Endpoint:** `GET /customers/:id`

**Response:**
```json
{
  "id": "customer-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "allergies": [...]
}
```

---

### Update Customer
Update customer information.

**Endpoint:** `PUT /customers/:id`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-5678"
}
```

**Response:** Updated customer object

---

### Add Allergy (Secure Storage)
Add an allergy to a customer's profile. **Allergies are encrypted before storage.**

**Endpoint:** `POST /customers/allergies/add`

**Request Body:**
```json
{
  "customerId": "customer-uuid",
  "allergy": {
    "name": "peanuts",
    "severity": "severe",
    "notes": "Anaphylaxis risk"
  }
}
```

**Validation:**
- `name`: Required
- `severity`: Required, must be "mild", "moderate", or "severe"
- `notes`: Optional

**Response:**
```json
{
  "id": "customer-uuid",
  "allergies": [
    {
      "name": "peanuts",
      "severity": "severe",
      "notes": "Anaphylaxis risk",
      "_encrypted": true
    }
  ]
}
```

**Security:**
- Allergy data is encrypted using bcrypt before storage
- In production, use AES-256 encryption
- `_encrypted` flag indicates secure storage

---

### Remove Allergy
Remove an allergy from customer's profile.

**Endpoint:** `POST /customers/allergies/remove`

**Request Body:**
```json
{
  "customerId": "customer-uuid",
  "allergyName": "peanuts"
}
```

**Response:** Updated customer object

---

### Get Customer Allergies
Retrieve all allergies for a customer.

**Endpoint:** `GET /customers/:id/allergies`

**Response:**
```json
[
  {
    "name": "peanuts",
    "severity": "severe",
    "notes": "Anaphylaxis risk",
    "_encrypted": true
  },
  {
    "name": "dairy",
    "severity": "moderate",
    "notes": "",
    "_encrypted": true
  }
]
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting
Currently no rate limiting is implemented. Future versions will include rate limiting for production use.

---

## CORS
CORS is enabled for all origins in development. Configure appropriately for production.

---

## Data Storage
Current implementation uses in-memory storage. Data is lost when server restarts. For production, integrate with:
- PostgreSQL
- MongoDB
- MySQL

---

## Testing the API

### Using cURL

**Create a customer and order a pizza:**

```bash
# 1. Create customer
CUSTOMER=$(curl -s -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"555-0000"}')

CUSTOMER_ID=$(echo $CUSTOMER | jq -r '.id')

# 2. Get available pizzas
curl http://localhost:3000/api/pizzas

# 3. Create an order
ORDER=$(curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"customerId\":\"$CUSTOMER_ID\"}")

ORDER_ID=$(echo $ORDER | jq -r '.id')

# 4. Add pizza to order
curl -X POST http://localhost:3000/api/orders/add-pizza \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":\"$ORDER_ID\",\"pizzaId\":\"pizza-id\",\"quantity\":2}"
```

---

**Built with ❤️ for the love of pizza**
