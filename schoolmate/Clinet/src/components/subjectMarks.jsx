import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Alert, Modal, TextInput, Label } from "flowbite-react";
import { ThemeContext } from "../components/ThemeLayout";
import axios from "axios";

export default function SubjectMarks() {
  const { darkMode } = useContext(ThemeContext);
  const { subject, grade } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState({
    firstTerm: "",
    secondTerm: "",
    thirdTerm: "",
  });

  useEffect(() => {
    fetchStudentsByGrade();
  }, [grade]);

  const fetchStudentsByGrade = async () => {
    setLoading(true);
    try {
      setError("");
      const response = await axios.get(
        `http://localhost:3000/api/student/grade/${grade}`
      );
      setStudents(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const getMarksForSubject = (student) => {
    return student.marks?.find((m) => m.subject === subject) || {};
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);

    const existingMarks = getMarksForSubject(student);
    setMarks({
      firstTerm: existingMarks.firstTerm || "",
      secondTerm: existingMarks.secondTerm || "",
      thirdTerm: existingMarks.thirdTerm || "",
    });

    setOpenModal(true);
  };

  const handleSaveMarks = async () => {
    if (!selectedStudent) return;
  
    try {
      const payload = {
        subject,
        grade: Number(grade),
        marks: {
          firstTerm: marks.firstTerm === "" ? null : Number(marks.firstTerm),
          secondTerm: marks.secondTerm === "" ? null : Number(marks.secondTerm),
          thirdTerm: marks.thirdTerm === "" ? null : Number(marks.thirdTerm),
        }
      };
  
      await axios.post(
        `http://localhost:3000/api/student/${selectedStudent._id}/marks`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      setOpenModal(false);
      fetchStudentsByGrade();
    } catch (error) {
      console.error("Failed to save marks", error?.response?.data || error.message);
      setError(error?.response?.data?.error || "Failed to save marks.");
    }
  };

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {subject} Students in Grade {grade}
        </h1>
        <Button onClick={() => navigate(-1)} color="gray">
          Back
        </Button>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-4">
          <Alert color="failure">{error}</Alert>
        </div>
      )}

      {loading && <div className="max-w-6xl mx-auto mb-4 text-center">Loading...</div>}

      <div
        className="max-w-6xl mx-auto overflow-x-auto rounded-lg shadow"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
      >
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Student ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Grade & Section</Table.HeadCell>
            <Table.HeadCell>First Term</Table.HeadCell>
            <Table.HeadCell>Second Term</Table.HeadCell>
            <Table.HeadCell>Third Term</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {students.map((student) => {
              const m = getMarksForSubject(student);
              return (
                <Table.Row
                  key={student._id}
                  className={darkMode ? "bg-gray-800" : "bg-white"}
                >
                  <Table.Cell className="font-mono">
                    {student.studentEmail?.split("@")[0].toUpperCase()}
                  </Table.Cell>
                  <Table.Cell>{student.name}</Table.Cell>
                  <Table.Cell>{`${student.grade}${student.section}`}</Table.Cell>
                  <Table.Cell>{m.firstTerm ?? "-"}</Table.Cell>
                  <Table.Cell>{m.secondTerm ?? "-"}</Table.Cell>
                  <Table.Cell>{m.thirdTerm ?? "-"}</Table.Cell>
                  <Table.Cell>
                    <Button size="xs" onClick={() => handleEditClick(student)}>
                      Add/Edit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          {selectedStudent ? `Edit Marks for ${selectedStudent.name}` : "Edit Marks"}
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-4">
            <div>
              <Label htmlFor="firstTerm" value="First Term Marks" />
              <TextInput
                id="firstTerm"
                type="number"
                value={marks.firstTerm}
                onChange={(e) =>
                  setMarks((prev) => ({
                    ...prev,
                    firstTerm: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="secondTerm" value="Second Term Marks" />
              <TextInput
                id="secondTerm"
                type="number"
                value={marks.secondTerm}
                onChange={(e) =>
                  setMarks((prev) => ({
                    ...prev,
                    secondTerm: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="thirdTerm" value="Third Term Marks" />
              <TextInput
                id="thirdTerm"
                type="number"
                value={marks.thirdTerm}
                onChange={(e) =>
                  setMarks((prev) => ({
                    ...prev,
                    thirdTerm: e.target.value,
                  }))
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveMarks}>Save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
