# Buy & Sell Application

This application is a platform for users to buy and sell items. It includes functionalities for user registration, login, profile management, item management, order processing, and reviews.

## Features

- User Registration and Login
- Profile Management
- Item Management (Insert, Delete, Search)
- Order Processing (Create, Verify OTP, Regenerate OTP)
- Review System
- Cart Management

## Routes

### User Routes

- **POST /register**
  - Registers a new user.
  - Validations: 
    - `email`: Must be a valid email address.
    - `firstname`: Must be at least 2 characters long.
    - `password`: Must be at least 3 characters long.

- **POST /login**
  - Logs in an existing user.
  - Validations:
    - `email`: Must be a valid email address.
    - `password`: Must be at least 3 characters long.

- **GET /profile**
  - Retrieves the profile of the logged-in user.
  - Requires authentication.

- **POST /additemtocart**
  - Adds an item to the user's cart.
  - Requires authentication.

- **DELETE /removeitemfromcart/:id**
  - Removes an item from the user's cart by item ID.
  - Requires authentication.

- **GET /cart**
  - Retrieves all items in the user's cart.
  - Requires authentication.

- **DELETE /emptycart**
  - Empties the user's cart.
  - Requires authentication.

- **POST /editProfile**
  - Edits the user's profile.
  - Requires authentication.

- **GET /logout**
  - Logs out the user.
  - Requires authentication.

### Review Routes

- **POST /create**
  - Creates a new review for a seller.
  - Validations:
    - `sellerId`: Must be at least 2 characters long.
    - `review`: Must be at least 3 characters long.

- **GET /get**
  - Retrieves all reviews.

### Order Routes

- **POST /create**
  - Creates a new order.

- **GET /getBuyerOrders**
  - Retrieves all orders made by the buyer.

- **GET /getSellerOrders**
  - Retrieves all orders received by the seller.

- **POST /verifyOTP/:orderid**
  - Verifies the OTP for an order to complete the transaction.

- **POST /regenerateOtp/:orderid**
  - Regenerates the OTP for an order.

### Item Routes

- **POST /insert**
  - Inserts a new item.
  - Validations:
    - `name`: Must be at least 2 characters long.

- **POST /delete**
  - Deletes an item.
  - Validations:
    - `name`: Must be at least 3 characters long.

- **GET /search**
  - Searches for items.

- **GET /:id**
  - Retrieves an item by ID.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the server using `npm start`.

## Usage

- Use Postman or any API client to test the routes.
- Ensure to include authentication tokens for routes that require authentication.
