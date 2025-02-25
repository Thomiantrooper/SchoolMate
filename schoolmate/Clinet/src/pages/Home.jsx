import React, { useState, useEffect } from 'react';

export default function SchoolHomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/school-data')
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data.announcements);
        setEvents(data.events);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching school data:', error);
        setError('Failed to load school data.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to Our School</h1>
      
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Announcements Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Latest Announcements</h2>
        <ul className="list-disc pl-5">
          {announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <li key={index} className="mb-1">{announcement}</li>
            ))
          ) : (
            <p>No announcements at the moment.</p>
          )}
        </ul>
      </div>

      {/* Subjects Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Subjects Offered</h2>
        <div className="grid grid-cols-3 gap-4">
          {["Mathematics", "Science", "History", "English", "Computer Science", "Physical Education"].map((subject, index) => (
            <div key={index} className="bg-blue-200 p-4 rounded-lg text-center shadow-md">{subject}</div>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Upcoming Events</h2>
        <ul className="list-disc pl-5">
          {events.length > 0 ? (
            events.map((event, index) => (
              <li key={index} className="mb-1">{event}</li>
            ))
          ) : (
            <p>No upcoming events.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
