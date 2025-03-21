import { useEffect, useState } from "react";
import { Button, Table, TextInput, Select } from "flowbite-react";
import jsPDF from "jspdf";

export default function TimetablePage() {
  const [users, setUsers] = useState([]);
  const [timetables, setTimetables] = useState({});
  const [blockedUsers, setBlockedUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newSlot, setNewSlot] = useState({ day: "", startTime: "", endTime: "", subject: "" });
  const [editedSlot, setEditedSlot] = useState(null);

  useEffect(() => {
    fetchUsers();
    loadTimetablesFromLocalStorage();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user/users");
      const data = await res.json();
      setUsers(data);

      const timetableData = {};
      const blockedData = {};
      for (const user of data) {
        const res = await fetch(`/api/timetable/${user._id}`);
        const timetable = await res.json();
        timetableData[user._id] = timetable.slots || generateDefaultTimetable(user);
        blockedData[user._id] = timetable.isBlocked || false;
      }
      setTimetables(timetableData);
      setBlockedUsers(blockedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const generateDefaultTimetable = (user) => {
    
    if (user.role === "teacher") {
      return [
        { day: "Monday", startTime: "09:00", endTime: "10:00", subject: "Math" },
        { day: "Tuesday", startTime: "10:00", endTime: "11:00", subject: "Science" },
        { day: "Wednesday", startTime: "11:00", endTime: "12:00", subject: "History" },
        { day: "Thursday", startTime: "12:00", endTime: "01:00", subject: "English" },
        { day: "Friday", startTime: "01:00", endTime: "02:00", subject: "Art" },
      ];
    }
    
    if (user.role === "student") {
      return [
        { day: "Monday", startTime: "08:00", endTime: "09:00", subject: "English" },
        { day: "Tuesday", startTime: "09:00", endTime: "10:00", subject: "Math" },
        { day: "Wednesday", startTime: "10:00", endTime: "11:00", subject: "Physics" },
        { day: "Thursday", startTime: "11:00", endTime: "12:00", subject: "Biology" },
        { day: "Friday", startTime: "12:00", endTime: "01:00", subject: "Chemistry" },
      ];
    }

    
    return [
      { day: "Monday", startTime: "09:00", endTime: "10:00", subject: "General Studies" },
      { day: "Tuesday", startTime: "10:00", endTime: "11:00", subject: "Arts" },
      { day: "Wednesday", startTime: "11:00", endTime: "12:00", subject: "Geography" },
      { day: "Thursday", startTime: "12:00", endTime: "01:00", subject: "Economics" },
      { day: "Friday", startTime: "01:00", endTime: "02:00", subject: "Physical Education" },
    ];
  };

  const loadTimetablesFromLocalStorage = () => {
    const savedTimetables = localStorage.getItem("timetables");
    if (savedTimetables) {
      setTimetables(JSON.parse(savedTimetables));
    }
  };

  const saveTimetablesToLocalStorage = () => {
    localStorage.setItem("timetables", JSON.stringify(timetables));
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
    const isBlocked = !blockedUsers[userId];
    setBlockedUsers({ ...blockedUsers, [userId]: isBlocked });

    if (isBlocked) {
      setTimetables({ ...timetables, [userId]: [] });
    } else {
      setTimetables({ ...timetables, [userId]: generateDefaultTimetable(users.find((user) => user._id === userId)) });
    }

    await fetch(`/api/timetable/${userId}/block`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked }),
    });

    saveTimetablesToLocalStorage();
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
  };

  const handleGeneratePDF = (userId) => {
    const user = users.find((u) => u._id === userId);
    const slots = timetables[userId] || [];

    const doc = new jsPDF();
    doc.text(`${user.username}'s Timetable`, 10, 10);

    if (blockedUsers[userId]) {
      doc.text("User is OFF for today!", 10, 20);
    } else {
      slots.forEach((slot, index) => {
        doc.text(`${slot.day}: ${slot.subject} (${slot.startTime} - ${slot.endTime})`, 10, 20 + index * 10);
      });
    }

    doc.save(`${user.username}_Timetable.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-semibold text-center mb-5">User Timetable Management</h2>

      <Table>
        <Table.Head>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user._id}>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell className="flex gap-2">
                <Button onClick={() => handleSelectUser(user._id)}>Assign Timetable</Button>
                <Button onClick={() => handleGeneratePDF(user._id)}>Download PDF</Button>
                <Button
                  onClick={() => handleBlockUser(user._id)}
                  color={blockedUsers[user._id] ? "red" : "green"}
                >
                  {blockedUsers[user._id] ? "Unblock" : "Block"}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {selectedUser && !blockedUsers[selectedUser] && (
        <div className="mt-5">
          <h3 className="text-xl font-semibold">
            Timetable for {users.find((u) => u._id === selectedUser)?.username}
          </h3>

          <ul className="mt-3">
            {timetables[selectedUser]?.map((slot, index) => (
              <li key={index} className="border p-2 flex justify-between">
                <span>{slot.day}: {slot.subject} ({slot.startTime} - {slot.endTime})</span>
                <Button onClick={() => handleEditSlot(index)} color="blue">Edit</Button>
              </li>
            ))}
          </ul>

          {editedSlot && (
            <div className="mt-5">
              <h4 className="text-lg font-semibold">Edit Time Slot</h4>
              <div className="flex gap-2">
                <TextInput
                  value={editedSlot.day}
                  onChange={(e) => setEditedSlot({ ...editedSlot, day: e.target.value })}
                  placeholder="Day"
                />
                <TextInput
                  value={editedSlot.startTime}
                  onChange={(e) => setEditedSlot({ ...editedSlot, startTime: e.target.value })}
                  placeholder="Start Time"
                />
                <TextInput
                  value={editedSlot.endTime}
                  onChange={(e) => setEditedSlot({ ...editedSlot, endTime: e.target.value })}
                  placeholder="End Time"
                />
                <TextInput
                  value={editedSlot.subject}
                  onChange={(e) => setEditedSlot({ ...editedSlot, subject: e.target.value })}
                  placeholder="Subject"
                />
                <Button onClick={handleSaveEditedSlot}>Save</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
