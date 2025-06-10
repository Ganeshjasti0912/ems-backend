import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

router.post('/add', authMiddleware, addDepartment);
router.get('/', authMiddleware, getDepartments);
router.get('/:id', authMiddleware, getDepartmentById);   // ✅ for GET by ID
router.put('/:id', authMiddleware, updateDepartment);  
router.delete('/:id', authMiddleware, deleteDepartment);  // ✅ for PUT

export default router;
