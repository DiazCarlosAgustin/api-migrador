const express = require('express'); 
const migrateController = require('./src/controller/migrate.controller');
const Router = express.Router()

Router.get('/', migrateController.startMigration)

module.exports = Router