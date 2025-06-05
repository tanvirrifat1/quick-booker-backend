import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import seedAdmin from './DB';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';

let server: any;

const handleExit = (message: string, error?: any) => {
  if (error) errorLogger.error(message, error);
  else logger.info(message);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
};

process.on('uncaughtException', error =>
  handleExit('Uncaught Exception:', error),
);
process.on('unhandledRejection', error =>
  handleExit('Unhandled Rejection:', error),
);
process.on('SIGTERM', () =>
  handleExit('SIGTERM received, shutting down gracefully...'),
);

const startServer = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));
    await seedAdmin();

    const port = Number(config.port);
    server = app.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`♻️  Server running on port: ${port}`));
    });

    const io = new Server(server, {
      pingTimeout: 60000,
      cors: { origin: '*' },
    });
    socketHelper.socket(io);
    //@ts-ignore
    global.io = io;
  } catch (error) {
    handleExit('🤢 Failed to connect to the Database', error);
  }
};

startServer();
