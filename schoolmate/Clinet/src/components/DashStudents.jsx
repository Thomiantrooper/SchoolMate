import { useState, useEffect } from 'react';
import { Button, TextInput, Card, Modal, Label } from 'flowbite-react';
import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from '../pages/firebaseConfig';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DashStudents() {
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
    <div className="bg-gray-100 text-gray-900 p-6 flex flex-col items-center w-full min-h-[80vh]">
      <div className="w-full max-w-6xl flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold">🎓 Student Management</h1>
        <button onClick={() => window.location.href = "/admin-student"} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded">
          Go to Admin Panel
        </button>
      </div>
      <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md mb-6">
        <TextInput
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
            <Card key={student.id} className="p-5 bg-gray-100 rounded-xl shadow-lg">
              <div className="flex flex-col items-center text-center">
                <img src="/user.png" alt="Student" className="w-20 h-20 rounded-full border-4 border-gray-400 mb-3" />
                <p className="text-lg font-bold text-gray-700">{student.name}</p>
                <p className="text-gray-600">Age: {student.age}</p>
                <p className="text-gray-600">Grade: {student.grade}</p>
                <p className="text-gray-600">Section: {student.section}</p>
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
      </div>
    </div>
  );
}
