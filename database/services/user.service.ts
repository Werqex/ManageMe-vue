import { ObjectId } from 'mongodb';
import { Db, Collection } from 'mongodb';
import { UserDocument } from '../models/user.model.js';
import { connectToDatabase } from '../config/mongodb.js';

export default class UserService {
	private db: Db | null = null;

	private async getDatabase(): Promise<Db> {
		if (!this.db) {
			this.db = await connectToDatabase();
		}
		return this.db;
	}

	private async getCollection(): Promise<Collection> {
		const db = await this.getDatabase();
		return db.collection('users');
	}

	async findById(id: string): Promise<UserDocument | null> {
		const collection = await this.getCollection();
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (result) {
			return {
				_id: result._id.toString(),
				firstName: result.firstName,
				lastName: result.lastName,
				role: result.role,
				login: result.login,
				password: result.password,
			};
		}
		return null;
	}

	async findByLogin(login: string): Promise<UserDocument | null> {
		const collection = await this.getCollection();
		const result = await collection.findOne({ login });
		if (result) {
			return {
				_id: result._id.toString(),
				firstName: result.firstName,
				lastName: result.lastName,
				role: result.role,
				login: result.login,
				password: result.password,
			};
		}
		return null;
	}

	async getAllUsers(): Promise<UserDocument[]> {
		const collection = await this.getCollection();
		const users = await collection.find({}).toArray();
		return users.map((user) => ({
			_id: user._id.toString(),
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			login: user.login,
			password: user.password,
		}));
	}

	async verifyPassword(
		plainPassword: string,
		userPassword: string
	): Promise<boolean> {
		return plainPassword === userPassword;
	}
}
