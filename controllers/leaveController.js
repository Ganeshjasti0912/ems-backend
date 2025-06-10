import path from "path";
import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    console.log("Incoming userId:", userId);

    // Check if employee exists for the given userId
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "No employee found for the provided userId",
      });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    return res.status(201).json({
      success: true,
      message: "Leave added successfully",
      data: newLeave,
    });

  } catch (error) {
    console.error("Error adding leave:", error);
    return res.status(500).json({
      success: false,
      error: "leave add server error",
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    const { id ,role} = req.params;
    let leaves

    // First, try fetching leaves using the employeeId directly
    if(role==="admin"){
     leaves = await Leave.find({ employeeId: id });
    }

    // If no leaves found, try to resolve userId to employeeId
    else {
      const employee = await Employee.findOne({ userId: id });

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: "No employee found for the provided userId",
        });
      }

      leaves = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({
      success: true,
      leaves,
    });

  } catch (error) {
    console.error("Error fetching leaves:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching leaves",
    });
  }
};


const getLeave = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: 'employeeId',
      populate: [{
        path: "department",
        select: "deptName"
      },
      {
        path: "userId",
        select: "name profileImage"
      }
      ]
    })

    return res.status(200).json({ success: true, leaves })

  } catch (error) {
    console.error("Error adding leave:", error);
    return res.status(500).json({
      success: false,
      error: "leave add server error",
    });
  }
}

const getLeaveDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await Leave.findById({ _id: id }).populate({
      path: 'employeeId',
      populate: [{
        path: "department",
        select: "deptName"
      },
      {
        path: "userId",
        select: "name profileImage"
      }
      ]
    })

    return res.status(200).json({ success: true, leave })

  } catch (error) {
    console.error("Error adding leave:", error);
    return res.status(500).json({
      success: false,
      error: "leave add server error",
    });
  }

}

const updateLeaves = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate({ _id: id }, { status: req.body.status });
    if (!leave) {
      return res.status(404).json({
        success: false,
        error: "Leave not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Leave status updated successfully",
      data: leave,
    });

  } catch (error) {
    console.error("Error adding leave:", error);
    return res.status(500).json({
      success: false,
      error: "leave update server error",
    });
  }

}

export { addLeave, getLeaves, getLeave, getLeaveDetail, updateLeaves };
