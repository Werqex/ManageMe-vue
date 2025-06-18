import { ObjectId } from 'mongodb';
import { MongoClient, Db, Collection } from 'mongodb';
import { StoryDocument } from '../models/story.model.js';
import { connectToDatabase } from '../config/mongodb.js';

export class StoryService {
	private db: Db | null = null;

	private async getDatabase(): Promise<Db> {
		if (!this.db) {
			this.db = await connectToDatabase();
		}
		return this.db;
	}

	private async getCollection(): Promise<Collection> {
		const db = await this.getDatabase();
		return db.collection('stories');
	}

	async getStoriesByProject(projectId: string): Promise<StoryDocument[]> {
		const collection = await this.getCollection();
		const stories = await collection.find({ projectId }).toArray();
		return stories.map((story) => ({
			_id: story._id.toString(),
			name: story.name,
			description: story.description,
			priority: story.priority,
			projectId: story.projectId,
			createdDate: story.createdDate,
			status: story.status,
			ownerId: story.ownerId,
		}));
	}

	async createStory(
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		projectId: string,
		ownerId: string
	): Promise<StoryDocument> {
		const collection = await this.getCollection();
		const storyData = {
			name,
			description,
			priority,
			projectId,
			ownerId,
			createdDate: new Date(),
			status: 'todo' as const,
		};

		const result = await collection.insertOne(storyData);
		return {
			_id: result.insertedId.toString(),
			name,
			description,
			priority,
			projectId,
			ownerId,
			createdDate: storyData.createdDate,
			status: storyData.status,
		};
	}

	async findById(id: string): Promise<StoryDocument | null> {
		const collection = await this.getCollection();
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (result) {
			return {
				_id: result._id.toString(),
				name: result.name,
				description: result.description,
				priority: result.priority,
				projectId: result.projectId,
				createdDate: result.createdDate,
				status: result.status,
				ownerId: result.ownerId,
			};
		}
		return null;
	}

	async deleteStory(id: string): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount === 1;
	}

	async updateStory(
		id: string,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		status: 'todo' | 'doing' | 'done'
	): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { name, description, priority, status } }
		);
		return result.modifiedCount === 1;
	}
}

export default StoryService;
