# InvenX Backend

Backend API untuk aplikasi InvenX - sistem manajemen keuangan pribadi dengan fitur pencatatan transaksi income dan expenses, inventory management, dan pelaporan finansial.

## Installation

1. Clone repository:
   ```bash
   git clone git@github.com:Madd-G/invenx-backend.git
   cd invenx-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup database MySQL dan jalankan schema SQL (lihat bagian Database Schema).

4. Update konfigurasi database di `config/database.js` atau gunakan environment variables.

## Configuration

### Environment Variables (Recommended)
Untuk deployment production, gunakan environment variables:
```bash
PORT=3000
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
```

### Local Configuration
Edit `config/database.js` untuk development lokal.

## Database Schema

```sql
-- Categories table
CREATE TABLE categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_name VARCHAR(191) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (category_name)
) ENGINE=InnoDB;

-- Insert default categories
INSERT INTO categories (category_name) VALUES ('income'), ('expenses');

-- Products table
CREATE TABLE products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(191) NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  product_group VARCHAR(191) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_products_category_id (category_id),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Transactions table
CREATE TABLE transactions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  transaction_date DATE NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_transactions_category_id (category_id),
  CONSTRAINT fk_transactions_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;
```

## Running the Server

Development:
```bash
node app.js
```

Server akan berjalan di `http://localhost:3000` (atau sesuai PORT environment variable).

## Deployment

### Railway
1. Sign up di [Railway](https://railway.app/)
2. Hubungkan repository GitHub
3. Set environment variables (PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
4. Deploy secara otomatis
5. Railway akan memberikan URL publik untuk API

### Alternatif Platform
- Render
- Fly.io
- Heroku
- VPS dengan Docker

## API Endpoints

**Note:** Semua response JSON menggunakan format **camelCase** untuk field names.

### Categories

- `GET /categories` - Ambil semua kategori
- `POST /categories` - Buat kategori baru
- `GET /categories/:id` - Ambil kategori berdasarkan ID
- `PUT /categories/:id` - Update kategori
- `DELETE /categories/:id` - Hapus kategori

**Response Format (camelCase):**
```json
{
  "id": 1,
  "categoryName": "income",
  "createdAt": "2025-10-27T01:47:18.000Z",
  "updatedAt": null
}
```

### Transactions

**CRUD Operations:**
- `GET /transactions` - Ambil semua transaksi
- `POST /transactions` - Buat transaksi baru
- `GET /transactions/:id` - Ambil transaksi berdasarkan ID
- `PUT /transactions/:id` - Update transaksi
- `DELETE /transactions/:id` - Hapus transaksi

**Pagination:**
- `GET /transactions/paginated?page=1&limit=10` - Ambil transaksi dengan pagination
- `GET /transactions/category/:categoryId/paginated?page=1&limit=10` - Transaksi per kategori dengan pagination

**Summary & Reports:**
- `GET /transactions/summary` - Ringkasan finansial keseluruhan (balance, income, expenses)
- `GET /transactions/category/:categoryId/summary` - Ringkasan per kategori

**Request Body (POST/PUT):**
```json
{
  "transactionDate": "2025-10-27",
  "categoryId": 1,
  "amount": 150000,
  "note": "Gaji bulanan"
}
```

**Response Format (camelCase):**
```json
{
  "id": 5,
  "transactionDate": "2025-10-27T00:00:00.000Z",
  "categoryId": 1,
  "categoryName": "income",
  "amount": 150000,
  "note": "Gaji bulanan",
  "createdAt": "2025-10-27T10:20:00.000Z",
  "updatedAt": null
}
```

**Summary Response:**
```json
{
  "balance": 50000,
  "income": 150000,
  "expenses": 100000
}
```

### Products

- `GET /products` - Ambil semua produk
- `POST /products` - Buat produk baru
- `GET /products/:id` - Ambil produk berdasarkan ID
- `PUT /products/:id` - Update produk
- `DELETE /products/:id` - Hapus produk
- `DELETE /products` - Hapus multiple produk (body: `{ "ids": [1, 2, 3] }`)
- `GET /products/paginated?page=1&limit=10` - Produk dengan pagination
- `GET /products/search?query=keyword` - Cari produk

**Response Format (camelCase):**
```json
{
  "id": 1,
  "productName": "Laptop",
  "categoryId": 1,
  "stock": 10,
  "productGroup": "Electronics",
  "price": 15000000,
  "createdAt": "2025-10-27T01:47:18.000Z",
  "updatedAt": null
}
```

## Dependencies

- **express** (^4.21.2) - Web framework
- **mysql** (^2.18.1) - MySQL client
- **body-parser** (^1.20.3) - Request body parsing middleware

## Project Structure

```
invenx-backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   ├── categoryController.js    # Category business logic
│   ├── productController.js     # Product business logic
│   └── transactionController.js # Transaction business logic
├── routes/
│   ├── categoryRoutes.js    # Category endpoints
│   ├── productRoutes.js     # Product endpoints
│   └── transactionRoutes.js # Transaction endpoints
├── app.js                   # Application entry point
├── package.json
└── README.md
```

## Related Repositories

Mobile Application: [https://github.com/Madd-G/invenx-app](https://github.com/Madd-G/invenx-app)

## License

ISC
