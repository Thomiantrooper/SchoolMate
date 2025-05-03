import React from 'react';
import {
  HiAcademicCap,
  HiChartBar,
  HiDownload,
  HiUserCircle,
  HiTrendingUp,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import { Progress, Badge, Button } from 'flowbite-react';
import { motion } from 'framer-motion';

const StudentAcademicProfile = () => {
  const studentData = {
    name: 'Sahan Gamage',
    terms: [
      {
        name: '1st Term',
        subjectsCount: 2,
        total: 55,
        average: 27.5,
        progress: 28,
        icon: <HiOutlineClipboardList className="text-blue-600" />,
        color: 'blue',
      },
      {
        name: '2nd Term',
        subjectsCount: 5,
        total: 350,
        average: 70,
        progress: 70,
        icon: <HiOutlineClipboardList className="text-green-600" />,
        color: 'green',
      },
    ],
  };

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <HiUserCircle size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Student Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
        </div>
        <Button outline gradientDuoTone="purpleToBlue" className="flex items-center gap-2">
          <HiDownload /> Download Full Report
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium whitespace-nowrap">
          Academic Marks
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
          Activities
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
          Download Report
        </button>
      </div>

      {/* Student Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <HiAcademicCap size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Academic Overview</h2>
        </div>

        {/* Term Reports */}
        {studentData.terms.map((term, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6 last:mb-0"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${colorMap[term.color] || colorMap.gray}`}>
                  {term.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{term.name} Report</h3>
                <Badge color="gray" className="ml-2">
                  {term.subjectsCount} subjects assessed
                </Badge>
              </div>

              <div className="flex gap-3">
                <Badge color="green" className="px-3 py-1.5">
                  <span className="font-medium">Total:</span> {term.total}
                </Badge>
                <Badge color="blue" className="px-3 py-1.5">
                  <span className="font-medium">Average:</span> {term.average}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Performance Progress</span>
                <span className="font-medium">{term.progress}%</span>
              </div>
              <Progress
                progress={term.progress}
                color={
                  term.progress >= 75
                    ? 'green'
                    : term.progress >= 50
                    ? 'yellow'
                    : 'red'
                }
                size="lg"
                className="h-3"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Needs Improvement</span>
                <span>Excellent</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
              <HiTrendingUp size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Performance Trends</h3>
          </div>
          <p className="text-gray-600">
            View your academic progress over time and identify areas for improvement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <HiChartBar size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Subject Analysis</h3>
          </div>
          <p className="text-gray-600">
            Detailed breakdown of your performance in each subject area.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentAcademicProfile;
