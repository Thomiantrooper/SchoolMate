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
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-blue-900 to-purple-900 flex justify-center items-start">
      <div className="w-full max-w-6xl mx-auto mt-10 ml-40">
        <Card className="p-6 shadow-2xl bg-opacity-90 backdrop-blur-lg bg-white dark:bg-gray-900 dark:bg-opacity-80 text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Manage Students</h2>
          
          <div className="flex justify-between mb-6">
            <TextInput
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/2 text-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
              <Card key={student.id} className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex flex-col items-center text-center">
                  <img src="/user.png" alt="Student" className="w-20 h-20 rounded-full border-4 border-gray-400 mb-3" />
                  <p className="text-lg font-bold text-gray-700 dark:text-white">{student.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">Age: {student.age}</p>
                  <p className="text-gray-600 dark:text-gray-400">Grade: {student.grade}</p>
                  <p className="text-gray-600 dark:text-gray-400">Section: {student.section}</p>
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
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal show={isEditModalOpen} size="lg" onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Student</Modal.Header>
        <Modal.Body>
          <Label>Name</Label>
          <TextInput type="text" value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} />
          
          <Label>Age</Label>
          <TextInput type="number" value={editStudent.age} onChange={(e) => setEditStudent({ ...editStudent, age: e.target.value })} />
          
          <Label>Grade</Label>
          <TextInput type="text" value={editStudent.grade} onChange={(e) => setEditStudent({ ...editStudent, grade: e.target.value })} />
          
          <Label>Section</Label>
          <TextInput type="text" value={editStudent.section} onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpdate}>Update</Button>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={isDeleteModalOpen} size="md" onClose={() => setIsDeleteModalOpen(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <Label>Reason for Termination</Label>
          <TextInput
            type="text"
            placeholder="Enter reason..."
            value={terminationReason}
            onChange={(e) => setTerminationReason(e.target.value)}
            className="mb-4"
          />
          <p className="text-red-500 text-lg">Are you sure you want to delete this student?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleDelete}>Confirm</Button>
          <Button color="gray" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
