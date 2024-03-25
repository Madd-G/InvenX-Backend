const db = require('../config/database');

exports.getAllCategories = (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
};

exports.createCategory = (req, res) => {
    const { category_name } = req.body;
    const insertQuery = `INSERT INTO categories (category_name) VALUES (?)`;
    db.query(insertQuery, [category_name], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Category created successfully' });
        }
    });
};

exports.getCategoryById = (req, res) => {
    const categoryId = req.params.id;
    const selectQuery = `SELECT * FROM categories WHERE id = ?`;
    db.query(selectQuery, [categoryId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

exports.updateCategory = (req, res) => {
    const categoryId = req.params.id;
    const { category_name } = req.body;
    const updateQuery = `UPDATE categories SET category_name=? WHERE id=?`;
    db.query(updateQuery, [category_name, categoryId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json({ message: 'Category updated successfully' });
        }
    });
};

exports.deleteCategory = (req, res) => {
    const categoryId = req.params.id;
    const deleteQuery = `DELETE FROM categories WHERE id=?`;
    db.query(deleteQuery, [categoryId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Category not found' });
        } else {
            res.status(200).json({ message: 'Category deleted successfully' });
        }
    });
};