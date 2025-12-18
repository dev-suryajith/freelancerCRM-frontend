import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: true,
});

function Chat({ currentUserId, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  // 🔹 1. LOAD HISTORY (ALWAYS WORKS – ONLINE/OFFLINE)
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/chat-history/${currentUserId}/${otherUserId}`
        );
        const data = await res.json();
        setMessages(data); // ← DB is source of truth
      } catch (err) {
        console.error("History load failed", err);
      }
    };

    loadHistory();
  }, [currentUserId, otherUserId]);

  // 🔹 2. RECEIVE REALTIME MESSAGES
  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => {
        // avoid duplicates
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, []);

  // 🔹 3. SEND MESSAGE
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: otherUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  // 🔹 4. AUTOSCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="font-semibold">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  isMe
                    ? "bg-blue-600 rounded-br-none"
                    : "bg-gray-700 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 flex gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-800 rounded-lg outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-blue-600 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
