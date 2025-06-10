import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Employee from '../models/employee.js';
import multer from 'multer';
import Path from 'path';
import Department from '../models/department.js';

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }); // This handles `upload.single('image')`

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      employeeId,
      email,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create and save the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
      profileImage: req.file ? req.file.filename : null,
    });

    const savedUser = await newUser.save(); // ✅ Fix here

    // Create and save the employee
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();

    return res.status(201).json({ success: true, message: 'Employee added successfully' });

  } catch (error) {
    console.error('Error adding employee:', error); // ✅ Helps debugging
    return res.status(500).json({ success: false, error: error.message || 'Server error in adding employee' });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId',{password:0}).populate('department'); 
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error in fetching employees' });
  }
};

const getEmployee = async (req, res) => {
  const{ id } = req.params;
  try {
    let employees;
 employees = await Employee.findById(id).populate('userId',{password:0}).populate('department'); 
 if(!employees){
  employees= await Employee.findOne({userId:id}).populate('userId',{password:0}).populate('department'); 
 }
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error in fetching employees' });
  }
};

const updateEmployee = async (req, res) => {
  try{
    const { id } = req.params;
    const {
      name,
      maritalStatus,
      designation,
      salary,
      department,
    } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      employee.userId,
      { name } 
    );

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,{
        maritalStatus,
        designation,
        salary,
        department
      },
      { new: true } 
      );
      if (!updatedEmployee || !updatedUser) {
        return res.status(404).json({ success: false, error: 'Employee or User not found' });
        
      }
    return res.status(200).json({ success: true, message: 'Employee updated successfully', employee: updatedEmployee });

  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error in fetching employees' });
  }

}

const fetchEmployessByDeptId = async (req, res) => {
  const{ id } = req.params;
  try {
    const employees = await Employee.find({department:id}); 
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error in fetching employees by dept id' });
  }
}

export { addEmployee, upload, getEmployees, getEmployee , updateEmployee, fetchEmployessByDeptId };
