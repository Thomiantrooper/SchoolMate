import { useState, useEffect } from 'react';
import { Button, TextInput, Table } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';

export default function DashHome() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', grade: '', section: '' });
  const [editStudent, setEditStudent] = useState({ name: '', age: '', grade: '', section: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlider, setCurrentSlider] = useState(0);

  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditStudent({ ...editStudent, [e.target.name]: e.target.value });
  };

  const addStudent = (e) => {
    e.preventDefault();
    if (newStudent.name && newStudent.age && newStudent.grade && newStudent.section) {
      setIsLoading(true);
      setTimeout(() => {
        setStudents([...students, newStudent]);
        setNewStudent({ name: '', age: '', grade: '', section: '' });
        setIsLoading(false);
      }, 500);
    } else {
      alert('Please enter valid student details.');
    }
  };

  const updateStudent = () => {
    if (students.length > 0) {
      const updatedStudents = [...students];
      updatedStudents[students.length - 1] = editStudent;
      setStudents(updatedStudents);
      setEditStudent({ name: '', age: '', grade: '', section: '' });
      alert('Student record updated successfully!');
    }
  };

  const handleDelete = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('students');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className='max-w-4xl mx-auto p-5 w-full bg-white rounded-lg shadow-lg'>
      <h1 className='my-7 text-center font-semibold text-3xl text-gray-800'>School Management Dashboard</h1>
      
      <div className='flex justify-between'>
        <Button onClick={() => setCurrentSlider(0)}>Add Student</Button>
        <Button onClick={() => setCurrentSlider(1)}>Update Student</Button>
        <Button onClick={() => setCurrentSlider(2)}>Delete Student</Button>
      </div>
      
      {currentSlider === 0 && (
        <form className='flex flex-col gap-4 my-5' onSubmit={addStudent}>
          <TextInput type='text' name='name' placeholder='Student Name' value={newStudent.name} onChange={handleInputChange} />
          <TextInput type='number' name='age' placeholder='Age' value={newStudent.age} onChange={handleInputChange} />
          <TextInput type='text' name='grade' placeholder='Grade' value={newStudent.grade} onChange={handleInputChange} />
          <TextInput type='text' name='section' placeholder='Section' value={newStudent.section} onChange={handleInputChange} />
          <Button type='submit' disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Student'}</Button>
        </form>
      )}
      
      {currentSlider === 1 && students.length > 0 && (
        <form className='flex flex-col gap-4 my-5' onSubmit={(e) => { e.preventDefault(); updateStudent(); }}>
          <TextInput type='text' name='name' placeholder='Student Name' value={editStudent.name} onChange={handleEditChange} />
          <TextInput type='number' name='age' placeholder='Age' value={editStudent.age} onChange={handleEditChange} />
          <TextInput type='text' name='grade' placeholder='Grade' value={editStudent.grade} onChange={handleEditChange} />
          <TextInput type='text' name='section' placeholder='Section' value={editStudent.section} onChange={handleEditChange} />
          <Button type='submit'>Update Student</Button>
        </form>
      )}
      
      {currentSlider === 2 && (
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Age</Table.HeadCell>
            <Table.HeadCell>Grade</Table.HeadCell>
            <Table.HeadCell>Section</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredStudents.map((student, index) => (
              <Table.Row key={index}>
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.age}</Table.Cell>
                <Table.Cell>{student.grade}</Table.Cell>
                <Table.Cell>{student.section}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleDelete(index)}>Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      
      <div className='mt-6'>
        <h2 className='text-center text-2xl font-semibold text-gray-700 mb-4'>Student Records</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Age</Table.HeadCell>
            <Table.HeadCell>Grade</Table.HeadCell>
            <Table.HeadCell>Section</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {students.map((student, index) => (
              <Table.Row key={index}>
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.age}</Table.Cell>
                <Table.Cell>{student.grade}</Table.Cell>
                <Table.Cell>{student.section}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      
      <div className='mt-4 text-center'>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
