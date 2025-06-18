import { ObjectId } from 'mongodb';
import { Db, Collection } from 'mongodb';
import { TaskDocument } from '../models/task.model.js';
import { StoryService } from './story.service.js';
import { connectToDatabase } from '../config/mongodb.js';

export class TaskService {
	private db: Db | null = null;

	private async getDatabase(): Promise<Db> {
		if (!this.db) {
			this.db = await connectToDatabase();
		}
		return this.db;
	}

	private async getCollection(): Promise<Collection> {
		const db = await this.getDatabase();
		return db.collection('tasks');
	}

	async getTasksByStory(storyId: string): Promise<TaskDocument[]> {
		const collection = await this.getCollection();
		const tasks = await collection.find({ storyId }).toArray();
		return tasks.map((task) => ({
			_id: task._id.toString(),
			name: task.name,
			description: task.description,
			priority: task.priority,
			storyId: task.storyId,
			estimatedHours: task.estimatedHours,
			status: task.status,
			createdDate: task.createdDate,
			startDate: task.startDate,
			endDate: task.endDate,
			assignedUserId: task.assignedUserId,
		}));
	}

	async createTask(
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		storyId: string,
		estimatedHours: number
	): Promise<TaskDocument> {
		const collection = await this.getCollection();
		const taskData = {
			name,
			description,
			priority,
			storyId,
			estimatedHours,
			status: 'todo' as const,
			createdDate: new Date(),
		};

		const result = await collection.insertOne(taskData);
		return {
			_id: result.insertedId.toString(),
			name,
			description,
			priority,
			storyId,
			estimatedHours,
			status: taskData.status,
			createdDate: taskData.createdDate,
		};
	}

	async findById(id: string): Promise<TaskDocument | null> {
		const collection = await this.getCollection();
		const result = await collection.findOne({ _id: new ObjectId(id) });
		if (result) {
			return {
				_id: result._id.toString(),
				name: result.name,
				description: result.description,
				priority: result.priority,
				storyId: result.storyId,
				estimatedHours: result.estimatedHours,
				status: result.status,
				createdDate: result.createdDate,
				startDate: result.startDate,
				endDate: result.endDate,
				assignedUserId: result.assignedUserId,
			};
		}
		return null;
	}

	async getTaskWithStory(
		taskId: string
	): Promise<{ task: TaskDocument; story: any } | null> {
		const collection = await this.getCollection();
		const task = await collection.findOne({ _id: new ObjectId(taskId) });

		if (!task) return null;

		const storyService = new StoryService();
		const story = await storyService.findById(task.storyId);

		if (!story) return null;

		return {
			task: {
				_id: task._id.toString(),
				name: task.name,
				description: task.description,
				priority: task.priority,
				storyId: task.storyId,
				estimatedHours: task.estimatedHours,
				status: task.status,
				createdDate: task.createdDate,
				startDate: task.startDate,
				endDate: task.endDate,
				assignedUserId: task.assignedUserId,
			},
			story,
		};
	}

	async deleteTask(id: string): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount === 1;
	}

	async updateTask(
		id: string,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		estimatedHours: number
	): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { name, description, priority, estimatedHours } }
		);
		return result.modifiedCount === 1;
	}

	async assignUserToTask(taskId: string, userId: string): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.updateOne(
			{ _id: new ObjectId(taskId) },
			{
				$set: {
					assignedUserId: userId,
					status: 'doing',
					startDate: new Date(),
				},
			}
		);
		return result.modifiedCount === 1;
	}

	async completeTask(taskId: string): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.updateOne(
			{ _id: new ObjectId(taskId) },
			{
				$set: {
					status: 'done',
					endDate: new Date(),
				},
			}
		);
		return result.modifiedCount === 1;
	}

	async resetTaskToTodo(taskId: string): Promise<boolean> {
		const collection = await this.getCollection();
		const result = await collection.updateOne(
			{ _id: new ObjectId(taskId) },
			{
				$set: {
					status: 'todo',
					assignedUserId: undefined,
					startDate: undefined,
					endDate: undefined,
				},
			}
		);
		return result.modifiedCount === 1;
	}

	async deleteTasksByStory(storyId: string): Promise<number> {
		const collection = await this.getCollection();
		const result = await collection.deleteMany({ storyId });
		return result.deletedCount;
	}
}
