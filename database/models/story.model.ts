export interface StoryDocument {
	_id: string;
	name: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	projectId: string;
	createdDate: Date;
	status: 'todo' | 'doing' | 'done';
	ownerId: string;
	updatedAt?: Date;
}

export const StoryCollection = 'stories';
