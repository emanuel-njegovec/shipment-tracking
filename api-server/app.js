const express = require('express');
const cors = require('cors');
const app = express();
const { Op } = require('sequelize');
const { sequelize, ShipmentTracking, Address, CustomerRefType, OrderRefType } = require('./models');

const port = 8080;

const shipmentTracking = require('./shipmentTracking.json');
const customerRefType = require('./models/customerRefType');

app.use(cors());

app.use(express.json());

/* app.get('/shipmentTracking/v1/shipmentTracking', (req, res) => {
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
}); */

app.get('/shipmentTracking/v1/shipmentTracking', async (req, res) => {
    const { customerId, status, orderId, page, size, sort } = req.query;

    // Create a query object
    let where = {};
    let include = [
        { model: Address, as: 'addressFrom' },
        { model: Address, as: 'addressTo' },
        { model: CustomerRefType, as: 'relatedCustomer' },
        { model: OrderRefType, as: 'order' }
    ];

    if (customerId) {
        include.find(assoc => assoc.as === 'relatedCustomer').where = { id: customerId };
    }
    if (status) {
        where.status = status;
    }
    if (orderId) {
        include.find(assoc => assoc.as === 'order').where = { id: orderId };
    }

    // Pagination parameters
    const pageSize = parseInt(size) || 10;
    const pageIndex = parseInt(page) || 0;
    const offset = pageIndex * pageSize;

    // Sorting parameters
    let order = [];
    if (sort) {
        const sortParams = sort.split(',');
        sortParams.forEach(param => {
            const direction = param.startsWith('-') ? 'DESC' : 'ASC';
            const field = param.replace(/^[-+]/, '');
            order.push([field, direction]);
        });
    }

    try {
        // Find documents with the query and apply pagination and sorting
        const shipments = await ShipmentTracking.findAll({
            where,
            include,
            order,
            offset,
            limit: pageSize
        });

        res.json(shipments);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* app.get('/shipmentTracking/v1/shipmentTracking/:id', (req, res) => {
    const id = req.params.id;
    const tracking = shipmentTracking.find(tracking => tracking.id === id);
    console.log(tracking);
    if (tracking) {
        res.json(tracking);
    } else {
        res.status(404).send('Tracking not found');
    }
}); */

app.get('/shipmentTracking/v1/shipmentTracking/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Find the tracking document by ID
        const tracking = await ShipmentTracking.findByPk(id, {
            include: [
                { model: Address, as: 'addressFrom' },
                { model: Address, as: 'addressTo' },
                { model: CustomerRefType, as: 'relatedCustomer' },
                { model: OrderRefType, as: 'order' }
            ]
        });

        if (tracking) {
            res.json(tracking);
        } else {
            res.status(404).send('Tracking not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

/* app.post('/shipmentTracking/v1/shipmentTracking', (req, res) => {
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
}); */

app.post('/shipmentTracking/v1/shipmentTracking', async (req, res) => {
    try {
        // Create the new shipment tracking record without the orders
        const newShipmentTracking = await ShipmentTracking.create({
            ...req.body,
            order: undefined // Remove the orders from the data
        }, {
            include: [
                { model: Address, as: 'addressFrom' },
                { model: Address, as: 'addressTo' },
                { model: CustomerRefType, as: 'relatedCustomer' }
            ]
        });

        // Create each order individually and associate it with the new shipment tracking record
        const orders = await Promise.all(req.body.order.map(async order => {
            const newOrder = await OrderRefType.create({
                ...order,
                ShipmentTrackingId: newShipmentTracking.id // Associate the order with the shipment tracking record
            });

            return newOrder;
        }));

        // Add the orders to the shipment tracking record
        newShipmentTracking.order = orders;

        res.status(201).json(newShipmentTracking);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

/* app.patch('/shipmentTracking/v1/shipmentTracking/:id', (req, res) => {
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
}); */

app.patch('/shipmentTracking/v1/shipmentTracking/:id', async (req, res) => {
    const id = req.params.id;
    const updateFields = req.body;
    console.log(updateFields);
    // Check if new order is being added and handle it accordingly

    const shipmentTracking = await ShipmentTracking.findByPk(id);
    if (!shipmentTracking) {
        return res.status(404).send({ error: 'ShipmentTracking not found' });
    }

    if (updateFields.relatedCustomer) {
        await CustomerRefType.upsert(updateFields.relatedCustomer);
        const relatedCustomer = await CustomerRefType.findByPk(updateFields.relatedCustomer.id);
        await shipmentTracking.setRelatedCustomer(relatedCustomer);
    }

    if (updateFields.addressFrom) {
        await Address.upsert(updateFields.addressFrom);
        const addressFrom = await Address.findByPk(updateFields.addressFrom.id);
        await shipmentTracking.setAddressFrom(addressFrom);
    }

    if (updateFields.addressTo) {
        await Address.upsert(updateFields.addressTo);
        const addressTo = await Address.findByPk(updateFields.addressTo.id);
        await shipmentTracking.setAddressTo(addressTo);
    }

    if (updateFields.order) {
        await Promise.all(updateFields.order.map(async order => {
            order.ShipmentTrackingId = shipmentTracking.id;
            console.log(order);
            await OrderRefType.upsert(order);
        }));
    }

    try {
    
        // Update the main record
        await shipmentTracking.update(updateFields);
    
        // Save the changes
        await shipmentTracking.save();
    
        res.json(shipmentTracking);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});