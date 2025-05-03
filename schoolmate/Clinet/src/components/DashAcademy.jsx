import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "./ThemeLayout";
import { 
  Card, 
  Button, 
  Textarea, 
  Table, 
  Badge, 
  Alert, 
  Spinner,
  Modal,
  Toast
} from "flowbite-react";
import { 
  HiAcademicCap, 
  HiOutlineBell, 
  HiOutlineDocumentAdd,
  HiOutlineCalendar,
  HiOutlineExclamation,
  HiOutlineTrash,
  HiOutlineCog,
  HiOutlineCheckCircle,
  HiOutlineSparkles
} from "react-icons/hi";

const DashAcademy = () => {
  const { darkMode } = useContext(ThemeContext);
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    description: "",
    priority: "normal"
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [stats, setStats] = useState({
    courses: 24,
    approvals: 5
  });

  // Load updates from localStorage
  useEffect(() => {
    const storedUpdates = localStorage.getItem("academyUpdates");
    if (storedUpdates) {
      setUpdates(JSON.parse(storedUpdates));
    } else {
      const initialUpdates = [
        { 
          id: 1, 
          title: "New Course: Machine Learning", 
          description: "Our new Machine Learning Basics course is now available for enrollment.", 
          date: "2025-03-01",
          priority: "high"
        },
        { 
          id: 2, 
          title: "Exam Schedule Update", 
          description: "Midterm exam schedule has been updated. Please check your student portal.", 
          date: "2025-02-28",
          priority: "normal"
        }
      ];
      setUpdates(initialUpdates);
      localStorage.setItem("academyUpdates", JSON.stringify(initialUpdates));
    }
  }, []);

  // Save updates to localStorage
  useEffect(() => {
    localStorage.setItem("academyUpdates", JSON.stringify(updates));
  }, [updates]);

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({...toast, show: false}), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleAddUpdate = () => {
    if (!newUpdate.title.trim() || !newUpdate.description.trim()) {
      showToast("Please fill all fields", "failure");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        title: newUpdate.title,
        description: newUpdate.description,
        priority: newUpdate.priority,
        date: new Date().toISOString().split('T')[0]
      };
      
      setUpdates([newEntry, ...updates]);
      setNewUpdate({ title: "", description: "", priority: "normal" });
      setShowModal(false);
      showToast("Update posted successfully!");
      setLoading(false);
    }, 1000);
  };

  const handleDeleteUpdate = (id) => {
    Modal.alert({
      title: "Confirm Deletion",
      body: "Are you sure you want to delete this update?",
      icon: HiOutlineExclamation,
      confirmText: "Delete",
      confirmColor: "failure",
      onConfirm: () => {
        setUpdates(updates.filter(update => update.id !== id));
        showToast("Update deleted", "warning");
      }
    });
  };

  const handleClearAll = () => {
    Modal.alert({
      title: "Clear All Updates",
      body: "This will permanently remove all updates. Continue?",
      icon: HiOutlineExclamation,
      confirmText: "Clear All",
      confirmColor: "failure",
      onConfirm: () => {
        setUpdates([]);
        showToast("All updates cleared", "warning");
      }
    });
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "failure",
      normal: "info",
      low: "success"
    };
    return (
      <Badge color={colors[priority]} className="w-fit capitalize">
        {priority}
      </Badge>
    );
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast.show && (
          <Toast className={`fixed top-4 right-4 z-50 ${toast.type === "failure" ? "bg-red-500" : toast.type === "warning" ? "bg-yellow-500" : "bg-green-500"}`}>
            <div className="flex items-center">
              {toast.type === "failure" ? (
                <HiOutlineExclamation className="h-5 w-5 text-white" />
              ) : toast.type === "warning" ? (
                <HiOutlineExclamation className="h-5 w-5 text-white" />
              ) : (
                <HiOutlineCheckCircle className="h-5 w-5 text-white" />
              )}
              <div className="ml-3 text-sm font-normal text-white">
                {toast.message}
              </div>
            </div>
          </Toast>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HiAcademicCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Academic Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage academic updates and course information
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              gradientMonochrome="cyan" 
              onClick={() => setShowModal(true)}
              className="w-full md:w-auto"
            >
              <HiOutlineDocumentAdd className="mr-2 h-5 w-5" />
              New Update
            </Button>
            <Button 
              gradientDuoTone="pinkToOrange" 
              onClick={() => window.location.href = "/admin-academy"}
              className="w-full md:w-auto"
            >
              <HiOutlineCog className="mr-2 h-5 w-5" />
              Admin Panel
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatisticCard 
            title="Total Courses" 
            value={stats.courses} 
            icon={HiAcademicCap}
            color="indigo"
            darkMode={darkMode}
          />
          <StatisticCard 
            title="Pending Approvals" 
            value={stats.approvals} 
            icon={HiOutlineExclamation}
            color="yellow"
            darkMode={darkMode}
          />
          <StatisticCard 
            title="Active Updates" 
            value={updates.length} 
            icon={HiOutlineBell}
            color="green"
            darkMode={darkMode}
          />
        </div>

        {/* Updates Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <HiOutlineBell className="w-5 h-5" />
              Academic Updates
            </h2>
            <Button 
              color="failure" 
              size="xs" 
              onClick={handleClearAll}
              disabled={updates.length === 0}
            >
              <HiOutlineTrash className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
          
          {updates.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <HiOutlineSparkles className="w-10 h-10 mx-auto mb-2" />
              No updates yet. Create your first update above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table hoverable className="rounded-none">
                <Table.Head>
                  <Table.HeadCell>Title</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Priority</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Actions</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                  {updates.map((update) => (
                    <Table.Row key={update.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {update.title}
                          {isToday(update.date) && (
                            <Badge color="info" className="text-xs">
                              Today
                            </Badge>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="max-w-xs">
                        <p className="truncate">{update.description}</p>
                      </Table.Cell>
                      <Table.Cell>
                        {getPriorityBadge(update.priority)}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <HiOutlineCalendar className="w-4 h-4" />
                          {update.date}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Button 
                          color="failure" 
                          size="xs"
                          onClick={() => handleDeleteUpdate(update.id)}
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </Card>

        {/* Create Update Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
          <Modal.Header>Create Academic Update</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Title*
                </label>
                <Textarea
                  id="title"
                  placeholder="Important Course Update"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                  required
                  rows={1}
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Description*
                </label>
                <Textarea
                  id="description"
                  placeholder="Detailed information about this update..."
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
                  required
                  rows={4}
                  maxLength={250}
                />
                <div className="text-right text-xs mt-1 text-gray-500">
                  {newUpdate.description.length}/250 characters
                </div>
              </div>
              
              <div>
                <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newUpdate.priority}
                  onChange={(e) => setNewUpdate({...newUpdate, priority: e.target.value})}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
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
              onClick={handleAddUpdate}
              disabled={loading || !newUpdate.title || !newUpdate.description}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                "Post Update"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

// Statistic Card Component
const StatisticCard = ({ title, value, icon: Icon, color, darkMode }) => {
  const colorClasses = {
    indigo: {
      bg: darkMode ? "bg-indigo-900" : "bg-indigo-100",
      text: darkMode ? "text-indigo-300" : "text-indigo-700",
      iconBg: darkMode ? "bg-indigo-800" : "bg-indigo-200",
      iconColor: darkMode ? "text-indigo-400" : "text-indigo-600"
    },
    yellow: {
      bg: darkMode ? "bg-yellow-900" : "bg-yellow-100",
      text: darkMode ? "text-yellow-300" : "text-yellow-700",
      iconBg: darkMode ? "bg-yellow-800" : "bg-yellow-200",
      iconColor: darkMode ? "text-yellow-400" : "text-yellow-600"
    },
    green: {
      bg: darkMode ? "bg-green-900" : "bg-green-100",
      text: darkMode ? "text-green-300" : "text-green-700",
      iconBg: darkMode ? "bg-green-800" : "bg-green-200",
      iconColor: darkMode ? "text-green-400" : "text-green-600"
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${colorClasses[color].bg} ${colorClasses[color].text}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].iconBg}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].iconColor}`} />
        </div>
      </div>
    </Card>
  );
};

export default DashAcademy;