import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { handleStripeWebhook } from './webhooks/stripe.js';
import dashboardRoutes from './routes/dashboard.js'
import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscription.js';
import scoresRoutes from './routes/scores.js';
import charitiesRoutes from './routes/charities.js';
import drawsRoutes from './routes/draws.js';
import winnersRoutes from './routes/winners.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/dashboard',dashboardRoutes);

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/charities', charitiesRoutes);
app.use('/api/draws', drawsRoutes);
app.use('/api/winners', winnersRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;