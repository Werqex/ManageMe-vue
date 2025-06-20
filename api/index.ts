import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';
import ProjectService from '../database/services/project.service.js';
import UserService from '../database/services/user.service.js';
import { StoryService } from '../database/services/story.service.js';
import { TaskService } from '../database/services/task.service.js';

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
let refreshTokens = new Set<string>();

const projectService = new ProjectService();
const userService = new UserService();
const storyService = new StoryService();
const taskService = new TaskService();

app.use(cors());
app.use(express.json());

// Project endpoints
app.get('/api/projects', verifyToken, async (req: any, res) => {
	try {
		const projects = await projectService.getAllProjects();
		res.json(projects);
	} catch (error) {
		console.error('Error fetching projects:', error);
		res.status(500).json({ error: 'Failed to fetch projects' });
	}
});

app.post('/api/projects', verifyToken, async (req: any, res) => {
	try {
		const { name, description } = req.body;
		const project = await projectService.createProject(name, description);
		res.json(project);
	} catch (error) {
		console.error('Error creating project:', error);
		res.status(500).json({ error: 'Failed to create project' });
	}
});

app.put('/api/projects/:id', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		const success = await projectService.updateProject(id, name, description);
		if (success) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Project not found' });
		}
	} catch (error) {
		console.error('Error updating project:', error);
		res.status(500).json({ error: 'Failed to update project' });
	}
});

app.delete('/api/projects/:id', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;

		const stories = await storyService.getStoriesByProject(id);

		for (const story of stories) {
			const tasks = await taskService.getTasksByStory(story._id);
			for (const task of tasks) {
				await taskService.deleteTask(task._id);
			}
		}

		for (const story of stories) {
			await storyService.deleteStory(story._id);
		}

		const success = await projectService.deleteProject(id);

		if (success) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Project not found' });
		}
	} catch (error) {
		console.error('Error deleting project:', error);
		res.status(500).json({ error: 'Failed to delete project' });
	}
});

// Endpointy autoryzacji używające bazy danych
app.post('/auth/login', async (req, res) => {
	try {
		const { login, password } = req.body;

		if (!login || !password) {
			return res.status(400).send('Login i hasło są wymagane');
		}

		// Znajdź użytkownika w bazie
		const user = await userService.findByLogin(login);
		if (!user) {
			return res.status(401).send('Nieprawidłowe dane logowania');
		}

		// Sprawdź hasło
		const isValidPassword = await userService.verifyPassword(
			password,
			user.password
		);
		if (!isValidPassword) {
			return res.status(401).send('Nieprawidłowe dane logowania');
		}

		// Generuj tokeny
		const token = generateToken(user._id.toString(), 3600);
		const refreshToken = generateToken(user._id.toString(), 7 * 24 * 3600);

		refreshTokens.add(refreshToken);

		// Zwróć dane bez hasła
		const userProfile = {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			login: user.login,
		};

		res.json({
			token,
			refreshToken,
			user: userProfile,
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).send('Błąd serwera');
	}
});

app.post('/auth/refresh', (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken || !refreshTokens.has(refreshToken)) {
		return res.status(403).send('Nieprawidłowy refresh token');
	}

	try {
		const decoded = jwt.verify(refreshToken, tokenSecret) as any;

		refreshTokens.delete(refreshToken);

		const newToken = generateToken(decoded.userId, 3600);
		const newRefreshToken = generateToken(decoded.userId, 7 * 24 * 3600);

		refreshTokens.add(newRefreshToken);

		res.json({
			token: newToken,
			refreshToken: newRefreshToken,
		});
	} catch (error) {
		res.status(403).send('Nieprawidłowy refresh token');
	}
});

app.get('/auth/me', verifyToken, async (req: any, res) => {
	try {
		const user = await userService.findById(req.user.userId);

		if (!user) {
			return res.status(404).send('Użytkownik nie znaleziony');
		}

		// Zwróć dane bez hasła
		const userProfile = {
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			login: user.login,
		};

		res.json(userProfile);
	} catch (error) {
		console.error('Get user error:', error);
		res.status(500).send('Błąd serwera');
	}
});

// Endpoint do listy użytkowników (dla frontendu)
app.get('/api/users', verifyToken, async (req: any, res) => {
	try {
		const users = await userService.getAllUsers();
		// Usuń hasła z odpowiedzi
		const usersWithoutPasswords = users.map((user) => ({
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			login: user.login,
		}));
		res.json(usersWithoutPasswords);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});

// Story endpoints
app.get(
	'/api/stories/project/:projectId',
	verifyToken,
	async (req: any, res) => {
		try {
			const { projectId } = req.params;
			const stories = await storyService.getStoriesByProject(projectId);
			res.json(stories);
		} catch (error) {
			console.error('Error fetching stories:', error);
			res.status(500).json({ error: 'Failed to fetch stories' });
		}
	}
);

app.post('/api/stories', verifyToken, async (req: any, res) => {
	try {
		const { name, description, priority, projectId, ownerId } = req.body;
		const story = await storyService.createStory(
			name,
			description,
			priority,
			projectId,
			ownerId
		);
		res.json(story);
	} catch (error) {
		console.error('Error creating story:', error);
		res.status(500).json({ error: 'Failed to create story' });
	}
});

app.put('/api/stories/:id', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;
		const { name, description, priority, status } = req.body;

		const success = await storyService.updateStory(
			id,
			name,
			description,
			priority,
			status
		);
		if (success) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Story not found' });
		}
	} catch (error) {
		console.error('Error updating story:', error);
		res.status(500).json({ error: 'Failed to update story' });
	}
});

app.delete('/api/stories/:id', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;

		const tasks = await taskService.getTasksByStory(id);

		for (const task of tasks) {
			await taskService.deleteTask(task._id);
		}

		const success = await storyService.deleteStory(id);

		if (success) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Story not found' });
		}
	} catch (error) {
		console.error('Error deleting story:', error);
		res.status(500).json({ error: 'Failed to delete story' });
	}
});

// Task endpoints
app.get('/api/tasks/story/:storyId', verifyToken, async (req: any, res) => {
	try {
		const { storyId } = req.params;
		const tasks = await taskService.getTasksByStory(storyId);
		res.json(tasks);
	} catch (error) {
		console.error('Error fetching tasks:', error);
		res.status(500).json({ error: 'Failed to fetch tasks' });
	}
});

app.post('/api/tasks', verifyToken, async (req: any, res) => {
	try {
		const { name, description, priority, storyId, estimatedHours } = req.body;
		const task = await taskService.createTask(
			name,
			description,
			priority,
			storyId,
			estimatedHours
		);
		res.json(task);
	} catch (error) {
		console.error('Error creating task:', error);
		res.status(500).json({ error: 'Failed to create task' });
	}
});

app.put('/api/tasks/:id', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;
		const { name, description, priority, estimatedHours } = req.body;

		const success = await taskService.updateTask(
			id,
			name,
			description,
			priority,
			estimatedHours
		);
		if (success) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Task not found' });
		}
	} catch (error) {
		console.error('Error updating task:', error);
		res.status(500).json({ error: 'Failed to update task' });
	}
});

app.delete('/api/tasks/:id', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;
		const success = await taskService.deleteTask(id);
		if (success) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Task not found' });
		}
	} catch (error) {
		console.error('Error deleting task:', error);
		res.status(500).json({ error: 'Failed to delete task' });
	}
});

app.post('/api/tasks/:id/assign', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.body;

		const success = await taskService.assignUserToTask(id, userId);
		if (success) {
			res.json({ success: true });
		} else {
			res.status(400).json({ error: 'Cannot assign user to this task' });
		}
	} catch (error) {
		console.error('Error assigning user to task:', error);
		res.status(500).json({ error: 'Failed to assign user to task' });
	}
});

app.post('/api/tasks/:id/complete', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;
		const success = await taskService.completeTask(id);
		if (success) {
			res.json({ success: true });
		} else {
			res.status(400).json({ error: 'Cannot complete this task' });
		}
	} catch (error) {
		console.error('Error completing task:', error);
		res.status(500).json({ error: 'Failed to complete task' });
	}
});

app.post('/api/tasks/:id/reset', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;
		const success = await taskService.resetTaskToTodo(id);
		if (success) {
			res.json({ success: true });
		} else {
			res.status(404).json({ error: 'Task not found' });
		}
	} catch (error) {
		console.error('Error resetting task:', error);
		res.status(500).json({ error: 'Failed to reset task' });
	}
});

app.get('/api/tasks/:id/details', verifyToken, async (req: any, res) => {
	try {
		const { id } = req.params;

		const result = await taskService.getTaskWithStory(id);

		if (!result) {
			return res.status(404).json({ error: 'Task or related story not found' });
		}

		res.json(result);
	} catch (error) {
		console.error('Error fetching task details:', error);
		res.status(500).json({ error: 'Failed to fetch task details' });
	}
});

app.listen(port, () => {
	console.log('Wszystko działa');
});

function generateToken(userId: string, expirationInSeconds: number = 3600) {
	const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
	const token = jwt.sign({ userId, exp }, tokenSecret, { algorithm: 'HS256' });
	return token;
}

function verifyToken(req: any, res: any, next: any) {
	const authHeader = req.headers['authorization'];
	const token = authHeader?.split(' ')[1];

	if (!token) return res.sendStatus(403);

	jwt.verify(token, tokenSecret, (err: any, user: any) => {
		if (err) {
			console.log(err);
			return res.status(401).send(err.message);
		}
		req.user = user;
		next();
	});
}
