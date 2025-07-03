import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // кеш на 5 хв

export const getCurrencies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cachedData = cache.get('currencies');

    if (cachedData) {
      console.log('Отримано з кешу');
      res.json(cachedData);
      return;
    }

    const response = await fetch(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const currencies = await response.json();

    // Зберігаємо в кеш
    cache.set('currencies', currencies);

    console.log('Отримано з API та кешовано');
    res.json(currencies);
  } catch (err) {
    console.error('Error in getCurrencies:', err);
    next(err);
  }
};
