import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import cron from 'node-cron';

const app = express();

// Middleware
app.use(Morgan.successHandler, Morgan.errorHandler);
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

// Routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send(
    '<h1 style="text-align:center; color:#A55FEF; font-family:Verdana;">Hey, How can I assist you today!</h1>',
  );
});

// Error Handling
app.use(globalErrorHandler);
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [{ path: req.originalUrl, message: "API DOESN'T EXIST" }],
  });
});

export default app;
