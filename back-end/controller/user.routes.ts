/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management & authentication
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: Something went wrong
 * 
 *     Role:
 *       type: string
 *       enum: [user, admin, guest]
 * 
 *     AuthenticationRequest:
 *       type: object
 *       required: [username, password]
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *         password:
 *           type: string
 *           format: password
 *           description: Password
 * 
 *     AuthenticationResponse:
 *       type: object
 *       properties:
 *         message: 
 *           type: string
 *         token:
 *           type: string
 *         username:
 *           type: string
 *         fullname:
 *           type: string
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
});

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of all users
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
 *     summary: Authenticate a user and recieve a JWT
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
userRouter.post('/login', rateLimit, validate(authRequestSchema), async(req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await userService.authenticate(req.body);
        res.status(200).json({ message: 'Authentication successful', ...response });
    } catch (error) {
        next(error);
    }
});

userRouter.post('/signup', validate(userInputSchema), async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user.toDTO());
    } catch (error) {
        next(error);
    }
});


export { userRouter };