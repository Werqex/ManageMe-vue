export type Task = {
	id: number;
	name: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	storyId: number;
	estimatedHours: number;
	status: 'todo' | 'doing' | 'done';
	createdDate: string;
	startDate?: string;
	endDate?: string;
	assignedUserId?: number;
};
