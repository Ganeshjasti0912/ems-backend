import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
export const addSalary = async (req, res) => {
    try {
        const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;

        const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

        // Create salary object
        const newSalary = new Salary({
            employeeId,
            basicSalary,
            allowances,
            deductions,
            netSalary: totalSalary,
            payDate
        });

        await newSalary.save();


        // Save salary to database (assuming you have a Salary model)
        // const newSalary = await Salary.create(salary);

        // Respond with success
        return res.status(201).json({ success: true, message: "Salary added successfully", data: newSalary });
    }
    catch (error) {
        console.error("Error adding salary:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}
export const getSalary = async (req, res) => {
    try {
        const { id,role } = req.params;
        let salary;
        if(role==="admin"){
                salary = await Salary.find({ employeeId: id }).populate('employeeId', 'employeeId'); // Populate employeeId with employee name

        }else{
            const employee = await Employee.findOne({ userId: id })
            salary = await Salary.find({ employeeId: employee._id }).populate('employeeId', 'employeeId');
        }
        return res.status(200).json({ success: true, salary });
    } catch (error) {
        console.error("Error fetching salaries:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}
