const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/search', productController.searchProducts);
router.get('/paginated', productController.getPaginatedProducts);
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.delete('/', productController.deleteBulkProducts);

module.exports = router;
