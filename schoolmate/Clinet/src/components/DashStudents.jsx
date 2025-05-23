import { useState, useEffect, useContext } from 'react';
import { Button, TextInput, Card, Modal, Label } from 'flowbite-react';
import { db, collection, getDocs, updateDoc, deleteDoc, doc } from '../pages/firebaseConfig';
import { FaEdit, FaTrash } from "react-icons/fa";
import { ThemeContext } from "./ThemeLayout"; 

export default function DashStudents() {
  const { darkMode } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState({ id: '', name: '', age: '', grade: '', section: '' });
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [terminationReason, setTerminationReason] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const openEditModal = (student) => {
    setEditStudent({ ...student });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editStudent.name || !editStudent.age || !editStudent.grade || !editStudent.section) {
      alert("All fields are required!");
      return;
    }
    try {
      const studentRef = doc(db, "students", editStudent.id);
      await updateDoc(studentRef, editStudent);
      setStudents(students.map((s) => (s.id === editStudent.id ? editStudent : s)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!terminationReason.trim()) {
      alert("Please enter a reason for termination.");
      return;
    }
    try {
      await deleteDoc(doc(db, "students", studentToDelete.id));
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setIsDeleteModalOpen(false);
      setTerminationReason('');
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className={`p-6 flex flex-col items-center w-full min-h-[80vh] transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      {/* Header */}
      <div className={`w-full max-w-6xl flex justify-between items-center p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h1 className="text-2xl font-bold">🎓 Student Management</h1>
        <button 
          onClick={() => window.location.href = "/admin-student"} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded">
          Go to Admin Panel
        </button>
      </div>

      {/* Search Bar */}
      <div className={`w-full max-w-6xl p-4 rounded-lg shadow-md mb-6 transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <TextInput
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4"
        />
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
          <Card key={student.id} className={`p-5 rounded-xl shadow-lg transition-all duration-300 ${
            darkMode ? "bg-gray-700 text-white" : "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800"
          }`}>
            <div className="flex flex-col items-center text-center">
              <img src="/user.png" alt="Student" className="w-20 h-20 rounded-full border-4 border-gray-400 mb-3" />
              <p className="text-lg font-bold">{student.name}</p>
              <p className="opacity-80">Age: {student.age}</p>
              <p className="opacity-80">Grade: {student.grade}</p>
              <p className="opacity-80">Section: {student.section}</p>
            </div>
            <div className="flex justify-between mt-4">
              <Button size="xs" color="blue" onClick={() => openEditModal(student)}>
                <FaEdit />
              </Button>
              <Button size="xs" color="red" onClick={() => openDeleteModal(student)}>
                <FaTrash />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Student Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Student</Modal.Header>
        <Modal.Body>
          <Label>Name</Label>
          <TextInput value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} />
          <Label>Age</Label>
          <TextInput value={editStudent.age} onChange={(e) => setEditStudent({ ...editStudent, age: e.target.value })} />
          <Label>Grade</Label>
          <TextInput value={editStudent.grade} onChange={(e) => setEditStudent({ ...editStudent, grade: e.target.value })} />
          <Label>Section</Label>
          <TextInput value={editStudent.section} onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleUpdate}>Update</Button>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete {studentToDelete?.name}?</p>
          <Label>Reason for Termination</Label>
          <TextInput value={terminationReason} onChange={(e) => setTerminationReason(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleDelete}>Delete</Button>
          <Button color="gray" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
