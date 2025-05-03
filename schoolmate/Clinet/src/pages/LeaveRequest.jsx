import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  TextInput,
  Textarea,
  Table,
  Badge,
  Alert,
  Spinner,
  Modal,
  Select,
  Datepicker
} from "flowbite-react";
import {
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlinePlus,
  HiOutlineCog
} from "react-icons/hi";

function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    staffId: "",
    leaveType: "annual",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Leave type options
  const leaveTypes = [
    { value: "annual", label: "Annual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
    { value: "unpaid", label: "Unpaid Leave" },
    { value: "other", label: "Other" }
  ];

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/leaveRequests");
        if (!response.ok) throw new Error("Failed to fetch leave requests");
        const data = await response.json();
        setLeaveRequests(data);
      } catch (error) {
        setMessage({ text: error.message, type: "failure" });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle date changes
  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date.toISOString().split('T')[0] });
  };

  // Submit leave request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Leave request submitted successfully!", type: "success" });
        setLeaveRequests([...leaveRequests, data]);
        setFormData({
          staffId: "",
          leaveType: "annual",
          startDate: "",
          endDate: "",
          reason: ""
        });
        setShowModal(false);
      } else {
        throw new Error(data.message || "Failed to submit leave request");
      }
    } catch (error) {
      setMessage({ text: error.message, type: "failure" });
    } finally {
      setLoading(false);
    }
  };

  // Get badge color based on status
  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge color="success" icon={HiOutlineCheckCircle}>
        Approved
      </Badge>
    ) : (
      <Badge color="failure" icon={HiOutlineXCircle}>
        Pending
      </Badge>
    );
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Leave Request Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Submit and track employee leave requests
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              gradientMonochrome="cyan" 
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto"
            >
              <HiOutlinePlus className="mr-2 h-5 w-5" />
              New Request
            </Button>
            <Button 
              color="light" 
              onClick={toggleDarkMode}
              className="w-full md:w-auto"
            >
              <HiOutlineCog className="mr-2 h-5 w-5" />
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <Alert color={message.type} className="mb-6" onDismiss={() => setMessage({ text: "", type: "" })}>
            {message.text}
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Requests
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {leaveRequests.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <HiOutlineDocumentText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Approved
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {leaveRequests.filter(req => req.active).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <HiOutlineCheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Pending
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {leaveRequests.filter(req => !req.active).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <HiOutlineRefresh className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Leave Requests Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Leave Requests
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <Spinner size="xl" />
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No leave requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table hoverable className="rounded-none">
                <Table.Head>
                  <Table.HeadCell>Staff ID</Table.HeadCell>
                  <Table.HeadCell>Leave Type</Table.HeadCell>
                  <Table.HeadCell>Start Date</Table.HeadCell>
                  <Table.HeadCell>End Date</Table.HeadCell>
                  <Table.HeadCell>Reason</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                  {leaveRequests.map((request) => (
                    <Table.Row key={request._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <HiOutlineUser className="w-4 h-4" />
                          {request.staffId}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="info" className="capitalize">
                          {request.leaveType}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1">
                          <HiOutlineCalendar className="w-4 h-4" />
                          {new Date(request.startDate).toLocaleDateString()}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1">
                          <HiOutlineCalendar className="w-4 h-4" />
                          {new Date(request.endDate).toLocaleDateString()}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="max-w-xs truncate">
                        {request.reason}
                      </Table.Cell>
                      <Table.Cell>
                        {getStatusBadge(request.active)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </Card>

        {/* New Request Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
          <Modal.Header>New Leave Request</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="staffId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Staff ID*
                </label>
                <TextInput
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  placeholder="Enter staff ID"
                  required
                  icon={HiOutlineUser}
                />
              </div>
              
              <div>
                <label htmlFor="leaveType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Leave Type*
                </label>
                <Select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  required
                >
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Start Date*
                  </label>
                  <Datepicker
                    id="startDate"
                    name="startDate"
                    onSelectedDateChanged={(date) => handleDateChange(date, "startDate")}
                    placeholder="Select start date"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    End Date*
                  </label>
                  <Datepicker
                    id="endDate"
                    name="endDate"
                    onSelectedDateChanged={(date) => handleDateChange(date, "endDate")}
                    placeholder="Select end date"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Reason*
                </label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Enter reason for leave"
                  required
                  rows={4}
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="flex justify-end gap-3">
            <Button 
              color="gray" 
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              gradientDuoTone="cyanToBlue"
              onClick={handleSubmit}
              disabled={loading || !formData.staffId || !formData.startDate || !formData.endDate || !formData.reason}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                "Submit Request"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default LeaveRequest;