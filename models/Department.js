import mongoose from "mongoose";
import Employee from "./employee.js";
import Leave from "./Leave.js";
import Salary from "./Salary.js";
import User from "./User.js";


const departmentSchema = new mongoose.Schema({
  deptName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
departmentSchema.pre("deleteOne",{document: true, query: false}, async function(next) {
  try{
    await User.deleteMany({ department: this._id });
    const employees = await Employee.find({ department: this._id });
    const empIds = employees.map(emp=> emp._id);
    await Employee.deleteMany({ department: this._id });
    await Leave.deleteMany({ employeeId: { $in: empIds } });
    await Salary.deleteMany({ employeeId: { $in: empIds } });
    next();
  }catch(error){
    next(error)
  }

})

const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
export default Department;