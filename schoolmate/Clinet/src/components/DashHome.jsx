import { useEffect, useState } from 'react';
import { Card, Button, TextInput, Modal, Label } from 'flowbite-react';
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { db, collection, addDoc } from '../pages/firebaseConfig';

export default function DashHome() {
  const dispatch = useDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', grade: '', section: '' });
  const [image, setImage] = useState(null);

  // Logout handler
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Open & Close Add Modal
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewStudent({ name: '', age: '', grade: '', section: '' });
    setImage(null);
  };

  // Handle Image Upload (Local Storage)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Add Student to Firestore
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.age || !newStudent.grade || !newStudent.section) {
      alert("All fields are required!");
      return;
    }

    // Store details in Firestore (excluding image)
    await addDoc(collection(db, "students"), { ...newStudent });

    // Show success message
    alert("Student added successfully!");

    // Close Modal
    closeAddModal();
  };

  return (
    <motion.div className='max-w-5xl mx-auto p-5 w-full bg-white rounded-lg shadow-lg'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}>
      <h1 className='my-7 text-center font-semibold text-3xl text-gray-800'>School Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card>
            <h2 className="text-xl font-semibold text-gray-700">Total Students</h2>
            <p className="text-3xl font-bold text-blue-600">-</p>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card>
            <h2 className="text-xl font-semibold text-gray-700">Average Age</h2>
            <p className="text-3xl font-bold text-green-600">-</p>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 flex justify-center">
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button onClick={openAddModal} gradientDuoTone="greenToBlue">Add Student</Button>
        </motion.div>
      </div>

      <Modal show={isAddModalOpen} size="lg" onClose={closeAddModal}>
        <Modal.Header>Add New Student</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Label>Name</Label>
              <TextInput type="text" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="w-full p-2 border rounded-lg" />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Label>Age</Label>
                <TextInput type="number" value={newStudent.age} onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })} className="w-full p-2 border rounded-lg" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Label>Grade</Label>
                <TextInput type="text" value={newStudent.grade} onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })} className="w-full p-2 border rounded-lg" />
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Label>Section</Label>
              <TextInput type="text" value={newStudent.section} onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} className="w-full p-2 border rounded-lg" />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Label>Upload Student Image</Label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded-lg" />
            </motion.div>

            {image && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="flex justify-center">
                <img src={image} alt="Student Preview" className="mt-4 w-40 h-40 object-cover rounded-lg border" />
              </motion.div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button gradientDuoTone="greenToBlue" onClick={handleAddStudent}>Add Student</Button>
          </motion.div>
          <Button color="gray" onClick={closeAddModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}
