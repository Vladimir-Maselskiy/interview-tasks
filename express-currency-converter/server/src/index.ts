import express from 'express';
import cors from 'cors';
import currencyRouter from './routes/currency';

const createHTTPServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: true }));

  app.use('/ping', (req, res) => {
    res.send('Pong!');
  });

  app.use('/currency', currencyRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
};

export const app = createHTTPServer();
