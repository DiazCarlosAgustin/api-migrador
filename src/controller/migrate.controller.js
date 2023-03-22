const migrateService = require("../services/migrate.service");

module.exports = {
	startMigration: async (req, res, next) => {
		const { newDatabase, oldDatabase, serviceId } = req.query;
		if (!newDatabase || !oldDatabase)
			res.send({
				message:
					"Se debe de ingresar newDatabase y oldDatabase en los query parameters",
			});

		if (!serviceId)
			res.send({
				message:
					"Se debe de ingresar el service id como query parameter 'serviceId'",
			});

		const { result, error } = await migrateService.getDataMigration(
			newDatabase,
			oldDatabase,
			serviceId,
		);

		if (error) res.send(error);

		res.json({ result, error });
	},

	stratMigracionClients: async (req, res, next) => {
		const { newDatabase, oldDatabase, serviceId } = req.query;
		if (!newDatabase || !oldDatabase) {
			res.send({
				message:
					"Se debe de ingresar newDatabase y oldDatabase en los query parameters",
			});
		}

		if (!serviceId) {
			res.send({
				message:
					"Se debe de ingresar el service id como query parameter 'serviceId'",
			});
		}


		const { result, error } = await migrateService.runMigrationClients(
			newDatabase,
			oldDatabase,
			serviceId,
		);

		if (error) res.send(error);

		res.json({ result, error }); 
	},
};
