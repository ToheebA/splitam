import {  Router } from 'express';
import { initializePayment, paystackWebhook } from '../controllers/payment';
import { auth, authorize } from '../middleware/auth';

const router = Router();

router.post('/initialize/:id', auth, authorize('buyer'), initializePayment);
router.post('/webhook', paystackWebhook);

export default router;