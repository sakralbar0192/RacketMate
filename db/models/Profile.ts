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
    preferred_genders: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preferred_ages: {
      type: DataTypes.STRING,
      allowNull: false
    },
    play_level: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
)
