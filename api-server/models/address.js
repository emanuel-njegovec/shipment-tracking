const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Address = sequelize.define('Address', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        streetNr: DataTypes.STRING,
        streetName: DataTypes.STRING,
        streetSuffix: DataTypes.STRING,
        postcode: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING
    });
    return Address;
};
