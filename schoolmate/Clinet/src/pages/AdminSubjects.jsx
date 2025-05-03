import { useState, useContext, useEffect } from "react";
import { Button, Modal, TextInput, Label, Spinner, Table, Badge } from "flowbite-react";
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiPlus, HiPencil, HiTrash, HiUserGroup, HiBookOpen } from "react-icons/hi";

export default function AdminSubjects() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({ subjectName: "", grade: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/subject/all");
      setSubjects(response.data.sort((a, b) => a.grade - b.grade));
    } catch (err) {
      setError("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, subject = null) => {
    setModalType(type);
    setSelectedSubject(subject);
    if (type === "edit") {
      setFormData({
        subjectName: subject.subjectName,
        grade: subject.grade.toString()
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ subjectName: "", grade: "" });
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.subjectName || !formData.grade) {
      setError("All fields are required");
      return;
    }

    const grade = parseInt(formData.grade);
    if (grade < 6 || grade > 13) {
      setError("Grade must be 6-13");
      return;
    }

    try {
      setLoading(true);
      if (modalType === "add") {
        await axios.post("/api/subject/add", {
          subjectName: formData.subjectName,
          grade: grade
        });
      } else {
        await axios.put(`/api/subject/update/${selectedSubject._id}`, {
          subjectName: formData.subjectName,
          grade: grade
        });
      }
      fetchSubjects();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      setLoading(true);
      await axios.delete(`/api/subject/delete/${id}`);
      setSubjects(subjects.filter(s => s._id !== id));
    } catch (err) {
      setError("Failed to delete subject");
    } finally {
      setLoading(false);
    }
  };

  const gradeColors = {
    6: "blue", 7: "green", 8: "purple", 9: "pink",
    10: "indigo", 11: "yellow", 12: "red", 13: "cyan"
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <HiBookOpen className="text-blue-500" />
              Subjects Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all subjects and student records
            </p>
          </div>
          <Button
            onClick={() => openModal("add")}
            gradientDuoTone="cyanToBlue"
            size="sm"
          >
            <HiPlus className="mr-2" />
            Add Subject
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Subjects Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {loading && subjects.length === 0 ? (
            <div className="p-8 text-center">
              <Spinner size="xl" />
            </div>
          ) : subjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No subjects found
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Code</Table.HeadCell>
                <Table.HeadCell>Subject</Table.HeadCell>
                <Table.HeadCell>Grade</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {subjects.map(subject => (
                  <Table.Row key={subject._id}>
                    <Table.Cell className="font-mono text-sm">
                      {subject.subjectCode}
                    </Table.Cell>
                    <Table.Cell className="font-medium">
                      {subject.subjectName}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={gradeColors[subject.grade] || "gray"}>
                        Grade {subject.grade}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => openModal("edit", subject)}
                        >
                          <HiPencil />
                        </Button>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => navigate(`/subject-marks/${subject.subjectName}/${subject.grade}`)}
                        >
                          <HiUserGroup />
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(subject._id)}
                        >
                          <HiTrash />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>

      {/* Subject Modal */}
      <Modal show={modalOpen} onClose={closeModal} size="md">
        <Modal.Header>
          {modalType === "add" ? "Add Subject" : "Edit Subject"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {modalType === "edit" && (
              <div>
                <Label>Subject Code</Label>
                <TextInput
                  value={selectedSubject?.subjectCode || ""}
                  readOnly
                  disabled
                />
              </div>
            )}
            <div>
              <Label>Subject Name</Label>
              <TextInput
                value={formData.subjectName}
                onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                placeholder="Mathematics"
              />
            </div>
            <div>
              <Label>Grade Level (6-13)</Label>
              <TextInput
                type="number"
                min="6"
                max="13"
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                placeholder="10"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="light" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            gradientDuoTone="cyanToBlue"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : modalType === "add" ? "Add Subject" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}