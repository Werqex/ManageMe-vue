// database/config/mongodb.ts
import { MongoClient, Db } from 'mongodb';

let db: Db;
let client: MongoClient;

export const connectToDatabase = async (): Promise<Db> => {
	if (db) {
		return db;
	}

	const mongoUrl =
		process.env.MONGO_URL ||
		'mongodb+srv://werqexpolska:m2NFh1QbNmafzccC@manageme.c8ohtlx.mongodb.net/?retryWrites=true&w=majority&appName=ManageMe';

	try {
		client = new MongoClient(mongoUrl);
		await client.connect();
		db = client.db('manageme');
		console.log('Connected to MongoDB Atlas');
		return db;
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw error;
	}
};

export const closeConnection = async () => {
	if (client) {
		await client.close();
	}
};
