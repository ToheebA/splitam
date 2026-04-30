import { Router } from 'express'
import { createGroup, getAllGroups, getGroup, joinGroup, updateGroup } from '../controllers/group'   
import { auth, optionalAuth, authorize } from '../middleware/auth';

const router = Router();

router.route('/').get(optionalAuth, getAllGroups).post(auth, authorize('buyer'), createGroup);
router.route('/:id').get(getGroup).patch(auth, authorize('buyer', 'admin'), updateGroup);
router.route('/:id/join').post(auth, authorize('buyer'), joinGroup);

export default router;