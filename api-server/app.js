const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize, ShipmentTracking, Address, CustomerRefType, OrderRefType } = require('./models');

const port = 8080;

app.use(cors());

app.use(express.json());

app.get('/shipmentTracking/v1/shipmentTracking', async (req, res) => {
    const { customerId, status, orderId, page, size, sort } = req.query;

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

    const pageSize = parseInt(size) || 10;
    const pageIndex = parseInt(page) || 0;
    const offset = pageIndex * pageSize;

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

app.get('/shipmentTracking/v1/shipmentTracking/:id', async (req, res) => {
    const id = req.params.id;

    try {
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
        res.status(500).send('Server error');
    }
});

app.post('/shipmentTracking/v1/shipmentTracking', async (req, res) => {
    try {
        const newShipmentTracking = await ShipmentTracking.create({
            ...req.body,
            order: undefined
        }, {
            include: [
                { model: Address, as: 'addressFrom' },
                { model: Address, as: 'addressTo' },
                { model: CustomerRefType, as: 'relatedCustomer' }
            ]
        });
        const orders = await Promise.all(req.body.order.map(async order => {
            const newOrder = await OrderRefType.create({
                ...order,
                ShipmentTrackingId: newShipmentTracking.id
            });

            return newOrder;
        }));
        newShipmentTracking.order = orders;

        res.status(201).json(newShipmentTracking);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.patch('/shipmentTracking/v1/shipmentTracking/:id', async (req, res) => {
    const id = req.params.id;
    const updateFields = req.body;

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
            await OrderRefType.upsert(order);
        }));
    }

    try {
        await shipmentTracking.update(updateFields);

        await shipmentTracking.save();
    
        res.json(shipmentTracking);
    } catch (err) {
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