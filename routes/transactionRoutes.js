const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
router.get('/paginated', transactionController.getPaginatedTransactions);
router.get('/summary', transactionController.getSummary);
router.get('/category/:categoryId/summary', transactionController.getSummaryByCategory);
router.get('/category/:categoryId/paginated', transactionController.getTransactionsByCategoryPaginated);
router.post('/', transactionController.createTransaction);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
