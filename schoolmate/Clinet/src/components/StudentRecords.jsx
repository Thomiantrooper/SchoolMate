import React, { useState } from "react";

const StudentRecords = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", grade: "A", attendance: "95%" },
    { id: 2, name: "Jane Smith", grade: "B+", attendance: "90%" },
    { id: 3, name: "Alice Johnson", grade: "A-", attendance: "92%" },
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Records</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.grade}</td>
              <td>{student.attendance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentRecords;