const mysql = require("mysql");
require("dotenv").config();

const connectDb = async ({ host, user, password, database }) => {
	const connection = await mysql.createConnection({
		host,
		user,
		password,
		database,
	});

	return connection;
};

const runQuery = async (connection, query) => {
	return new Promise(async (resolve, reject) => {
		await connection.query(query, (error, result) => {
			if (error) reject(error), console.log(error);
			resolve(result);
		});
	}).then((result) => result);
};

const unifyData = async (data, newConnection, serviceId) => {
	for (const index in data) {
		const query = `SELECT BIN_TO_UUID(id) as id, p.articleId FROM products p WHERE p.articleId = ${data[index].origin_id} LIMIT 1`;
		setTimeout(async () => {
			const resultProduct = await runQuery(newConnection, query);
			if (resultProduct && resultProduct[0]) {
				const insert = `INSERT INTO relations (productId,serviceId,destinationProductId,erpId,coeficientStock, coeficientPrice) VALUES (uuid_to_bin('${resultProduct[0].id}'), uuid_to_bin('${serviceId}'), '${data[index].destination_id}', '${resultProduct[0].articleId}',${data[index].coeficiente_stk}, ${data[index].coeficiente})`;

				const resultInsert = await runQuery(newConnection, insert);
				if (resultInsert) {
					console.log(
						`Relacion insertada correctamente: ${data[index].destination_id} - product Id ${resultProduct[0].id}`,
					);
				} else {
					console.log(`Error al momento de inserta la relacion: ${data[index].destination_id} - product Id ${resultProduct[0].id}`);
				}
			} else {
				console.log(`Error al momento de inserta la relacion de: ${data[index].destination_id} - El art ID: ${data[index].origin_id} no existe`);
			}
		}, 1000);
	}
};

module.exports = {
	getDataMigration: async (newDatabase, oldDatabase, serviceId) => {
		const paramsNewDatabase = {
			host: process.env.DATABASE_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: newDatabase,
		};
		const paramsOldDatabase = {
			host: process.env.MYSQL_OLD_HOST,
			user: process.env.MYSQL_OLD_USER,
			password: process.env.MYSQL_OLD_PASSWORD,
			database: oldDatabase,
		};

		const oldConnection = await connectDb(paramsOldDatabase);
		const newConnection = await connectDb(paramsNewDatabase);

		const oldData = await runQuery(oldConnection, `SELECT * FROM relation`);
		try {
			await unifyData(oldData, newConnection, serviceId);
		} catch (error) {
			return { result: null, error: error.message };
		}

		return {
			result: "Se ejecuto la migracion de relaciones",
			error: false,
		};
	},
};
