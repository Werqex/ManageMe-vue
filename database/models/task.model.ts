export interface TaskDocument {
	_id: string;
	name: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	storyId: string;
	estimatedHours: number;
	status: 'todo' | 'doing' | 'done';
	createdDate: Date;
	startDate?: Date;
	endDate?: Date;
	assignedUserId?: string;
	updatedAt?: Date;
}

export const TaskCollection = 'tasks';
