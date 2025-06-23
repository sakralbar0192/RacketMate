export default {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('Profiles', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      preferred_genders: {
        type: Sequelize.STRING,
        allowNull: false
      },
      preferred_ages: {
        type: Sequelize.STRING,
        allowNull: false
      },
      play_level: {
        type: Sequelize.STRING,
        allowNull: false
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
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Profiles')
  }
}
