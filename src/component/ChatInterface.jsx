import React, { useState } from "react";
import "./ChatInterface.css";

export default function ChatInterface() {
  const [userText, setUserText] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!userText.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userText }];
    setMessages(newMessages);
    setUserText("");

    try {
      const res = await fetch("http://localhost:5000/generate-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await res.json();
      const intent = data.ai_response;

      let botResponse = "";

      switch (intent) {
        case "qa_factoid":
          botResponse = "Reaching FAQ Section...";
          break;
        case "qa_complaint":
          botResponse = "Reaching Complaint Section...";
          break;
        case "qa_accounts":
          botResponse = "Reaching Account Section...";
          break;
        case "qa_greetings":
          botResponse = "Please ask queries only."
          break;
        default:
          botResponse = "Sorry, I didn't understand that.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to server." }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat Assistant</div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          className="chat-input"
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="chat-send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
