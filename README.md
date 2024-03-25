# InvenX Backend

This is the backend repository for InvenX, a simple inventory management system.

## Installation

1. Clone the repository to your local machine:

    ```
    git clone git@github.com:Madd-G/invenx-backend.git
    ```

2. Navigate to the project directory:

    ```
    cd invenx_backend
    ```

3. Install dependencies using npm:

    ```
    npm install express mysql body-parser
    ```

## Database Configuration

The database configuration is stored in `config/database.js`. Update the MySQL connection details in this file as follows:

```javascript
const mysql = require('mysql');

const db = mysql.createConnection({
    host: '',       // Your MySQL host
    user: '',       // Your MySQL username
    password: '',   // Your MySQL password
    database: ''    // Your MySQL database name
});
```

## Running the Server

To start the server, run the following command:

```
node app.js
```

The server will start running at `http://localhost:3000`.

Alternatively, you can deploy the server to a platform like Railway, as follows:
- Sign up for an account on [Railway](https://railway.app/).
- Set up your project and link it to your GitHub repository.
- Configure your Railway project to deploy the Node.js backend.
- Once configured, deploy the project to Railway.
- Railway will provide you with a deployment URL where your server will be hosted, similar to what I have done in this project.
  
## API Endpoints

### Categories

- `GET /categories`: Get all categories.
- `POST /categories`: Create a new category.
- `GET /categories/:id`: Get a category by ID.
- `PUT /categories/:id`: Update a category by ID.
- `DELETE /categories/:id`: Delete a category by ID.

### Products

- `GET /products`: Get all products. Example: [https://invenx-backend.up.railway.app/products](https://invenx-backend.up.railway.app/products)
- `POST /products`: Create a new product.
- `GET /products/:id`: Get a product by ID.
- `PUT /products/:id`: Update a product by ID.
- `DELETE /products/:id`: Delete a product by ID.
- `DELETE /products`: Delete multiple products.
- `GET /products/paginated`: Get paginated products.
- `GET /products/search`: Search for products.

## Dependencies

This project uses the following dependencies:

- `express`: Web framework for Node.js.
- `mysql`: MySQL client for Node.js.
- `body-parser`: Middleware for handling JSON and URL encoded data.

Repository Mobile Application

The mobile application repository can be found at [https://github.com/Madd-G/invenx-app](https://github.com/Madd-G/invenx-app).
