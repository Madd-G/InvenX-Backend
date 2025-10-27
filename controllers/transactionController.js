const db = require('../config/database');

const handleDbError = (res, err) => {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
};

const mapTransactionRow = (row) => ({
    id: row.id,
    transactionDate: row.transaction_date,
    categoryId: row.category_id,
    categoryName: row.category_name,
    amount: row.amount,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

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
        const mappedResults = results.map(mapTransactionRow);
        res.status(200).json(mappedResults);
    });
};

exports.getPaginatedTransactions = (req, res) => {
    const pageNumber = parseInt(req.query.page, 10) || 1;
    const limitNumber = parseInt(req.query.limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const countQuery = 'SELECT COUNT(*) AS total FROM transactions';
    const dataQuery = `
        SELECT t.id, t.transaction_date, t.category_id, c.category_name, t.amount, t.note,
               t.created_at, t.updated_at
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        ORDER BY t.transaction_date DESC, t.id DESC
        LIMIT ?, ?
    `;

    db.query(countQuery, (countErr, countResult) => {
        if (countErr) {
            return handleDbError(res, countErr);
        }

        const total = countResult[0]?.total || 0;
        const totalPages = limitNumber > 0 ? Math.ceil(total / limitNumber) : 0;

        db.query(dataQuery, [offset, limitNumber], (dataErr, results) => {
            if (dataErr) {
                return handleDbError(res, dataErr);
            }

            res.status(200).json({
                total,
                totalPages,
                currentPage: pageNumber,
                perPage: limitNumber,
                data: results.map(mapTransactionRow)
            });
        });
    });
};

exports.getTransactionsByCategoryPaginated = (req, res) => {
    const categoryId = parseInt(req.params.categoryId, 10);

    if (Number.isNaN(categoryId)) {
        return res.status(400).json({ error: 'Invalid categoryId parameter' });
    }

    const pageNumber = parseInt(req.query.page, 10) || 1;
    const limitNumber = parseInt(req.query.limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const countQuery = 'SELECT COUNT(*) AS total FROM transactions WHERE category_id = ?';
    const dataQuery = `
        SELECT t.id, t.transaction_date, t.category_id, c.category_name, t.amount, t.note,
               t.created_at, t.updated_at
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.category_id = ?
        ORDER BY t.transaction_date DESC, t.id DESC
        LIMIT ?, ?
    `;

    db.query(countQuery, [categoryId], (countErr, countResult) => {
        if (countErr) {
            return handleDbError(res, countErr);
        }

        const total = countResult[0]?.total || 0;
        const totalPages = limitNumber > 0 ? Math.ceil(total / limitNumber) : 0;

        db.query(dataQuery, [categoryId, offset, limitNumber], (dataErr, results) => {
            if (dataErr) {
                return handleDbError(res, dataErr);
            }

            res.status(200).json({
                categoryId,
                total,
                totalPages,
                currentPage: pageNumber,
                perPage: limitNumber,
                data: results.map(mapTransactionRow)
            });
        });
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
        res.status(200).json(mapTransactionRow(results[0]));
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
