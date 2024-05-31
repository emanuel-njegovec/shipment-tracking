const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ShipmentTracking = sequelize.define('ShipmentTracking', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        carrier: DataTypes.STRING,
        trackingCode: DataTypes.STRING,
        carrierTrackingUrl: DataTypes.STRING,
        trackingDate: DataTypes.DATE,
        status: {
            type: DataTypes.ENUM,
            values: ['initialized', 'inProcess', 'processed', 'shipped', 'inCustoms', 'delivered', 'returned', 'error']
        },
        statusChangeDate: DataTypes.DATE,
        statusChangeReason: DataTypes.STRING,
        weight: DataTypes.FLOAT,
        estimatedDeliveryDate: DataTypes.DATE,
        createDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    });
    return ShipmentTracking;
};