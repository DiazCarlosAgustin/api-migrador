const express = require('express'); 
const migrateController = require('./src/controller/migrate.controller');
const Router = express.Router()

Router.get('/', migrateController.startMigration)
Router.get('/client', migrateController.stratMigracionClients)

module.exports = Router