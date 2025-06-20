import { ObjectId } from 'mongodb';
import { MongoClient, Db, Collection } from 'mongodb';
import { ProjectDocument } from '../models/project.model.js';
import { connectToDatabase } from '../config/mongodb.js';

export default class ProjectService {
	private db: Db | null = null;

	private async getDatabase(): Promise<Db> {
		if (!this.db) {
			this.db = await connectToDatabase();
		}
		return this.db;
	}

	// Pobiera kolekcję projektów z bazy danych
	private async getCollection(): Promise<Collection> {
		const db = await this.getDatabase();
		return db.collection('projects');
	}

	// Pobiera wszystkie projekty z bazy danych
	async getAllProjects(): Promise<ProjectDocument[]> {
		const collection = await this.getCollection();
		const projects = await collection.find({}).toArray();
		return projects.map((project) => ({
			_id: project._id.toString(),
			name: project.name,
			description: project.description,
		}));
	}

	// Tworzy nowy projekt w bazie danych
	async createProject(
		name: string,
		description: string
	): Promise<ProjectDocument> {
		const collection = await this.getCollection();
		const result = await collection.insertOne({ name, description });
		return {
			_id: result.insertedId.toString(),
			name,
			description,
		};
	}

	// Wyszukuje projekt po id
	async findById(id: string): Promise<ProjectDocument | null> {
		const collection = await this.getCollection();
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (result) {
			return {
				_id: result._id.toString(),
				name: result.name,
				description: result.description,
			};
		}
		return null;
	}

	// Usuwa projekt z bazy danych
	async deleteProject(id: string): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount === 1;
	}

	// Aktualizuje projekt w bazie danych
	async updateProject(
		id: string,
		name: string,
		description: string
	): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { name, description } }
		);
		return result.modifiedCount === 1;
	}
}
