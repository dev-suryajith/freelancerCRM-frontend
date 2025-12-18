import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket.io/socket";

function Chat({ currentUserId, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  /* LOAD HISTORY */
  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    (async () => {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/chat-history/${currentUserId}/${otherUserId}`
      );
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    })();
  }, [currentUserId, otherUserId]);

  /* RECEIVE LIVE MESSAGE */
  useEffect(() => {
    const handler = (msg) => {
      // only messages of this chat
      if (
        !(
          (msg.senderId === currentUserId &&
            msg.receiverId === otherUserId) ||
          (msg.senderId === otherUserId &&
            msg.receiverId === currentUserId)
        )
      )
        return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, [currentUserId, otherUserId]);

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        _id: tempId,
        senderId: currentUserId,
        receiverId: otherUserId,
        text: newMessage,
      },
    ]);

    socket.emit(
      "sendMessage",
      {
        senderId: currentUserId,
        receiverId: otherUserId,
        text: newMessage,
      },
      (ack) => {
        if (ack?.success) {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempId ? ack.message : m))
          );
        }
      }
    );

    setNewMessage("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-xl">
      <div className="px-6 py-4 border-b border-gray-800 font-semibold">
        Chat
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
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
                  className={`px-4 py-2 rounded-lg text-sm ${
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

      <div className="p-4 border-t border-gray-800 flex gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-800 rounded-lg"
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
