import { useState, useContext } from "react";
import { ThemeContext } from "./ThemeLayout";
import { 
  Card, 
  Button, 
  Textarea, 
  Table, 
  Badge, 
  Alert, 
  Spinner,
  Modal
} from "flowbite-react";
import { 
  HiUserGroup, 
  HiOutlineBell, 
  HiOutlineDocumentAdd,
  HiOutlineCalendar,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineCog
} from "react-icons/hi";

const DashStaff = () => {
  const { darkMode } = useContext(ThemeContext); 
  const [announcements, setAnnouncements] = useState([
    { 
      id: 1, 
      title: "Monthly Staff Meeting", 
      description: "All staff members are required to attend the monthly meeting on March 5th at 10:00 AM in the conference room.", 
      date: "2025-03-01",
      priority: "high"
    },
    { 
      id: 2, 
      title: "HR Policy Updates", 
      description: "New HR policies regarding leave and remote work have been updated in the portal. Please review them by March 15th.", 
      date: "2025-02-28",
      priority: "medium"
    }
  ]);
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    priority: "low"
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title.trim() === "" || newAnnouncement.description.trim() === "") {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnnouncements([
        { 
          id: announcements.length + 1, 
          title: newAnnouncement.title,
          description: newAnnouncement.description,
          priority: newAnnouncement.priority,
          date: new Date().toISOString().split('T')[0] 
        },
        ...announcements
      ]);
      
      setNewAnnouncement({
        title: "",
        description: "",
        priority: "low"
      });
      setSuccessMessage("Announcement posted successfully!");
      setShowModal(false);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "failure",
      medium: "warning",
      low: "success"
    };
    return (
      <Badge color={colors[priority]} className="w-fit capitalize">
        {priority}
      </Badge>
    );
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HiUserGroup className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Staff Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage staff communications and announcements
            </p>
          </div>
          
          <Button 
            gradientDuoTone="cyanToBlue" 
            onClick={() => window.location.href = "/admin-staff"}
            className="w-full md:w-auto"
          >
            <HiOutlineCog className="mr-2 h-5 w-5" />
            Admin Panel
          </Button>
        </div>

        {successMessage && (
          <Alert color="success" className="mb-6">
            {successMessage}
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total Staff
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  45
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <HiUserGroup className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Pending Requests
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  3
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <HiOutlineExclamationCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Announcements
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {announcements.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <HiOutlineBell className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Create Announcement Button */}
        <div className="flex justify-end mb-6">
          <Button 
            gradientMonochrome="cyan" 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto"
          >
            <HiOutlineDocumentAdd className="mr-2 h-5 w-5" />
            New Announcement
          </Button>
        </div>

        {/* Announcements Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <HiOutlineBell className="w-5 h-5" />
              Recent Announcements
            </h2>
          </div>
          
          {announcements.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No announcements yet. Create your first announcement above.
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
                    <span className="sr-only">Action</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y dark:divide-gray-700">
                  {announcements.map((announcement) => (
                    <Table.Row key={announcement.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {announcement.title}
                      </Table.Cell>
                      <Table.Cell className="max-w-xs truncate">
                        {announcement.description}
                      </Table.Cell>
                      <Table.Cell>
                        {getPriorityBadge(announcement.priority)}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <HiOutlineCalendar className="w-4 h-4" />
                          {announcement.date}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Button 
                          color="light" 
                          size="xs"
                          onClick={() => {/* View details action */}}
                        >
                          <HiOutlineArrowRight className="w-4 h-4" />
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </Card>

        {/* Create Announcement Modal */}
        <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
          <Modal.Header>Create New Announcement</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Title*
                </label>
                <Textarea
                  id="title"
                  placeholder="Enter announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
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
                  placeholder="Enter detailed announcement"
                  value={newAnnouncement.description}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, description: e.target.value})}
                  required
                  rows={4}
                />
              </div>
              
              <div>
                <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
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
              onClick={handleAddAnnouncement}
              disabled={loading || !newAnnouncement.title || !newAnnouncement.description}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                "Post Announcement"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DashStaff;