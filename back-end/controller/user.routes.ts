/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints for authentication and user management
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     Role:
 *       type: string
 *       enum: [user, admin, guest]
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: Something went wrong
 * 
 *     AuthenticationRequest:
 *       type: object
 *       required: [username, password]
 *       properties:
 *         username:
 *           type: string
 *           description: Case-insensitive username
 *         password:
 *           type: string
 *           format: password
 *           description: User Password
 *       example:
 *         username: amar
 *         password: VeryS3cure1
 * 
 *     AuthenticationResponse:
 *       type: object
 *       properties:
 *         message: 
 *           type: string
 *           description: Human-readable status message
 *         token:
 *           type: string
 *           description: Signed JWT access token
 *         username:
 *           type: string
 *         fullname:
 *           type: string
 *         role:
 *           #ref: '#/components/schemas/Role'
 *       example:
 *         message: Authentication successful
 *         token: ezaiuhIHUEZAZEBfiefzebf5ezfqefze864...
 *         username: amar
 *         fullname: Amar Mahmuljin
 *         role: admin
 * 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         username:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           $ref: '#/components/schemas/Role'
 *       example:
 *         id: 1
 *         username: amar
 *         firstName: Amar
 *         lastName: Mahmuljin
 *         email: amar@example.com
 *         role: admin
 * 
 *     UserInput:
 *       type: object
 *       required: [username, password, firstName, lastName, email, role]
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *           writeOnly: true
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *          $ref: '#/components/schemas/Role'
 *       example:
 *         username: amar
 *         password: VeryS3cure1
 *         firstName: Amar
 *         lastName: Mahmuljin
 *         email: amar@example.com
 *         role: user
 */
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import userService from '../service/user.service';
import { validate } from '../middleware/validate';
import { authRequestSchema, userInputSchema } from '../validation/user.schemas';
import { requireAuth, requireRole } from '../middleware/auth';

const userRouter = express.Router();

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Try again later.'},
});

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (not enough privileges)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get('/', requireAuth, requireRole(['admin']), async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users.map(u => u.toDTO()));
    } catch(error) {
        next(error); 
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Authenticate and receive a JWT
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthenticationRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error in request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.post('/login', loginLimiter, validate(authRequestSchema), async(req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await userService.authenticate(req.body);
        res.status(200).json({ message: 'Authentication successful', ...response });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Username or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error in request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */  
userRouter.post('/signup', validate(userInputSchema), async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user.toDTO());
    } catch (error) {
        next(error);
    }
});


export { userRouter };