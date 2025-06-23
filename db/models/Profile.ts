import { DataTypes } from 'sequelize'
import sequelize from '../index.ts'

export default sequelize.define(
  'Profile',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    preferred_gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preferred_age: {
      type: DataTypes.STRING,
      allowNull: false
    },
    play_level: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
)
