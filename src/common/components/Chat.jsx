import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket.io/socket";

function Chat({ currentUserId, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesRef = useRef(null);
  const bottomRef = useRef(null);

  const shouldAutoScrollRef = useRef(true);

  const socketPort = "https://freelancercrm-socket-io.onrender.com";

  /* CONNECT SOCKET */
  useEffect(() => {
    if (!socket.connected) socket.connect();
    return () => socket.off("receiveMessage");
  }, []);

  /* LOAD HISTORY */
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const loadHistory = async () => {
      setLoading(true);
      const res = await fetch(
        `${socketPort}/chat-history/${currentUserId}/${otherUserId}`
      );
      const data = await res.json();
      setMessages(data || []);
      setLoading(false);
    };

    loadHistory();
  }, [currentUserId, otherUserId]);

  /* TRACK USER SCROLL */
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    const onScroll = () => {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      shouldAutoScrollRef.current = nearBottom;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* RECEIVE MESSAGE */
  useEffect(() => {
    const handler = (msg) => {
      const valid =
        (msg.senderId === currentUserId &&
          msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId &&
          msg.receiverId === currentUserId);

      if (!valid) return;
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, [currentUserId, otherUserId]);

  /* AUTO SCROLL (ONLY WHEN ALLOWED) */
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`,
        senderId: currentUserId,
        receiverId: otherUserId,
        text: newMessage,
      },
    ]);

    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: otherUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white rounded-2xl overscroll-contain">
      {/* HEADER */}
      <div className="h-14 px-5 flex items-center border-b border-gray-800 font-semibold">
        Chat
      </div>

      {/* MESSAGES */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3 chat-scrollbar"
      >
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg text-sm wrap-break-word ${
                    isMe
                      ? "bg-blue-600 rounded-br-none"
                      : "bg-gray-700 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="h-16 px-4 flex items-center gap-3 border-t border-gray-800 bg-gray-900">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
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
