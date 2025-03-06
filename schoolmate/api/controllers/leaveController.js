import LeaveRequest from '../model/LeaveRequest.js';
import Teacher from '../model/Teacher.js';
import sendEmail from '../utils/email.js';


export const createLeaveRequest = async (req, res) => {
  const { staffId, leaveType, startDate, endDate, reason } = req.body;
  
  try {
    const leaveRequest = new LeaveRequest({
      staffId,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    
    await leaveRequest.save();
    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const assignTeacherForLeave = async (req, res) => {
  const { leaveId, teacherId } = req.body;
  
  try {
    const leaveRequest = await LeaveRequest.findById(leaveId);
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    leaveRequest.assignedTeacher = teacherId;
    leaveRequest.status = 'Active'; 

    await leaveRequest.save();

    
    await sendEmail(
      teacher.email,
      'New Period Assignment',
      `You have been assigned to take over the period during ${leaveRequest.startDate} to ${leaveRequest.endDate} for the leave request of staff ID: ${leaveRequest.staffId}.`
    );

    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate('assignedTeacher');
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
    try {
      const leaveRequests = await LeaveRequest.find().populate('staffId assignedTeacher');
      res.status(200).json(leaveRequests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };