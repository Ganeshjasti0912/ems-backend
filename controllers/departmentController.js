import Department from '../models/Department.js';
import mongoose from 'mongoose';

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addDepartment = async (req, res) => {
  try {
    const { deptName, description } = req.body;
    const newDepartment = new Department({ deptName, description });
    await newDepartment.save();
    res.status(201).json({ success: true, department: newDepartment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid department ID' });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { deptName, description } = req.body;

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { deptName, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    res.status(200).json({ success: true, department: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const deleteDepartment = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid department ID' });
    }

    const deleted = await Department.findById(id);
    await deleted.deleteOne()
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    res.status(200).json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
