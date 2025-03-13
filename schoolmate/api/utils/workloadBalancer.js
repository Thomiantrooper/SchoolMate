function balanceWorkload(teachers, tasks) {
    let workload = {};
    let taskCount = tasks.length;
    let teacherCount = teachers.length;
  
    // Initialize workload for each teacher
    teachers.forEach(teacher => {
      workload[teacher.id] = 0; // Start with zero tasks for each teacher
    });
  
    // Distribute tasks evenly across teachers
    for (let i = 0; i < taskCount; i++) {
      const teacher = teachers[i % teacherCount];  // Distribute tasks round-robin
      workload[teacher.id]++;
    }
  
    return workload;
  }
  
  export default balanceWorkload;
  