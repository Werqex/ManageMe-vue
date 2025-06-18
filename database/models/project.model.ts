export interface ProjectDocument {
	_id: string;
	name: string;
	description: string;
	updatedAt?: Date;
}

export const ProjectCollection = 'projects';
