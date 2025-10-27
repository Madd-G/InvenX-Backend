const db = require('../config/database');

const handleDbError = (res, err) => {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
};

exports.getAllTransactions = (req, res) => {
    const query = `
        SELECT t.id, t.transaction_date, t.category_id, c.category_name, t.amount, t.note,
               t.created_at, t.updated_at
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        ORDER BY t.transaction_date DESC, t.id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return handleDbError(res, err);
        }
        res.status(200).json(results);
    });
};

exports.createTransaction = (req, res) => {
    const { transaction_date, category_id, amount, note } = req.body;

    if (!transaction_date || !category_id || amount === undefined) {
        return res.status(400).json({
            error: 'transaction_date, category_id, and amount are required'
        });
    }

    const insertQuery = `
        INSERT INTO transactions (transaction_date, category_id, amount, note)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [transaction_date, category_id, amount, note || null], (err, result) => {
        if (err) {
            return handleDbError(res, err);
        }

        res.status(201).json({
            message: 'Transaction created successfully',
            transactionId: result.insertId
        });
    });
};

exports.getTransactionById = (req, res) => {
    const transactionId = req.params.id;
    const selectQuery = `
        SELECT t.id, t.transaction_date, t.category_id, c.category_name, t.amount, t.note,
               t.created_at, t.updated_at
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
    `;

    db.query(selectQuery, [transactionId], (err, results) => {
        if (err) {
            return handleDbError(res, err);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(results[0]);
    });
};

exports.updateTransaction = (req, res) => {
    const transactionId = req.params.id;
    const { transaction_date, category_id, amount, note } = req.body;

    if (!transaction_date || !category_id || amount === undefined) {
        return res.status(400).json({
            error: 'transaction_date, category_id, and amount are required'
        });
    }

    const updateQuery = `
        UPDATE transactions
        SET transaction_date = ?, category_id = ?, amount = ?, note = ?
        WHERE id = ?
    `;

    db.query(updateQuery, [transaction_date, category_id, amount, note || null, transactionId], (err, result) => {
        if (err) {
            return handleDbError(res, err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction updated successfully' });
    });
};

exports.deleteTransaction = (req, res) => {
    const transactionId = req.params.id;
    const deleteQuery = 'DELETE FROM transactions WHERE id = ?';

    db.query(deleteQuery, [transactionId], (err, result) => {
        if (err) {
            return handleDbError(res, err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    });
};
