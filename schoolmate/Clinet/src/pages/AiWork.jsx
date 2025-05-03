import { useEffect, useState } from "react";
import {
  Button, Table, Badge, Modal, Alert, Spinner, Card
} from "flowbite-react";
import {
  FiUser, FiUsers, FiBook, FiRefreshCw, FiEdit2
} from "react-icons/fi";

export default function AiWork() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeStatus, setActiveStatus] = useState({});
  const [classAssignments, setClassAssignments] = useState({});
  const [leaveRequests, setLeaveRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const local = {
        teachers: localStorage.getItem("aiWork_teachers"),
        students: localStorage.getItem("aiWork_students"),
        status: localStorage.getItem("aiWork_status"),
        assignments: localStorage.getItem("aiWork_assignments"),
        leaves: localStorage.getItem("aiWork_leaves"),
      };

      if (local.teachers && local.students) {
        setTeachers(JSON.parse(local.teachers));
        setStudents(JSON.parse(local.students));
        setActiveStatus(JSON.parse(local.status || "{}"));
        setClassAssignments(JSON.parse(local.assignments || "{}"));
        setLeaveRequests(JSON.parse(local.leaves || "{}"));
      }

      await fetchData();
    } catch (err) {
      console.error("Local load error:", err);
      setError("Failed to load local data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, leaveRes] = await Promise.all([
        fetch("/api/user/users"),
        fetch("/api/leave/requests")
      ]);

      if (!userRes.ok || !leaveRes.ok) throw new Error("API failed");

      const [users, leaves] = await Promise.all([
        userRes.json(), leaveRes.json()
      ]);

      processData(users, leaves);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const processData = (users, leaves) => {
    const teacherList = users.filter(u => u.email.includes("staff"));
    const studentList = users.filter(u => u.email.includes("std")).map(s => ({
      ...s, grade: determineGrade(s.email),
    }));

    const status = {};
    users.forEach(u => {
      status[u._id] = u.isActive ?? true;
    });

    const leaveMap = {};
    leaves.forEach(l => {
      leaveMap[l.teacherId] = l.isApproved;
    });

    setTeachers(teacherList);
    setStudents(studentList);
    setActiveStatus(status);
    setLeaveRequests(leaveMap);

    localStorage.setItem("aiWork_teachers", JSON.stringify(teacherList));
    localStorage.setItem("aiWork_students", JSON.stringify(studentList));
    localStorage.setItem("aiWork_status", JSON.stringify(status));
    localStorage.setItem("aiWork_leaves", JSON.stringify(leaveMap));

    autoAssignTeachers(teacherList, status, leaveMap);
  };

  const determineGrade = (email) => {
    const match = email.match(/std_(\d{1,3})/);
    if (!match) return "Unknown";
    const number = parseInt(match[1], 10);
    return `Grade ${Math.min(Math.ceil(number / 100), 13)}`;
  };

  const autoAssignTeachers = (teachers, statusData, leaveData) => {
    const active = teachers.filter(t => statusData[t._id] && !leaveData[t._id]);
    const assignments = {};
    for (let i = 1; i <= 13; i++) {
      const t = active[i % active.length];
      assignments[`Grade ${i}`] = t ? t.username : "No teacher available";
    }
    setClassAssignments(assignments);
    localStorage.setItem("aiWork_assignments", JSON.stringify(assignments));
  };

  const toggleActiveStatus = async (userId) => {
    const newStatus = !activeStatus[userId];
    const updatedStatus = { ...activeStatus, [userId]: newStatus };

    // ✅ Always update local state + storage
    setActiveStatus(updatedStatus);
    localStorage.setItem("aiWork_status", JSON.stringify(updatedStatus));
    autoAssignTeachers(teachers, updatedStatus, leaveRequests);

    try {
      const res = await fetch(`/api/user/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error("Status toggle error:", err);
      setError("Failed to update user status.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const openAssignmentModal = (grade) => {
    setSelectedGrade(grade);
    setSelectedTeacher(classAssignments[grade]);
    setShowAssignmentModal(true);
  };

  const saveAssignment = () => {
    const updated = { ...classAssignments, [selectedGrade]: selectedTeacher };
    setClassAssignments(updated);
    localStorage.setItem("aiWork_assignments", JSON.stringify(updated));
    setShowAssignmentModal(false);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiBook className="text-blue-600" />
          AI Work Management
        </h1>
        <button
          onClick={fetchData}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition`}
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </header>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          {/* Teachers & Students */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Teachers */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiUser className="text-purple-600" />
                  Teachers
                  <Badge color="purple">{teachers.length}</Badge>
                </h2>
                <Badge color={Object.values(leaveRequests).filter(Boolean).length > 0 ? "failure" : "success"}>
                  {Object.values(leaveRequests).filter(Boolean).length} on leave
                </Badge>
              </div>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {teachers.map((t) => (
                    <Table.Row key={t._id}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center uppercase font-bold">
                            {t.username[0]}
                          </div>
                          <div>
                            <p>{t.username}</p>
                            <p className="text-sm text-gray-500">{t.email}</p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          size="xs"
                          color={leaveRequests[t._id] ? "failure" : activeStatus[t._id] ? "success" : "failure"}
                          onClick={() => toggleActiveStatus(t._id)}
                          disabled={leaveRequests[t._id]}
                        >
                          {leaveRequests[t._id] ? "On Leave" : activeStatus[t._id] ? "Active" : "Inactive"}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card>

            {/* Students */}
            <Card>
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <FiUsers className="text-green-600" />
                Students
                <Badge color="green">{students.length}</Badge>
              </h2>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Grade</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {students.slice(0, 5).map((s) => (
                    <Table.Row key={s._id}>
                      <Table.Cell>{s.username}</Table.Cell>
                      <Table.Cell><span className="text-gray-800">{s.grade}</span></Table.Cell>
                      <Table.Cell>
                        <Button
                          size="xs"
                          color={activeStatus[s._id] ? "success" : "failure"}
                          onClick={() => toggleActiveStatus(s._id)}
                        >
                          {activeStatus[s._id] ? "Active" : "Inactive"}
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Card>
          </div>

          {/* Assignments */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiBook className="text-amber-600" />
                Class Assignments
              </h2>
              <Button size="xs" color="light" onClick={() => autoAssignTeachers(teachers, activeStatus, leaveRequests)}>
                Reassign All
              </Button>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Grade</Table.HeadCell>
                <Table.HeadCell>Teacher</Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {Object.entries(classAssignments).map(([grade, teacher]) => (
                  <Table.Row key={grade}>
                    <Table.Cell><span className="text-gray-800">{grade}</span></Table.Cell>
                    <Table.Cell className={teacher === "No teacher available" ? "text-red-600" : "text-green-600"}>
                      {teacher}
                    </Table.Cell>
                    <Table.Cell>
                      <Button size="xs" color="gray" onClick={() => openAssignmentModal(grade)}>
                        <FiEdit2 className="mr-1" /> Edit
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>
        </>
      )}

      {/* Assignment Modal */}
      <Modal show={showAssignmentModal} onClose={() => setShowAssignmentModal(false)}>
        <Modal.Header>Assign Teacher to {selectedGrade}</Modal.Header>
        <Modal.Body>
          <label className="block mb-2 text-sm font-medium">Select Teacher</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">Select teacher...</option>
            {teachers
              .filter((t) => activeStatus[t._id] && !leaveRequests[t._id])
              .map((t) => (
                <option key={t._id} value={t.username}>
                  {t.username}
                </option>
              ))}
            <option value="No teacher available">Unassign</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={saveAssignment} disabled={!selectedTeacher}>Save</Button>
          <Button color="gray" onClick={() => setShowAssignmentModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
