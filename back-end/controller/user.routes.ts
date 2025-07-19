import express, { Request, Response } from 'express';
import * as userService from '../service/user.service';
import { UserType } from '../types';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users.map(user => user.toDTO()));
    } catch(err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
});

router.get('/id/:id', async(req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(Number(id));
        res.status(200).json(user?.toDTO);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message }); 
    }
});

router.get('/username/:username', async(req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const user = await userService.getUserByName(String(username));
        res.status(200).json(user?.toDTO);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async(req: Request, res: Response) => {
    try {
        const user = <UserType>req.body;
        const newUser = await userService.createUser(user);
        res.status(200).json(newUser.toDTO);
    } catch(err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        // implement login logic
    } catch(err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await userService.deleteUser(Number(id));
        res.status(200).json({ message: 'User deleted successfully' });
    } catch(err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
});

export default router;