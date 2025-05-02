import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Alert } from "flowbite-react";
import { ThemeContext } from "../components/ThemeLayout";
import axios from "axios";

export default function SubjectMarks() {
  const { darkMode } = useContext(ThemeContext);
  const { subject, grade } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  

  useEffect(() => {
    fetchStudentsByGrade();
  }, [grade]);

  const fetchStudentsByGrade = async () => {
    try {
      setError("");
      const response = await axios.get(`http://localhost:3000/api/student/grade/${grade}`);
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load students.");
    }
  };

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"> {subject} Students in Grade {grade}  </h1>
        <Button onClick={() => navigate(-1)} color="gray">Back</Button>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alert color="failure">{error}</Alert>
        </div>
      )}

      <div className="max-w-6xl mx-auto overflow-x-auto rounded-lg shadow"
           style={{ background: darkMode ? "#1E293B" : "#ffffff" }}>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Student ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Personal Email</Table.HeadCell>
            <Table.HeadCell>Gender</Table.HeadCell>
            <Table.HeadCell>Section</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {students.map((student) => (
              <Table.Row key={student._id} className={darkMode ? "bg-gray-800" : "bg-white"}>
                <Table.Cell className="font-mono">
                  {student.studentEmail?.split("@")[0].toUpperCase()}
                </Table.Cell>
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.personalEmail}</Table.Cell>
                <Table.Cell>{student.gender}</Table.Cell>
                <Table.Cell>{student.section}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
