const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
