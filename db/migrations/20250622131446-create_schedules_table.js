export async function up (queryInterface, Sequelize) {
  return queryInterface.createTable('Schedules', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    monday: {
      type: Sequelize.STRING,
      allowNull: true
    },
    tuesday: {
      type: Sequelize.STRING,
      allowNull: true
    },
    wednesday: {
      type: Sequelize.STRING,
      allowNull: true
    },
    thursday: {
      type: Sequelize.STRING,
      allowNull: true
    },
    friday: {
      type: Sequelize.STRING,
      allowNull: true
    },
    saturday: {
      type: Sequelize.STRING,
      allowNull: true
    },
    sunday: {
      type: Sequelize.STRING,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
  })
}

export async function down (queryInterface) {
  return queryInterface.dropTable('Availability')
}

