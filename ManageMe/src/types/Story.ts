export type Story = {
	id: number;
	name: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	projectId: number;
	createdDate: string;
	status: 'todo' | 'doing' | 'done';
	ownerId: number;
};
