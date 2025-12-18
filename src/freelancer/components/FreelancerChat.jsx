import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket.io/socket";


function FreelancerChat({ userId, clientId }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        socket.connect();
        socket.emit("join_private_chat", { userId, clientId });

        socket.on("receive_private_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receive_private_message");
            socket.disconnect();
        };
    }, [userId, clientId]);

    // Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;

        socket.emit("send_private_message", {
            senderId: userId,
            receiverId: clientId,
            message,
        });

        setMessage("");
    };

    return (
        <div className="h-full w-full flex flex-col bg-gray-100 rounded-xl shadow-lg">

            {/* Header */}
            <div className="px-4 py-3 bg-white border-b rounded-t-xl font-semibold">
                Chat with <span className="text-blue-600">{clientId}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => {
                    const isMe = m.senderId === userId;

                    return (
                        <div
                            key={i}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                  ${isMe
                                        ? "bg-blue-500 text-white rounded-br-sm"
                                        : "bg-white text-gray-800 rounded-bl-sm"
                                    }`}
                            >
                                {m.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t flex gap-2 rounded-b-xl">
                <input
                    className="flex-1 border text-black rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 rounded-full"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default FreelancerChat;

