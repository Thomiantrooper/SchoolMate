import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { ThemeContext } from "../components/ThemeLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminSubjects() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    grade: "",
  });
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/subject/all");

      // Sort by grade ascending as a secondary measure
      const sortedSubjects = response.data.sort((a, b) => a.grade - b.grade);
      setSubjects(sortedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setValidationError("Failed to fetch subjects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddSubjectModal = () => setIsAddSubjectModalOpen(true);
  const closeAddSubjectModal = () => {
    setIsAddSubjectModalOpen(false);
    resetSubjectForm();
    setValidationError("");
  };


const openEditSubjectModal = (subject) => {
  setSelectedSubject(subject);
  setNewSubject({
    subjectName: subject.subjectName,
    grade: subject.grade.toString(),
  });
  setIsEditSubjectModalOpen(true);
  setValidationError("");
};


const closeEditSubjectModal = () => {
  setIsEditSubjectModalOpen(false);
  resetSubjectForm();
  setValidationError("");
};

  const resetSubjectForm = () => {
    setNewSubject({
      subjectName: "",
      grade: "",
    });
  };

  const validateForm = () => {
    if (!newSubject.subjectName || !newSubject.grade) {
      setValidationError("Please fill in all fields before submitting.");
      return false;
    }

    const grade = parseInt(newSubject.grade);
    if (isNaN(grade) || grade < 6 || grade > 13) {
      setValidationError("Grade must be between 6 and 13.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleAddSubject = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const subjectData = {
        subjectName: newSubject.subjectName,
        grade: parseInt(newSubject.grade),
      };
      
      const response = await axios.post(
        "http://localhost:3000/api/subject/add", 
        subjectData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 201) {
        fetchSubjects();
        closeAddSubjectModal();
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      setValidationError(
        error.response?.data?.error || 
        "Failed to add subject. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubject = async () => {
    if (!validateForm()) return;
  
    try {
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:3000/api/subject/update/${selectedSubject._id}`,
        {
          subjectName: newSubject.subjectName,
          grade: parseInt(newSubject.grade),
        }
      );
      
      setSubjects(subjects.map(subject => 
        subject._id === selectedSubject._id ? response.data : subject
      ));
      closeEditSubjectModal();
    } catch (error) {
      console.error("Error updating subject:", error);
      setValidationError(
        error.response?.data?.error || 
        "Failed to update subject. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmDelete) return;
  
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:3000/api/subject/delete/${id}`);
      setSubjects(subjects.filter(subject => subject._id !== id));
    } catch (error) {
      console.error("Error deleting subject:", error);
      setValidationError(
        error.response?.data?.error || 
        "Failed to delete subject. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      {/* Header */}
      <div
        className="w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 bg-opacity-80 transition-all duration-300"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
      >
        <h1 className="text-2xl font-bold">Subjects Management</h1>
        <div className="flex gap-8">
          <div className="mt-8">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Button onClick={openAddSubjectModal} gradientDuoTone="greenToBlue" disabled={isLoading}>
                {isLoading ? "Loading..." : "Add Subject"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subjects Table */}
      <div
        className="w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300"
        style={{ background: darkMode ? "#1E293B" : "#ffffff" }}
      >
        <h2 className="text-lg font-semibold mb-3">📚 Subjects List</h2>
        {isLoading ? (
          <div className="text-center py-4">Loading subjects...</div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-4">No subjects found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left">Subject Code</th>
                  <th className="p-2 text-left">Subject Name</th>
                  <th className="p-2 text-left">Grade</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject._id} className="border-t">
                    <td className="p-2 font-mono">{subject.subjectCode}</td>
                    <td className="p-2">{subject.subjectName}</td>
                    <td className="p-2">Grade {subject.grade}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button size="xs" onClick={() => openEditSubjectModal(subject)} disabled={isLoading}>
                          Edit
                        </Button>
                        <Button size="xs" color="red" onClick={() => handleDeleteSubject(subject._id)}  disabled={isLoading}>
                          Delete
                        </Button>
                        <Button 
  size="xs" 
  color="green" 
  disabled={isLoading}
  onClick={() => navigate(`/subject-marks/${subject.subjectName}/${subject.grade}`)}
>
  View Students
</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <Modal
  show={isAddSubjectModalOpen || isEditSubjectModalOpen}
  size="lg"
  onClose={isAddSubjectModalOpen ? closeAddSubjectModal : closeEditSubjectModal}
>
  <Modal.Header>
    {isEditSubjectModalOpen ? "Edit Subject" : "Add New Subject"}
  </Modal.Header>
  <Modal.Body>
    <div className="space-y-4">
      {validationError && (
        <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
          {validationError}
        </div>
      )}

      {isEditSubjectModalOpen && (
        <div>
          <Label htmlFor="subjectCode">Subject Code</Label>
          <TextInput
            id="subjectCode"
            type="text"
            value={selectedSubject?.subjectCode || ''}
            className="w-full"
            readOnly
            disabled
          />
        </div>
      )}

      <div>
        <Label htmlFor="subjectName">Subject Name</Label>
        <TextInput
          id="subjectName"
          type="text"
          value={newSubject.subjectName}
          onChange={(e) => setNewSubject({ ...newSubject, subjectName: e.target.value })}
          className="w-full"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="grade">Grade (6-13)</Label>
        <TextInput
          id="grade"
          type="number"
          value={newSubject.grade}
          onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}
          min="6"
          max="13"
          className="w-full"
          required
          disabled={isLoading}
        />
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button 
      onClick={isEditSubjectModalOpen ? handleEditSubject : handleAddSubject} 
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : isEditSubjectModalOpen ? "Update" : "Add"} Subject
    </Button>
    <Button 
      color="gray" 
      onClick={isAddSubjectModalOpen ? closeAddSubjectModal : closeEditSubjectModal} 
      disabled={isLoading}
    >
      Cancel
    </Button>
  </Modal.Footer>
</Modal>


    </div>
  );
}