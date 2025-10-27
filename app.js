const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
