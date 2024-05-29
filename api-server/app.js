const express = require('express');
const cors = require('cors');
const app = express();
const { v4: uuidv4 } = require('uuid');

const port = 8080;

const shipmentTracking = require('./shipmentTracking.json');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/shipmentTracking/v1/shipmentTracking', (req, res) => {
    const { customerId, status, orderId, page, size, sort } = req.query;
    // Filter shipment tracking records based on the query parameters
    let filteredShipments = shipmentTracking;
    if (customerId) {
        filteredShipments = filteredShipments.filter(tracking => tracking.relatedCustomer.id === customerId);
    }
    
    if (status) {
        filteredShipments = filteredShipments.filter(tracking => tracking.status === status);
    }
    if (orderId) {
        filteredShipments = filteredShipments.filter(tracking => tracking.order.some(order => order.id === orderId));
    }

    // Pagination
    const pageSize = parseInt(size) || 10;
    const pageIndex = parseInt(page) || 0;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedShipments = filteredShipments.slice(startIndex, endIndex);
    // Sorting
    if (sort) {
        const sortParams = sort.split(',');
        for (const param of sortParams) {
            const order = param.startsWith('-') ? -1 : 1;
            const field = param.replace(/^[-+]/, '');
            paginatedShipments.sort((a, b) => {
            return order * (a[field] < b[field] ? -1 : (a[field] > b[field] ? 1 : 0));
            });
        }
    }
    res.json(paginatedShipments);
});

app.get('/shipmentTracking/v1/shipmentTracking/:id', (req, res) => {
    const id = req.params.id;
    const tracking = shipmentTracking.find(tracking => tracking.id === id);
    console.log(tracking);
    if (tracking) {
        res.json(tracking);
    } else {
        res.status(404).send('Tracking not found');
    }
});

app.post('/shipmentTracking/v1/shipmentTracking', (req, res) => {
    const newShipmentTracking = {
        ...req.body,
        id: uuidv4(), // This will generate a new unique ID for the shipment
        customer: {
            ...req.body.customer,
            id: uuidv4(), // This will generate a new unique ID for the customer
        },
        order: req.body.order.map(order => ({
            ...order,
            id: uuidv4(), // This will generate a new unique ID for each order
        })),
    };
    shipmentTracking.push(newShipmentTracking);
    res.status(201).json(newShipmentTracking);
});

app.patch('/shipmentTracking/v1/shipmentTracking/:id', (req, res) => {
    const id = req.params.id;
    let updateFields = req.body;
    
    // Check if new order is being added
    if (updateFields.order) {
        updateFields = {
            ...updateFields,
            order: updateFields.order.map(order => ({
                ...order,
                id: order.id ? order.id : uuidv4(), // This will generate a new unique ID for each new order
            })),
        };
    }

    const index = shipmentTracking.findIndex(tracking => tracking.id === id);
    if (index === -1) {
        res.status(404).send('Tracking not found');
    }
    const updatedTracking = { ...shipmentTracking[index], ...updateFields };
    shipmentTracking[index] = updatedTracking;
    res.json(updatedTracking);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});