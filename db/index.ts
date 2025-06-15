import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('postgres://dukhov:dukhov@db:5432/racket_mate')

try {
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

export default sequelize