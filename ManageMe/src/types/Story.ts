export type Story = {
	id: string;
	name: string;
	description: string;
	priority: 'low' | 'medium' | 'high';
	projectId: string;
	createdDate: string;
	status: 'todo' | 'doing' | 'done';
	ownerId: string;
};
