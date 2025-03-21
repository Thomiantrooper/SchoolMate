import React, { useState } from 'react';
import { AiOutlineMessage } from 'react-icons/ai'; // Chatbot icon
import { useNavigate } from 'react-router-dom'; // For navigating to pages

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", fromBot: true },
    { text: "You can ask about the following: School Management System, View Students, Add New Student, Teacher Schedule, Leave Requests, and more.", fromBot: true },
  ]);
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate(); // Hook to navigate to pages

  const handleUserInput = (e) => setUserInput(e.target.value);

  const handleSend = () => {
    if (userInput.trim() === "") return;

    const userMessage = { text: userInput, fromBot: false };
    const botMessage = getBotResponse(userInput);

    setMessages([...messages, userMessage, botMessage]);
    setUserInput(""); // Reset input field
  };

  const getBotResponse = (input) => {
    const lowerCaseInput = input.toLowerCase();

    if (lowerCaseInput.includes("school management system")) {
      return { text: "A School Management System is a software used to manage school data, students, teachers, schedules, fees, and more.", fromBot: true };
    }
    if (lowerCaseInput.includes("view student details") || lowerCaseInput.includes("students")) {
      return generateLinkResponse("View Student Details", "/admin-student");
    }
    if (lowerCaseInput.includes("add new student")) {
      return generateLinkResponse("Add New Student", "/admin-student");
    }
    if (lowerCaseInput.includes("view teacher schedule") || lowerCaseInput.includes("teacher schedule")) {
      return generateLinkResponse("View Teacher Schedule", "/teacher-scheduler");
    }
    if (lowerCaseInput.includes("request leave")) {
      return generateLinkResponse("Request Leave", "/leave-request");
    }
    if (lowerCaseInput.includes("manage staff")) {
      return generateLinkResponse("Manage Staff", "/admin-staff");
    }
    if (lowerCaseInput.includes("finance section") || lowerCaseInput.includes("admin finance")) {
      return generateLinkResponse("Finance Section", "/admin-finance");
    }
    if (lowerCaseInput.includes("student fees")) {
      return generateLinkResponse("Student Fees", "/admin-student-fee");
    }
    if (lowerCaseInput.includes("workload balancing") || lowerCaseInput.includes("workload")) {
      return generateLinkResponse("Workload Balancing", "/ai-workload");
    }
    if (lowerCaseInput.includes("update student details") || lowerCaseInput.includes("update student")) {
      return generateLinkResponse("Update Student Details", "/admin-student");
    }
    if (lowerCaseInput.includes("chatbot") || lowerCaseInput.includes("help")) {
      return generateLinkResponse("Chatbot Help", "/chat-bot");
    }

    return { text: "Sorry, I didn't understand that. Can you try again?", fromBot: true };
  };

  const generateLinkResponse = (text, link) => {
    return {
      text: `You can visit the page: ${text}`,
      fromBot: true,
      link: link,
    };
  };

  const handleLinkClick = (link) => {
    navigate(link);
  };

  return (
    <div style={styles.chatbotContainer}>
      {/* Robot background animation */}
      <div style={{ ...styles.robotIcon, ...styles.robotIcon1 }}></div>
      <div style={{ ...styles.robotIcon, ...styles.robotIcon2 }}></div>
      <div style={{ ...styles.robotIcon, ...styles.robotIcon3 }}></div>
      <div style={{ ...styles.robotIcon, ...styles.robotIcon4 }}></div>

      {/* Chatbot Messages */}
      <div style={styles.messages}>
        {messages.map((message, index) => (
          <div key={index} style={{ ...styles.message, ...(message.fromBot ? styles.messageBot : styles.messageUser) }}>
            {message.link ? (
              <span
                onClick={() => handleLinkClick(message.link)}
                style={styles.link}
              >
                {message.text}
              </span>
            ) : (
              <span>{message.text}</span>
            )}
          </div>
        ))}
      </div>

      {/* User Input */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={styles.input}
          placeholder="Ask me something..."
        />
        <button
          onClick={handleSend}
          style={styles.sendButton}
        >
          <AiOutlineMessage size={24} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(145deg, #6a11cb, #2575fc)',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
    maxWidth: '350px',
    width: '100%',
    zIndex: 1000,
    overflow: 'hidden',
    marginTop: '100px', // Space above chatbot for header
    marginBottom: '100px', // Space below chatbot for footer
  },
  robotIcon: {
    position: 'absolute',
    width: '50px',
    height: '50px',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    animation: 'robotAnimation 10s infinite ease-in-out',
  },
  robotIcon1: {
    top: '10%',
    left: '5%',
    backgroundImage: 'url("https://www.svgrepo.com/show/15340/robot-head.svg")',
    animationDuration: '10s',
  },
  robotIcon2: {
    top: '30%',
    left: '15%',
    backgroundImage: 'url("https://www.svgrepo.com/show/15340/robot-head.svg")',
    animationDuration: '12s',
    animationDelay: '2s',
  },
  robotIcon3: {
    top: '50%',
    left: '25%',
    backgroundImage: 'url("https://www.svgrepo.com/show/15340/robot-head.svg")',
    animationDuration: '14s',
    animationDelay: '4s',
  },
  robotIcon4: {
    top: '70%',
    left: '40%',
    backgroundImage: 'url("https://www.svgrepo.com/show/15340/robot-head.svg")',
    animationDuration: '16s',
    animationDelay: '6s',
  },
  messages: {
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  message: {
    padding: '10px',
    borderRadius: '12px',
    margin: '5px 0',
    fontSize: '14px',
  },
  messageBot: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  messageUser: {
    color: '#333',
    backgroundColor: '#f5f5f5',
  },
  link: {
    color: '#fcd34d',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    width: '100%',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
  },
  sendButton: {
    backgroundColor: '#ffdd00',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Chatbot;
