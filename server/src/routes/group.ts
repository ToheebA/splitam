import { Router } from 'express'
import { createGroup, joinGroup } from '../controllers/group'   
import { auth, authorize } from '../middleware/auth';

const router = Router();

router.route('/').post(auth, authorize('buyer'), createGroup);
router.route('/:id').patch(auth, authorize('buyer'), joinGroup);

export default router;