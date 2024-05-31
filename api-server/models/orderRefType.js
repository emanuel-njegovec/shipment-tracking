const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderRefType = sequelize.define('OrderRefType', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        href: DataTypes.STRING,
        name: DataTypes.STRING,
        referredType: DataTypes.STRING
    });
    return OrderRefType;
};
