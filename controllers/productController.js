const db = require('../config/database');

const mapProductRow = (row) => ({
    id: row.id,
    productName: row.product_name,
    categoryId: row.category_id,
    stock: row.stock,
    productGroup: row.product_group,
    price: row.price,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

exports.getAllProducts = (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const mappedResults = results.map(mapProductRow);
            res.status(200).json(mappedResults);
        }
    });
};

exports.createProduct = (req, res) => {
    const { product_name, category_id, stock, product_group, price } = req.body;
    const insertQuery = `INSERT INTO products (product_name, category_id, stock, product_group, price) 
                         VALUES (?, ?, ?, ?, ?)`;
    db.query(insertQuery, [product_name, category_id, stock, product_group, price], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Product created successfully' });
        }
    });
};

exports.getProductById = (req, res) => {
    const productId = req.params.id;
    const selectQuery = `SELECT * FROM products WHERE id = ?`;
    db.query(selectQuery, [productId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json(mapProductRow(results[0]));
        }
    });
};

exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { product_name, category_id, stock, product_group, price } = req.body;
    const updateQuery = `UPDATE products 
                         SET product_name=?, category_id=?, stock=?, product_group=?, price=?
                         WHERE id=?`;
    db.query(updateQuery, [product_name, category_id, stock, product_group, price, productId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json({ message: 'Product updated successfully' });
        }
    });
};

exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    const deleteQuery = `DELETE FROM products WHERE id=?`;
    db.query(deleteQuery, [productId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    });
};

exports.deleteBulkProducts = (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Invalid or empty IDs array' });
    }


    const escapedIds = ids.map(item => db.escape(item));


    const deleteQuery = `DELETE FROM products WHERE id IN (${escapedIds.join(',')})`;

    console.log('Deleting products with IDs:', ids);


    db.query(deleteQuery, (err, result) => {
        if (err) {
            an
            console.error('Error deleting products:', err);
            return res.status(500).json({ error: err.message });
        } else {

            console.log('Products deleted successfully:', result.affectedRows);
            return res.status(200).json({ message: `Successfully deleted ${result.affectedRows} products` });
        }
    });
};

exports.searchProducts = (req, res) => {
    const { query } = req.query;
    const searchQuery = `SELECT * FROM products WHERE product_name LIKE ?`;
    db.query(searchQuery, [`%${query}%`], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const mappedResults = results.map(mapProductRow);
            res.status(200).json(mappedResults);
        }
    });
};

exports.getPaginatedProducts = (req, res) => {
    const { page, limit, skip } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skipNumber = parseInt(skip) || 0;

    const startIndex = (pageNumber - 1) * limitNumber + skipNumber;
    const endIndex = pageNumber * limitNumber + skipNumber;

    const query = `SELECT * FROM products LIMIT ?, ?`;
    // const query = `SELECT * FROM products ORDER BY updated_at DESC LIMIT ?, ?`;


    db.query(query, [startIndex, limitNumber], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            const paginationData = {
                data: [],
                total: 0,
                skip: skipNumber,
                limit: limitNumber
            };
            res.status(200).json(paginationData);
        } else {
            db.query(`SELECT COUNT(*) AS total FROM products`, (err, countResult) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    const total = countResult[0].total;
                    const totalPages = Math.ceil(total / limitNumber);

                    const paginationData = {
                        total,
                        totalPages,
                        currentPage: pageNumber,
                        perPage: limitNumber,
                        data: results.map(mapProductRow)
                    };
                    res.status(200).json(paginationData);
                }
            });
        }
    });
};




