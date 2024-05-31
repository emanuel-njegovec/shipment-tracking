const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CustomerRefType = sequelize.define('CustomerRefType', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        href: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.STRING
    });
    return CustomerRefType;
};
