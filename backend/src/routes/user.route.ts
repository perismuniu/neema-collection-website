import {Router} from 'express'
import { isAdmin, isAuthenticated } from '../utils/auth.middleware';
import { getUsers, getUserSettings, updatePassword, updateProfile, updateUserSettings } from '../Controllers/user.controler';

const router = Router()

router.patch('/user/settings', isAuthenticated, isAdmin, updateUserSettings);
router.get('/user/settings', isAuthenticated, isAdmin, getUserSettings);
router.get('/customers', isAuthenticated, isAdmin, getUsers);
router.put('/update-profile', isAuthenticated, updateProfile);
router.put('/update-password', isAuthenticated, updatePassword);

export default router