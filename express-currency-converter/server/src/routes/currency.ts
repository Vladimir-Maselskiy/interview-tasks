import express from 'express';
import { getCurrencies } from '../controllers/getCurrencies';
const router = express.Router();

router.get('/', getCurrencies);

export default router;
