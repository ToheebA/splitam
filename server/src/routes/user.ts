import { Router } from 'express'
import { getAllUsers } from '../controllers/user'
import { auth, authorize } from '../middleware/auth'

const router = Router()

router.get('/', auth, authorize('admin'), getAllUsers)

export default router