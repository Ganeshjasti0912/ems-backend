import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addEmployee,upload,getEmployees,getEmployee,updateEmployee,fetchEmployessByDeptId
} from '../controllers/employeeController.js';

const router = express.Router();

 router.post('/add', authMiddleware,upload.single('image'), addEmployee);
router.get('/', authMiddleware, getEmployees); // ✅ for GET all employees
 router.get('/:id', authMiddleware, getEmployee);   // ✅ for GET by ID
 router.put('/:id', authMiddleware, updateEmployee); // ✅ for PUT
 router.get('/department/:id', authMiddleware, fetchEmployessByDeptId);  

export default router;
