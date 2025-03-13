import { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";

export default function AiWork() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeStatus, setActiveStatus] = useState({});
  const [classAssignments, setClassAssignments] = useState({});
  const [leaveRequests, setLeaveRequests] = useState({}); // Store leave data

  useEffect(() => {
    fetchUsers();
    fetchLeaveRequests();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user/users");
      const data = await res.json();

      const filteredTeachers = data.filter((user) => user.email.includes("staff"));
      const filteredStudents = data.filter((user) => user.email.includes("std"));

      filteredStudents.forEach((student) => {
        student.grade = determineGrade(student.email);
      });

      setTeachers(filteredTeachers);
      setStudents(filteredStudents);

      const statusData = {};
      data.forEach((user) => {
        statusData[user._id] = user.isActive || true;
      });
      setActiveStatus(statusData);

      autoAssignTeachers(filteredTeachers, statusData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const res = await fetch("/api/leave/requests");
      const data = await res.json();

      const leaveData = {};
      data.forEach((leave) => {
        leaveData[leave.teacherId] = leave.isApproved; // Track approved leaves
      });

      setLeaveRequests(leaveData);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const determineGrade = (email) => {
    const match = email.match(/std_(\d{1,3})/);
    if (!match) return "Unknown";

    const number = parseInt(match[1], 10);
    const grade = Math.min(Math.ceil(number / 100), 13);
    return `Grade ${grade}`;
  };

  const autoAssignTeachers = (teachers, statusData) => {
    const activeTeachers = teachers.filter(
      (t) => statusData[t._id] && !leaveRequests[t._id] // Exclude teachers on leave
    );

    let assignments = {};

    if (activeTeachers.length === 0) {
      for (let i = 1; i <= 13; i++) {
        assignments[`Grade ${i}`] = "No teacher available";
      }
    } else {
      for (let i = 1; i <= 13; i++) {
        const assignedTeacher = activeTeachers[i % activeTeachers.length];
        assignments[`Grade ${i}`] = assignedTeacher ? assignedTeacher.username : "No teacher available";
      }
    }
    setClassAssignments(assignments);
  };

  const toggleActiveStatus = async (userId) => {
    const newStatus = !activeStatus[userId];

    setActiveStatus((prev) => ({
      ...prev,
      [userId]: newStatus,
    }));

    await fetch(`/api/user/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: newStatus }),
    });

    autoAssignTeachers(teachers, { ...activeStatus, [userId]: newStatus });
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h2 className="text-2xl font-semibold text-center mb-5">AI Work Page</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-center">Teachers</h3>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {teachers.map((teacher) => (
                <Table.Row key={teacher._id}>
                  <Table.Cell>{teacher.username}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => toggleActiveStatus(teacher._id)}
                      color={leaveRequests[teacher._id] ? "red" : activeStatus[teacher._id] ? "green" : "red"}
                      disabled={leaveRequests[teacher._id]} // Disable button if teacher is on leave
                    >
                      {leaveRequests[teacher._id] ? "On Leave" : activeStatus[teacher._id] ? "Active" : "Inactive"}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-center">Students</h3>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Grade</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {students.map((student) => (
                <Table.Row key={student._id}>
                  <Table.Cell>{student.username}</Table.Cell>
                  <Table.Cell>{student.grade}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => toggleActiveStatus(student._id)}
                      color={activeStatus[student._id] ? "green" : "red"}
                    >
                      {activeStatus[student._id] ? "Active" : "Inactive"}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-center mb-3">Assigned Teachers</h3>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Grade</Table.HeadCell>
            <Table.HeadCell>Assigned Teacher</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {Object.entries(classAssignments).map(([grade, teacher]) => (
              <Table.Row key={grade}>
                <Table.Cell>{grade}</Table.Cell>
                <Table.Cell>{teacher}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
