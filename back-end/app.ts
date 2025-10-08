import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import helmet from 'helmet';
import { config } from './config';
import morgan from 'morgan';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(helmet());

const allowedOrigins = config.CORS_ORIGIN ? config.CORS_ORIGIN.split(',').map(o => o.trim()) : [];
const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined': 'dev'));

// Health
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.send("Welcome to the Kozarusa API");
});



// Error Middleware
app.use(errorHandler);

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

// 404
app.use((_req, res) => res.status(404).json({ message: 'Not found' }));
app.listen(port || 3000, () => {
    console.log(`kozarusa API is running on port ${port}.`);
});