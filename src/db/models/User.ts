import { DataTypes } from 'sequelize';
import sequelize from '../index.ts';

export default sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.NUMBER,
            allowNull: false,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
) ;
