import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Terminal, Cpu } from "lucide-react";
import axios from "axios";

export default function StaffPayment() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]); // New state for storing chat history

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setChatHistory([...chatHistory, message]); // Add the message to chat history
      setMessage("");
    }
  };

  const handleQuery = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
          max_tokens: 100,
        },
        {
          headers: {
            "Authorization": `Bearer YOUR_OPENAI_API_KEY`,  // Replace with your actual API key
            "Content-Type": "application/json"
          }
        }
      );

      setMessages([...messages, message, res.data.choices[0].message.content]); // Display AI response with user message
    } catch (error) {
      setMessages([...messages, message, "Error fetching AI response. Please try again."]);
    }

    setMessage(""); // Clear the input field after querying
  };

  return (
    <div className="min-h-screen flex flex-row items-center justify-center bg-[#1a1a2e] text-[#e4e3db] font-mono relative overflow-hidden p-10 gap-10">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 opacity-20 bg-gradient-to-r from-[#ffcc00] to-[#ff6699] blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      {/* Left Side - Message Input Section */}
      <motion.div 
        className="bg-[#222831] border border-[#393e46] p-6 w-96 shadow-xl rounded-lg relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl text-[#ffcc00] mb-3">Contact Us</h2>
        <input 
          className="mb-3 w-full p-2 bg-[#393e46] text-[#e4e3db] border border-[#ffcc00] rounded" 
          placeholder="Your Name" 
        />
        <textarea
          className="mb-3 w-full p-2 bg-[#393e46] text-[#e4e3db] border border-[#ffcc00] rounded"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <motion.button 
          className="w-full p-2 bg-[#ffcc00] text-[#222831] hover:bg-[#e4e3db] flex items-center justify-center gap-2 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
        >
          Send <Send size={16} />
        </motion.button>
      </motion.div>
      
      {/* Right Side - Message Log Terminal */}
      <motion.div 
        className="p-4 w-96 h-64 bg-[#161b22] border border-[#ffcc00] rounded-lg shadow-xl overflow-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-[#ffcc00] flex items-center gap-2 mb-2">
          <Terminal size={18} />
          <span>Message Log</span>
        </div>
        <div className="text-sm text-[#e4e3db] space-y-1">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet...</p>
          ) : (
            messages.map((msg, index) => (
              <p key={index}>➡ {msg}</p>
            ))
          )}
        </div>
      </motion.div>
      
      {/* New Chat History Panel */}
      <motion.div 
        className="p-4 w-96 h-64 bg-[#23272a] border border-[#ff6699] rounded-lg shadow-xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-[#ff6699] flex items-center gap-2 mb-2">
          <Cpu size={18} />
          <span>Chat History</span>
        </div>
        <div className="text-sm text-[#e4e3db] space-y-1">
          {chatHistory.length === 0 ? (
            <p className="text-gray-500">No chat history available...</p>
          ) : (
            chatHistory.map((msg, index) => (
              <p key={index}>➡ {msg}</p>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
