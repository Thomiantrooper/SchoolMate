import Task from '../model/Task.js';
import Teacher from '../model/Teacher.js';

// Workload balancing logic
const balanceWorkload = (teachers, tasks) => {
  let workload = {};
  let taskCount = tasks.length;
  let teacherCount = teachers.length;

  // Initialize workload for each teacher
  teachers.forEach((teacher) => {
    workload[teacher.id] = 0; // Start with zero tasks for each teacher
  });

  // Distribute tasks evenly across teachers
  for (let i = 0; i < taskCount; i++) {
    const teacher = teachers[i % teacherCount]; // Distribute tasks round-robin
    workload[teacher.id]++;
  }

  return workload;
};

// Fetch all tasks and teachers
const getWorkload = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo'); // Populate teacher info
    const teachers = await Teacher.find();

    // Call the workload balancing function
    const balancedWorkload = balanceWorkload(teachers, tasks);

    res.status(200).json({ tasks, teachers, balancedWorkload });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workload', error });
  }
};

// Assign task to teacher
const assignWorkload = async (req, res) => {
  const { taskId, teacherId } = req.body;

  try {
    const task = await Task.findById(taskId);
    const teacher = await Teacher.findById(teacherId);

    if (!task || !teacher) {
      return res.status(404).json({ message: 'Task or Teacher not found' });
    }

    task.assignedTo = teacherId;
    await task.save();

    teacher.assignedTasks.push(taskId);
    await teacher.save();

    res.status(200).json({ message: 'Task assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning task', error });
  }
};

// Star/Unstar task
const toggleStarTask = async (req, res) => {
  const { taskId } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isStarred = !task.isStarred; // Toggle star status
    await task.save();

    res.status(200).json({ message: `Task ${task.isStarred ? 'starred' : 'unstared'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating star status', error });
  }
};

export { getWorkload, assignWorkload, toggleStarTask };
