import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
let refreshTokens = new Set<string>();

// Mock użytkowników
const users = [
	{
		id: 1,
		firstName: 'Jan',
		lastName: 'Kowalski',
		role: 'admin' as const,
		login: 'admin',
		password: 'admin123',
	},
	{
		id: 2,
		firstName: 'Anna',
		lastName: 'Nowak',
		role: 'developer' as const,
		login: 'developer',
		password: 'dev123',
	},
	{
		id: 3,
		firstName: 'Piotr',
		lastName: 'Wiśniewski',
		role: 'devops' as const,
		login: 'devops',
		password: 'devops123',
	},
];

app.use(cors());
app.use(express.json());

// Endpointy autoryzacji

// Endpoint logowania
app.post('/auth/login', (req, res) => {
	const { login, password } = req.body;

	if (!login || !password) {
		return res.status(400).send('Login i hasło są wymagane');
	}

	// Znajdź użytkownika
	const user = users.find((u) => u.login === login && u.password === password);

	if (!user) {
		return res.status(401).send('Nieprawidłowe dane logowania');
	}

	// Generuj tokeny z userId
	const token = generateToken(user.id, 3600); // 1 godzina
	const refreshToken = generateToken(user.id, 7 * 24 * 3600); // 7 dni

	// Zapisz refresh token
	refreshTokens.add(refreshToken);

	// Zwróć dane bez hasła
	const userProfile = {
		id: user.id,
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
});

// Endpoint odświeżania tokenu
app.post('/auth/refresh', (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken || !refreshTokens.has(refreshToken)) {
		return res.status(403).send('Nieprawidłowy refresh token');
	}

	try {
		const decoded = jwt.verify(refreshToken, tokenSecret) as any;

		// Usuń stary refresh token
		refreshTokens.delete(refreshToken);

		// Generuj nowe tokeny
		const newToken = generateToken(decoded.userId, 3600);
		const newRefreshToken = generateToken(decoded.userId, 7 * 24 * 3600);

		// Zapisz nowy refresh token
		refreshTokens.add(newRefreshToken);

		res.json({
			token: newToken,
			refreshToken: newRefreshToken,
		});
	} catch (error) {
		res.status(403).send('Nieprawidłowy refresh token');
	}
});

// Endpoint pobierania danych zalogowanego użytkownika
app.get('/auth/me', verifyToken, (req: any, res) => {
	const user = users.find((u) => u.id === req.user.userId);

	if (!user) {
		return res.status(404).send('Użytkownik nie znaleziony');
	}

	// Zwróć dane bez hasła
	const userProfile = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		role: user.role,
		login: user.login,
	};

	res.json(userProfile);
});

app.get('/', (req, res) => {
	res.send('Hello World - simple api with JWT!');
});

app.post('/token', function (req, res) {
	const expTime = req.body.exp || 60;
	const token = generateToken(1, +expTime);
	const refreshToken = generateToken(1, 60 * 60);
	refreshTokens.add(refreshToken);
	res.status(200).send({ token, refreshToken });
});

app.post('/refreshToken', function (req, res) {
	const refreshTokenFromPost = req.body.refreshToken;
	if (!refreshTokens.has(refreshTokenFromPost)) {
		res.status(400).send('Bad refresh token!');
		return;
	}
	const expTime = req.headers.exp || 60;
	const token = generateToken(1, +expTime);
	const newRefreshToken = generateToken(1, 60 * 60);
	refreshTokens.delete(refreshTokenFromPost);
	refreshTokens.add(newRefreshToken);
	setTimeout(() => {
		res.status(200).send({ token, refreshToken: newRefreshToken });
	}, 3000);
});

app.get('/protected/:id/:delay?', verifyToken, (req, res) => {
	const id = req.params.id;
	const delay = req.params.delay ? +req.params.delay : 1000;
	setTimeout(() => {
		res.status(200).send(`{"message": "protected endpoint ${id}"}`);
	}, delay);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
	console.log('Available auth endpoints:');
	console.log('  POST /auth/login - Login user');
	console.log('  POST /auth/refresh - Refresh token');
	console.log('  GET /auth/me - Get current user data');
});

// Funkcja do generowania tokenu JWT
function generateToken(userId: number, expirationInSeconds: number = 3600) {
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
