import { DataTypes } from 'sequelize'
import sequelize from '../index.ts'

export default sequelize.define(
  'Availability',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    monday: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tuesday: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wednesday: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thursday: {
      type: DataTypes.STRING,
      allowNull: true
    },
    friday: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saturday: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sunday: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }
)
