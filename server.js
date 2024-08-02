const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection using Sequelize
const sequelize = new Sequelize('rest', 'postgres', 'root', {
    host: 'localhost', // или хост вашего сервера PostgreSQL
    dialect: 'postgres',
});

// Проверка подключения к базе данных
sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.log('Error: ' + err));

// Определение модели заказа
const Order = sequelize.define('Order', {
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
});
// Модель продукта
const Product = sequelize.define('Product', {
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});
// Синхронизация моделей с базой данных
sequelize.sync()
    .then(() => console.log('Order table has been created'))
    .catch(err => console.log('Error: ' + err));
// Маршрут для добавления продукта
app.post('/api/products', async (req, res) => {
    const { productName, productPrice, productDescription } = req.body;
    try {
        const newProduct = await Product.create({
            productName,
            productPrice,
            productDescription
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product', details: error.message });
    }
});

// Маршрут для получения всех продуктов
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// POST маршрут для создания заказа
app.post('/api/orders', async (req, res) => {
    const { productName, productPrice, quantity, customerName, customerAddress, customerPhone } = req.body;
    console.log('Received data:', req.body); // Логирование данных
    try {
        const newOrder = await Order.create({
            productName,
            productPrice,
            quantity,
            customerName,
            customerAddress,
            customerPhone
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
});

// GET маршрут для получения всех заказов (опционально)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Сервер слушает на порту
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
