const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const Address = require('./address')(sequelize);
const CustomerRefType = require('./customerRefType')(sequelize);
const OrderRefType = require('./orderRefType')(sequelize);
const ShipmentTracking = require('./shipmentTracking')(sequelize);

// Define associations
ShipmentTracking.belongsTo(Address, { as: 'addressFrom' });
ShipmentTracking.belongsTo(Address, { as: 'addressTo' });
ShipmentTracking.belongsTo(CustomerRefType, { as: 'relatedCustomer' });
ShipmentTracking.hasMany(OrderRefType, { as: 'order' });
OrderRefType.belongsTo(ShipmentTracking, { as: 'shipmentTracking' });

(async () => {
    await sequelize.sync();
})();

module.exports = {
    sequelize,
    Address,
    CustomerRefType,
    OrderRefType,
    ShipmentTracking
};
