import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // We'll create this CSS file

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedHeading, setSelectedHeading] = useState(null);

  const faqs = [
    {
      heading: "1. Admission Related FAQs",
      questions: [
        "Admission process kya hai?",
        "Application form kab aata hai aur kaise fill karein?",
        "Admission ke liye kya eligibility criteria hai (UG/PG courses ke liye)?",
        "Admission me reservation (SC/ST/OBC/EWS) policy kya hai?",
        "Merit list kab release hoti hai?",
        "Entrance exam college level ka hai ya national level (like CUET, NIMCET, JEE, etc.)?",
        "Admission ke liye documents kaun se lagte hain?",
        "Admission fees kitni hai aur payment mode kya hai?",
        "Spot admission / management quota available hai kya?"
      ]
    },
    {
      heading: "2. Fees & Scholarship FAQs",
      questions: [
        "Course-wise fee structure kya hai?",
        "Hostel fees alag se deni padti hai kya?",
        "Fees online pay kar sakte hain kya?",
        "Late fees policy kya hai?",
        "Scholarship ke liye kaise apply karein?",
        "Government / minority / merit-based scholarship ka process kya hai?",
        "Refund policy kya hai agar admission cancel ho jaye?"
      ]
    },
    {
      heading: "3. Academics Related FAQs",
      questions: [
        "College me kaun kaun se courses available hain (BCA, B.Tech, MCA, etc.)?",
        "Curriculum kis university se affiliated hai?",
        "Syllabus kahan se download kar sakte hain?",
        "Class timings kya hote hain?",
        "Attendance requirement kitna hai?",
        "Examination pattern kya hai (internal, external, semester)?",
        "Back paper / revaluation ka process kya hai?"
      ]
    },
    {
      heading: "4. Faculty & Facilities FAQs",
      questions: [
        "Faculty members ka list kahan milega?",
        "Library ke timing kya hai aur card kaise banta hai?",
        "Labs aur computer centers available hain kya?",
        "Internet / Wi-Fi facilities students ke liye available hain kya?",
        "Sports aur cultural activities hoti hain kya?",
        "Medical facilities campus me hain kya?"
      ]
    },
    {
      heading: "5. Hostel & Campus Life FAQs",
      questions: [
        "Hostel facility boys/girls dono ke liye hai kya?",
        "Hostel allotment ka process kya hai?",
        "Mess facility kaisi hai?",
        "Ragging ke against kya policies hain?",
        "Campus timing aur discipline rules kya hain?",
        "Events aur fests har saal hote hain kya?"
      ]
    },
    {
      heading: "6. Placement & Training FAQs",
      questions: [
        "College me placement cell hai kya?",
        "Kaun kaun se companies aati hain placement ke liye?",
        "Average package kitna milta hai?",
        "Internship opportunities milti hain kya?",
        "Placement training ya soft skills program hota hai kya?"
      ]
    },
    {
      heading: "7. Miscellaneous / General FAQs",
      questions: [
        "College location aur nearest railway station/bus stop kaunsa hai?",
        "College ke contact details kya hain?",
        "Anti-ragging helpline number kya hai?",
        "College timing (office hours) kya hain?",
        "Identity card kaise banwate hain?",
        "Bonafide certificate / transfer certificate kaise milta hai?"
      ]
    },
    {
      heading: "8. AI Chatbot Specific FAQs (optional)",
      questions: [
        "“Yeh chatbot kya kaam karta hai?”",
        "“Agar mujhe specific query ka answer nahi mil raha toh kya karu?”",
        "“Kya mai admission office se baat kar sakta hu directly?”",
        "“Kya chatbot 24x7 available hai?”"
      ]
    }
  ];

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chatbot', {
        message: message
      });
      setMessages([...newMessages, { text: response.data.answer, sender: 'bot' }]);
    } catch (error) {
      setMessages([...newMessages, { text: 'Sorry, I could not process your request.', sender: 'bot' }]);
    }
    setLoading(false);
  };

  const handleHeadingClick = (index) => {
    setSelectedHeading(index);
  };

  const handleQuestionClick = (question) => {
    handleSend(question);
  };

  const handleBackClick = () => {
    setSelectedHeading(null);
  };

  return (
    <div className="chatbot">
      <div className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        💬 Chat with AI
      </div>
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3>College AI Assistant</h3>
          <button onClick={() => { setIsOpen(false); setMessages([]); setSelectedHeading(null); }}>✕</button>
        </div>
        <div className="chatbot-body">
          <div className="faqs">
            {selectedHeading === null ? (
              faqs.map((faq, index) => (
                <button key={index} onClick={() => handleHeadingClick(index)} className="faq-button">
                  {faq.heading}
                </button>
              ))
            ) : (
              <div>
                <button onClick={handleBackClick} className="back-button">← Back to Categories</button>
                {faqs[selectedHeading].questions.map((question, qIndex) => (
                  <button key={qIndex} onClick={() => handleQuestionClick(question)} className="faq-button">
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message bot">Typing...</div>}
          </div>
        </div>
        <div className="chatbot-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask me anything..."
          />
          <button onClick={() => handleSend(input)}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
