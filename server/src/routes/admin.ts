import { Router } from 'express'
import { getStats, getAllUsers, deleteUser } from '../controllers/admin'
import { auth, authorize } from '../middleware/auth'

const router = Router()

router.get('/stats', auth, authorize('admin'), getStats)
router.get('/users', auth, authorize('admin'), getAllUsers)
router.delete('/users/:id', auth, authorize('admin'), deleteUser)
export default router