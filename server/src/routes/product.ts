import { Router } from 'express'
import { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product'   
import { auth, authorize } from '../middleware/auth';

const router = Router();

router.route('/').get(getAllProducts).post(auth, authorize('vendor'), createProduct);
router.route('/:id').get(getProduct).patch(auth, authorize('vendor'), updateProduct).delete(auth, authorize('vendor'), deleteProduct);

export default router;