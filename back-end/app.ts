import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRouter from './controller/user.routes';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// Routes
app.use('/users', userRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'kozarusa API is running...' });
});

app.get('/', (req, res) => {
    res.send("Welcome to the Kozarusa API");
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
    console.log(`kozarusa API is running on port ${port}.`);
});