import { useEffect, useState } from "react";
import { 
  Button, 
  Table, 
  TextInput, 
  Select, 
  Card, 
  Badge, 
  Modal, 
  Alert, 
  Spinner
} from "flowbite-react";
import { 
  HiOutlineCalendar, 
  HiOutlineUser, 
  HiOutlineDownload,
  HiOutlineLockOpen,
  HiOutlineLockClosed,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus
} from "react-icons/hi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TimetablePage() {
  const [users, setUsers] = useState([]);
  const [timetables, setTimetables] = useState({});
  const [blockedUsers, setBlockedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newSlot, setNewSlot] = useState({ 
    day: "Monday", 
    startTime: "08:00", 
    endTime: "09:00", 
    subject: "" 
  });
  const [editedSlot, setEditedSlot] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  useEffect(() => {
    fetchUsers();
    loadTimetablesFromLocalStorage();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/users");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      
      const data = await res.json();
      setUsers(data);

      const timetableData = {};
      const blockedData = {};
      for (const user of data) {
        try {
          const timetableRes = await fetch(`/api/timetable/${user._id}`);
          if (timetableRes.ok) {
            const timetable = await timetableRes.json();
            timetableData[user._id] = timetable.slots || generateDefaultTimetable(user);
            blockedData[user._id] = timetable.isBlocked || false;
          }
        } catch (error) {
          console.error(`Error fetching timetable for user ${user._id}:`, error);
          timetableData[user._id] = generateDefaultTimetable(user);
          blockedData[user._id] = false;
        }
      }
      setTimetables(timetableData);
      setBlockedUsers(blockedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ 
        text: "", 
        type: "failure" 
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultTimetable = (user) => {
    if (user.role === "teacher") {
      return [
        { day: "Monday", startTime: "09:00", endTime: "10:00", subject: "Math" },
        { day: "Tuesday", startTime: "10:00", endTime: "11:00", subject: "Science" },
        { day: "Wednesday", startTime: "11:00", endTime: "12:00", subject: "History" },
        { day: "Thursday", startTime: "12:00", endTime: "13:00", subject: "English" },
        { day: "Friday", startTime: "13:00", endTime: "14:00", subject: "Art" },
      ];
    }
    
    if (user.role === "student") {
      return [
        { day: "Monday", startTime: "08:00", endTime: "09:00", subject: "English" },
        { day: "Tuesday", startTime: "09:00", endTime: "10:00", subject: "Math" },
        { day: "Wednesday", startTime: "10:00", endTime: "11:00", subject: "Physics" },
        { day: "Thursday", startTime: "11:00", endTime: "12:00", subject: "Biology" },
        { day: "Friday", startTime: "12:00", endTime: "13:00", subject: "Chemistry" },
      ];
    }

    return [
      { day: "Monday", startTime: "09:00", endTime: "10:00", subject: "General Studies" },
      { day: "Tuesday", startTime: "10:00", endTime: "11:00", subject: "Arts" },
      { day: "Wednesday", startTime: "11:00", endTime: "12:00", subject: "Geography" },
      { day: "Thursday", startTime: "12:00", endTime: "13:00", subject: "Economics" },
      { day: "Friday", startTime: "13:00", endTime: "14:00", subject: "Physical Education" },
    ];
  };

  const loadTimetablesFromLocalStorage = () => {
    try {
      const savedTimetables = localStorage.getItem("timetables");
      if (savedTimetables) {
        setTimetables(JSON.parse(savedTimetables));
      }
    } catch (error) {
      console.error("Error loading timetables from localStorage:", error);
    }
  };

  const saveTimetablesToLocalStorage = () => {
    try {
      localStorage.setItem("timetables", JSON.stringify(timetables));
    } catch (error) {
      console.error("Error saving timetables to localStorage:", error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
    if (!timetables[userId] || timetables[userId].length === 0) {
      const defaultTimetable = generateDefaultTimetable(users.find((user) => user._id === userId));
      setTimetables({
        ...timetables,
        [userId]: defaultTimetable,
      });
      saveTimetablesToLocalStorage();
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      setLoading(true);
      const isBlocked = !blockedUsers[userId];
      setBlockedUsers({ ...blockedUsers, [userId]: isBlocked });

      if (isBlocked) {
        setTimetables({ ...timetables, [userId]: [] });
      } else {
        setTimetables({ 
          ...timetables, 
          [userId]: generateDefaultTimetable(users.find((user) => user._id === userId)) 
        });
      }

      const response = await fetch(`/api/timetable/${userId}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked }),
      });

      if (!response.ok) {
        throw new Error(" ");
      }

      saveTimetablesToLocalStorage();
      setMessage({ 
        text: `User ${isBlocked ? "blocked" : "unblocked"} successfully`, 
        type: "success" 
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      setMessage({ text: "", type: "failure" });
      // Revert changes on error
      setBlockedUsers({ ...blockedUsers, [userId]: !blockedUsers[userId] });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    if (!newSlot.subject) {
      setMessage({ text: "Please enter a subject", type: "failure" });
      return;
    }

    const updatedSlots = [...(timetables[selectedUser] || []), newSlot];
    setTimetables({ ...timetables, [selectedUser]: updatedSlots });
    setNewSlot({ day: "Monday", startTime: "08:00", endTime: "09:00", subject: "" });
    setShowAddModal(false);
    saveTimetablesToLocalStorage();
    setMessage({ text: "Time slot added successfully", type: "success" });
  };

  const handleEditSlot = (index) => {
    const slot = timetables[selectedUser][index];
    setEditedSlot({ index, ...slot });
  };

  const handleSaveEditedSlot = () => {
    const updatedSlots = [...timetables[selectedUser]];
    updatedSlots[editedSlot.index] = {
      day: editedSlot.day,
      startTime: editedSlot.startTime,
      endTime: editedSlot.endTime,
      subject: editedSlot.subject,
    };

    setTimetables({ ...timetables, [selectedUser]: updatedSlots });
    setEditedSlot(null);
    saveTimetablesToLocalStorage();
    setMessage({ text: "Time slot updated successfully", type: "success" });
  };

  const handleDeleteSlot = (index) => {
    const updatedSlots = [...timetables[selectedUser]];
    updatedSlots.splice(index, 1);
    setTimetables({ ...timetables, [selectedUser]: updatedSlots });
    saveTimetablesToLocalStorage();
    setMessage({ text: "Time slot deleted successfully", type: "success" });
  };

  const handleGeneratePDF = (userId) => {
    const user = users.find((u) => u._id === userId);
    const slots = timetables[userId] || [];

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text(`${user.username}'s Timetable`, 105, 15, { align: 'center' });
    
    // Status badge
    doc.setFontSize(12);
    if (blockedUsers[userId]) {
      doc.setTextColor(255, 0, 0);
      doc.text("CURRENTLY BLOCKED", 105, 25, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    } else {
      doc.setTextColor(0, 128, 0);
      doc.text("ACTIVE", 105, 25, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }

    // Table data
    const tableData = slots.map(slot => [
      slot.day,
      slot.subject,
      slot.startTime,
      slot.endTime
    ]);

    // Generate table
    autoTable(doc, {
      head: [['Day', 'Subject', 'Start Time', 'End Time']],
      body: tableData,
      startY: 30,
      styles: {
        halign: 'center',
        cellPadding: 5,
        fontSize: 10
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(`${user.username}_Timetable.pdf`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Timetable Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage schedules for all users
            </p>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <Alert color={message.type} className="mb-6" onDismiss={() => setMessage({ text: "", type: "" })}>
            {message.text}
          </Alert>
        )}

        {/* Users Table */}
        <Card className="mb-6 shadow-sm">
          <div className="overflow-x-auto">
            <Table hoverable className="min-w-full">
              <Table.Head className="bg-gray-100">
                <Table.HeadCell className="text-gray-700">User</Table.HeadCell>
                <Table.HeadCell className="text-gray-700">Role</Table.HeadCell>
                <Table.HeadCell className="text-gray-700">Status</Table.HeadCell>
                <Table.HeadCell className="text-gray-700">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {loading && users.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="text-center py-8">
                      <Spinner size="xl" />
                    </Table.Cell>
                  </Table.Row>
                ) : users.map((user) => (
                  <Table.Row key={user._id} className="hover:bg-gray-50">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <HiOutlineUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={user.role === "teacher" ? "blue" : "purple"} 
                        className="capitalize font-normal"
                      >
                        {user.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {blockedUsers[user._id] ? (
                        <Badge color="red" className="font-normal">
                          <HiOutlineLockClosed className="mr-1.5 h-3.5 w-3.5" />
                          Blocked
                        </Badge>
                      ) : (
                        <Badge color="green" className="font-normal">
                          <HiOutlineLockOpen className="mr-1.5 h-3.5 w-3.5" />
                          Active
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="xs" 
                          color="light"
                          className="border border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={() => handleSelectUser(user._id)}
                          disabled={loading}
                        >
                          View
                        </Button>
                        <Button 
                          size="xs" 
                          color="light"
                          className="border border-gray-300 text-gray-700 hover:bg-gray-100"
                          onClick={() => handleGeneratePDF(user._id)}
                          disabled={loading}
                        >
                          <HiOutlineDownload className="mr-1.5 h-3.5 w-3.5" />
                          PDF
                        </Button>
                        <Button 
                          size="xs" 
                          color={blockedUsers[user._id] ? "light" : "light"}
                          className={`border ${blockedUsers[user._id] ? "border-red-200 text-red-700 hover:bg-red-50" : "border-green-200 text-green-700 hover:bg-green-50"}`}
                          onClick={() => handleBlockUser(user._id)}
                          disabled={loading}
                        >
                          {blockedUsers[user._id] ? (
                            <>
                            <HiOutlineLockClosed className="mr-1.5 h-3.5 w-3.5" />
                            Block
                              
                            </>
                          ) : (
                            <>
                              <HiOutlineLockOpen className="mr-1.5 h-3.5 w-3.5" />
                              Unblock
                            </>
                          )}
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Card>

        {/* Selected User Timetable */}
        {selectedUser && (
          <Card className="shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                <HiOutlineCalendar className="inline mr-2 text-blue-600" />
                {users.find((u) => u._id === selectedUser)?.username}'s Timetable
                {blockedUsers[selectedUser] && (
                  <Badge color="red" className="ml-2">
                    Blocked
                  </Badge>
                )}
              </h3>
              {!blockedUsers[selectedUser] && (
                <Button 
                  onClick={() => setShowAddModal(true)} 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <HiOutlinePlus className="mr-2 h-4 w-4" />
                  Add Slot
                </Button>
              )}
            </div>

            {blockedUsers[selectedUser] ? (
              <Alert color="failure" className="bg-red-50 border border-red-200">
                <HiOutlineLockClosed className="h-5 w-5 text-red-600" />
                <span className="text-red-700">This user is currently blocked and cannot have timetable slots.</span>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table hoverable>
                  <Table.Head className="bg-gray-100">
                    <Table.HeadCell className="text-gray-700">Day</Table.HeadCell>
                    <Table.HeadCell className="text-gray-700">Subject</Table.HeadCell>
                    <Table.HeadCell className="text-gray-700">Time</Table.HeadCell>
                    <Table.HeadCell className="text-gray-700">Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {timetables[selectedUser]?.length > 0 ? (
                      timetables[selectedUser]?.map((slot, index) => (
                        <Table.Row key={index} className="hover:bg-gray-50">
                          <Table.Cell className="font-medium text-gray-800">
                            {slot.day}
                          </Table.Cell>
                          <Table.Cell className="text-gray-700">{slot.subject}</Table.Cell>
                          <Table.Cell className="text-gray-700">
                            {slot.startTime} - {slot.endTime}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex gap-2">
                              <Button 
                                size="xs" 
                                color="light"
                                className="border border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => handleEditSlot(index)}
                                disabled={loading}
                              >
                                <HiOutlinePencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                size="xs" 
                                color="light"
                                className="border border-red-200 text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteSlot(index)}
                                disabled={loading}
                              >
                                <HiOutlineTrash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row>
                        <Table.Cell colSpan={4} className="text-center py-4 text-gray-500">
                          No timetable slots found
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            )}
          </Card>
        )}

        {/* Add Slot Modal */}
        <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
          <Modal.Header className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add New Time Slot</h3>
          </Modal.Header>
          <Modal.Body className="py-4">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Day
                </label>
                <Select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <Select
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <Select
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Subject
                </label>
                <TextInput
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                  placeholder="Enter subject name"
                  required
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-t pt-4">
            <Button 
              color="light" 
              onClick={() => setShowAddModal(false)}
              className="border border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSlot}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Add Slot"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Slot Modal */}
        {editedSlot && (
          <Modal show={!!editedSlot} onClose={() => setEditedSlot(null)}>
            <Modal.Header className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit Time Slot</h3>
            </Modal.Header>
            <Modal.Body className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Day
                  </label>
                  <Select
                    value={editedSlot.day}
                    onChange={(e) => setEditedSlot({ ...editedSlot, day: e.target.value })}
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <Select
                      value={editedSlot.startTime}
                      onChange={(e) => setEditedSlot({ ...editedSlot, startTime: e.target.value })}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <Select
                      value={editedSlot.endTime}
                      onChange={(e) => setEditedSlot({ ...editedSlot, endTime: e.target.value })}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <TextInput
                    value={editedSlot.subject}
                    onChange={(e) => setEditedSlot({ ...editedSlot, subject: e.target.value })}
                    placeholder="Enter subject name"
                    required
                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-t pt-4">
              <Button 
                color="light" 
                onClick={() => setEditedSlot(null)}
                className="border border-gray-300 text-gray-700 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEditedSlot}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" /> : "Save Changes"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}